const jwt = require('jsonwebtoken');
const { ErrorResponse } = require('../core/error.response');
const K = require('../common/k');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(new ErrorResponse({
            message: 'Không tìm thấy Token. Vui lòng đăng nhập.',
            statusCode: K.STATUS_UNAUTHORIZED,
            code: K.CODE_TOKEN_INVALID
        }));
    }

    try {
        const JWT_SECRET = process.env.JWT_SECRET || 'lamsu_secret';
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { idUser, role }
        next();
    } catch (err) {
        return next(new ErrorResponse({
            message: 'Token không hợp lệ hoặc đã hết hạn.',
            statusCode: K.STATUS_UNAUTHORIZED,
            code: K.CODE_TOKEN_INVALID
        }));
    }
};

module.exports = {
    verifyToken
};
