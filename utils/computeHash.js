const crypto = require('crypto')

const computeHash = (timestamp, previousHash, transactions) => {
    const { createHash } = crypto
    const hash = createHash('SHA256')
    hash.update(`${timestamp}-${previousHash}-${transactions}`)
    // const decoded = 
    // console.log(decoded)
    return hash.digest('hex')
}

exports.computeHash = computeHash