class SuccessResponse {
    constructor({ message, statusCode = 200, data = null, ...options }) {
        this.message = message;
        this.status = 'success';
        this.statusCode = statusCode;
        this.data = data;
        this.options = options;
    }

    send(res) {
        const response = {
            status: this.status,
            message: this.message,
            ...this.options
        };
        
        if (this.data !== null && this.data !== undefined) {
            response.data = this.data;
        }

        return res.status(this.statusCode).json(response);
    }
}

module.exports = { SuccessResponse };
