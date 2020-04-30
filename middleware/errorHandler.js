const errorHandler = (error, req, res, next) => {
    const { msg, name, fileName, lineNumber, status } = error
    const message = `${name}: ${error.message}`
    const at = `${fileName}, line: ${lineNumber}`
    return res.status(status).json({
        msg,
        message,
        at
    })
}

module.exports = errorHandler