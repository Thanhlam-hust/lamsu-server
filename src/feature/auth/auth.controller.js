const authService = require('./auth.service');
const { SuccessResponse } = require('../../core/success.response');
const { BadRequestError } = require('../../core/error.response');
const K = require('../../common/k');

const register = async (req, res, next) => {
    try {
        const { email, numberPhone, displayName, password, role } = req.body;
        if (!email || !password || !displayName) {
            throw new BadRequestError({
                message: 'Vui lòng cung cấp đầy đủ email, password và displayName.',
                code: K.CODE_MISSING_DATA
            });
        }
        if (!role) {
            throw new BadRequestError({
                message: 'Vui lòng cung cấp role.',
                code: K.CODE_MISSING_DATA
            });
        }
        if (!K.ROLES.includes(role)) {
            throw new BadRequestError({
                message: 'Role không hợp lệ.',
                code: K.CODE_INVALID_FORMAT
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new BadRequestError({
                message: 'Email không đúng định dạng.',
                code: K.CODE_INVALID_FORMAT
            });
        }
        const newAdmin = await authService.register({
            email, numberPhone, displayName, password, role
        });
        new SuccessResponse({
            message: 'Đăng ký tài khoản thành công',
            data: newAdmin,
            access_token: null,
            refresh_token: null
        }).send(res);

    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new BadRequestError({
                message: 'Vui lòng cung cấp email và password.',
                code: K.CODE_MISSING_DATA
            });
        }

        const { user, access_token, refresh_token } = await authService.login({ email, password });

        new SuccessResponse({
            message: 'Đăng nhập thành công',
            data: user,
            access_token,
            refresh_token
        }).send(res);

    } catch (error) {
        next(error);
    }
}


const resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            throw new BadRequestError({
                message: 'Vui lòng cung cấp email và newPassword.',
                code: K.CODE_MISSING_DATA
            });
        }
        await authService.resetPassword({ email, newPassword });
        new SuccessResponse({
            message: 'Đặt lại mật khẩu thành công',
            data: null
        }).send(res);
    } catch (error) {
        next(error);
    }
}

const updateInformation = async (req, res, next) => {
    try {
        const { displayName, numberPhone, role, isActive } = req.body;
        const requester = req.user;
        const id = requester.idUser;

        const user = await authService.updateInformation({
            id,
            displayName,
            numberPhone,
            role,
            isActive,
            requester
        });

        new SuccessResponse({
            message: 'Cập nhật thông tin thành công',
            data: user
        }).send(res);

    } catch (error) {
        next(error);
    }
}

const getInformation = async (req, res, next) => {
    try {
        const id = req.user.idUser;
        const user = await authService.getInformation(id);

        new SuccessResponse({
            message: 'Lấy thông tin tài khoản thành công',
            data: user
        }).send(res);
    } catch (error) {
        next(error);
    }
}

const changePassword = async (req, res, next) => {
    try {
        const id = req.user.idUser;
        const { oldPassword, newPassword } = req.body;
        
        if (!oldPassword || !newPassword) {
            throw new BadRequestError({
                message: 'Vui lòng cung cấp mật khẩu cũ và mật khẩu mới.',
                code: K.CODE_MISSING_DATA
            });
        }

        await authService.changePassword({ id, oldPassword, newPassword });
        
        new SuccessResponse({
            message: 'Đổi mật khẩu thành công',
            data: null
        }).send(res);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
    resetPassword,
    updateInformation,
    getInformation,
    changePassword
};
