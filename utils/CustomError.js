class CustomError extends Error {
    constructor(msg, statusCode, ...args) {
        super(...args)
        this.msg = msg
        this.statusCode = statusCode || 500
    }
}

module.exports = CustomError