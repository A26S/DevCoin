const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error)
    }
    const { msg, name, fileName, lineNumber, status } = error
    const message = `${name}: ${error.message}`
    const at = `${fileName}, line: ${lineNumber}`
    return res.status(500).json({
        msg,
        message,
        at
    })
}

module.exports = errorHandler