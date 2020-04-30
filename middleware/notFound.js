const CustomError = require('../utils/CustomError')

const notFound = (req, res, next) => {
    const error = new CustomError('no route matches the path', 404)
    return next(error)
}

module.exports = notFound