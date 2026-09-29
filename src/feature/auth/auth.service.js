const Auth = require('./auth.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ConflictError, BadRequestError } = require('../../core/error.response');
const K = require('../../common/k');

const register = async ({ email, numberPhone, displayName, password, role }) => {
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
        throw new ConflictError({
            message: 'Email này đã được sử dụng.',
            code: 5
        });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newAdmin = await Auth.create({
        email,
        password: hashedPassword,
        displayName,
        numberPhone,
        role: role
    });

    return newAdmin;
};

const login = async ({ email, password }) => {
    const user = await Auth.findOne({ email });
    if (!user) {
        throw new BadRequestError({
            message: 'Tài khoản không tồn tại.',
            code: K.CODE_DATA_NOT_FOUND
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new BadRequestError({
            message: 'Sai mật khẩu.',
            code: K.CODE_WRONG_PASSWORD
        });
    }

    const payload = { idUser: user._id, role: user.role };
    const JWT_SECRET = process.env.JWT_SECRET || 'lamsu_secret';
    const access_token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const refresh_token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    user.refreshToken = refresh_token;
    await user.save();

    return {
        user,
        access_token,
        refresh_token
    };
};

const updateInformation = async ({ id, displayName, numberPhone, role, isActive, requester }) => {
    const user = await Auth.findById(id);

    if (!user) {
        throw new BadRequestError({
            message: 'Tài khoản không tồn tại.',
            code: K.CODE_DATA_NOT_FOUND
        });
    }

    // Người dùng chỉ được sửa thông tin của chính mình
    // Admin có thể sửa tài khoản của người khác
    if (requester.idUser.toString() !== id && requester.role !== 'admin') {
        throw new BadRequestError({
            message: 'Bạn không có quyền cập nhật tài khoản này.',
            code: K.CODE_FORBIDDEN
        });
    }

    // Thông tin cơ bản
    if (displayName !== undefined) {
        user.displayName = displayName;
    }

    if (numberPhone !== undefined) {
        user.numberPhone = numberPhone;
    }

    if (requester.role === 'admin') {
        if (role !== undefined) {
            user.role = role;
        }

        if (isActive !== undefined) {
            user.isActive = isActive;
        }
    }
    await user.save();
    return user;
};

const refreshToken = async ({ refresh_token }) => {
    if (!refresh_token) {
        throw new BadRequestError({
            message: 'Refresh token không được để trống.',
            code: K.CODE_MISSING_DATA
        });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'lamsu_secret';

    let decoded;

    try {
        decoded = jwt.verify(refresh_token, JWT_SECRET);
    } catch (error) {
        throw new BadRequestError({
            message: 'Refresh token không hợp lệ hoặc đã hết hạn.',
            code: K.CODE_INVALID_TOKEN
        });
    }

    const user = await Auth.findById(decoded.idUser);

    if (!user) {
        throw new BadRequestError({
            message: 'Tài khoản không tồn tại.',
            code: K.CODE_DATA_NOT_FOUND
        });
    }

    // Kiểm tra refresh token gửi lên có đúng token đang lưu DB không
    if (user.refreshToken !== refresh_token) {
        throw new BadRequestError({
            message: 'Refresh token không hợp lệ.',
            code: K.CODE_INVALID_TOKEN
        });
    }

    const payload = {
        idUser: user._id,
        role: user.role
    };

    // Tạo access token mới
    const access_token = jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Tạo refresh token mới
    const new_refresh_token = jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    // Lưu refresh token mới
    user.refreshToken = new_refresh_token;
    await user.save();

    return {
        user,
        access_token,
        refresh_token: new_refresh_token
    };
};

module.exports = {
    register,
    login,
    updateInformation,
    refreshToken

};
