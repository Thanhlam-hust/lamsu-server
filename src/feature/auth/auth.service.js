const Auth = require('../../models/auth.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ConflictError, BadRequestError } = require('../../core/error.response');
const K = require('../../common/k');

const register = async ({
    email,
    numberPhone,
    displayName,
    password,
    role,
    branchId
}) => {
    const existingUser = await Auth.findOne({ email });

    if (existingUser) {
        throw new ConflictError({
            message: 'Email này đã được sử dụng.',
            code: 5
        });
    }

    if (role === 'manager' && branchId) {
        const Branch = require('../../models/branch.model');
        const branch = await Branch.findById(branchId);
        if (!branch) {
            throw new BadRequestError({
                message: 'Chi nhánh không tồn tại.',
                code: K.CODE_DATA_NOT_FOUND
            });
        }
        if (branch.managerId) {
            throw new ConflictError({
                message: 'Chi nhánh này đã có quản lý.',
                code: K.CODE_DATA_EXISTS
            });
        }
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await Auth.create({
        email,
        password: hashedPassword,
        displayName,
        numberPhone,
        role,
        branchId
    });

    if (role === 'manager' && branchId) {
        const Branch = require('../../models/branch.model');
        const branch = await Branch.findById(branchId);
        branch.managerId = newUser._id;
        await branch.save();
    }

    return newUser;
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


const resetPassword = async ({ email, newPassword }) => {
    const user = await Auth.findOne({ email });
    if (!user) {
        throw new BadRequestError({
            message: 'Tài khoản không tồn tại.',
            code: K.CODE_DATA_NOT_FOUND
        });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    await user.save();

    return user;
};



const updateInformation = async ({ id, displayName, numberPhone, role, status, requester }) => {
    const user = await Auth.findById(id);

    if (!user) {
        throw new BadRequestError({
            message: 'Tài khoản không tồn tại.',
            code: K.CODE_DATA_NOT_FOUND
        });
    }

    if (requester.idUser.toString() !== id && requester.role !== 'admin') {
        throw new BadRequestError({
            message: 'Bạn không có quyền cập nhật tài khoản này.',
            code: K.CODE_UNAUTHORIZED_ACTION
        });
    }

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

        if (status !== undefined) {
            user.status = status;
        }
    }
    await user.save();
    return user;
};

const getInformation = async (id) => {
    const user = await Auth.findById(id);
    if (!user) {
        throw new BadRequestError({
            message: 'Tài khoản không tồn tại.',
            code: K.CODE_DATA_NOT_FOUND
        });
    }
    return user;
};

const changePassword = async ({ id, oldPassword, newPassword }) => {
    const user = await Auth.findById(id);
    if (!user) {
        throw new BadRequestError({
            message: 'Tài khoản không tồn tại.',
            code: K.CODE_DATA_NOT_FOUND
        });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new BadRequestError({
            message: 'Mật khẩu cũ không chính xác.',
            code: K.CODE_WRONG_PASSWORD
        });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
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
    resetPassword,
    updateInformation,
    getInformation,
    changePassword,
    refreshToken
};
