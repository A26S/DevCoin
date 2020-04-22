const crypto = require('crypto')

const computeHash = (timestamp, previousHash, transactions) => {
    const { createHash } = crypto
    const hash = createHash('SHA256')
    hash.update(`${timestamp}-${previousHash}-${transactions}`)
    const decoded = hash.digest('hex')
    return decoded
}

exports.computeHash = computeHash