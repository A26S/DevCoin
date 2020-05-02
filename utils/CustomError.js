class CustomError extends Error {
    constructor(message, status) {
        super(message)
        this.message = message || 'an unknown error occured'
        this.status = status
    }
}

module.exports = CustomError