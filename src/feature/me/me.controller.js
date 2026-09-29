const meService = require('./me.service');
const { SuccessResponse } = require('../../core/success.response');
const { BadRequestError } = require('../../core/error.response');
const K = require('../../common/k');

const getInformation = async (req, res, next) => {
    try {
        const id = req.user.idUser;
        const user = await meService.getInformation(id);
        
        new SuccessResponse({
            message: 'Lấy thông tin tài khoản thành công',
            data: user
        }).send(res);
    } catch (error) {
        next(error);
    }
}

const updateInformation = async (req, res, next) => {
    try {
        const { displayName, numberPhone } = req.body;
        const id = req.user.idUser;

        const user = await meService.updateInformation({
            id,
            displayName,
            numberPhone
        });

        new SuccessResponse({
            message: 'Cập nhật thông tin thành công',
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

        await meService.changePassword({ id, oldPassword, newPassword });
        
        new SuccessResponse({
            message: 'Đổi mật khẩu thành công',
            data: null
        }).send(res);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getInformation,
    updateInformation,
    changePassword
};
