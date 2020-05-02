const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error)
    }
    const { name, message, status } = error
    const warning = `${name}: ${message}`
    return res.status(status || 500).json({
        warning
    })
}

module.exports = errorHandler