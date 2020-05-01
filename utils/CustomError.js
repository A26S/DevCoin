class CustomError extends Error {
    constructor(msg, ...params) {
        super(...params)
        this.msg = msg
        this.status = status || 500
    }
}

module.exports = CustomError