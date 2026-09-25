const K = require('../common/k');

class ErrorResponse extends Error {
    constructor({ message, statusCode, code = null }) {
        super(message);
        this.statusCode = statusCode;
        this.status = 'error';
        this.code = code;
    }
}

class BadRequestError extends ErrorResponse {
    constructor({ message = 'Dữ liệu không hợp lệ', code = null } = {}) {
        super({ message, statusCode: K.STATUS_BAD_REQUEST, code });
    }
}

class ConflictError extends ErrorResponse {
    constructor({ message = 'Dữ liệu đã tồn tại', code = null } = {}) {
        super({ message, statusCode: K.STATUS_CONFLICT, code });
    }
}

class NotFoundError extends ErrorResponse {
    constructor({ message = 'Không tìm thấy', code = null } = {}) {
        super({ message, statusCode: K.STATUS_NOT_FOUND, code });
    }
}

module.exports = {
    ErrorResponse,
    BadRequestError,
    ConflictError,
    NotFoundError
};
