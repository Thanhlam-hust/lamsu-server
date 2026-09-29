const Auth = require('../auth/auth.model');
const bcrypt = require('bcrypt');
const { BadRequestError } = require('../../core/error.response');
const K = require('../../common/k');

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

const updateInformation = async ({ id, displayName, numberPhone }) => {
    const user = await Auth.findById(id);
    if (!user) {
        throw new BadRequestError({
            message: 'Tài khoản không tồn tại.',
            code: K.CODE_DATA_NOT_FOUND
        });
    }

    if (displayName !== undefined) user.displayName = displayName;
    if (numberPhone !== undefined) user.numberPhone = numberPhone;

    await user.save();
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

module.exports = {
    getInformation,
    updateInformation,
    changePassword
};
