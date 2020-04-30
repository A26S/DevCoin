const crypto = require('crypto')

const computeHash = (timestamp, previousHash, transactions, nonce) => {
    const { createHash } = crypto
    const hash = createHash('SHA256')
    hash.update(`${timestamp}-${previousHash}-${transactions}-${nonce}`)
    // const decoded = 
    // console.log(decoded)
    return hash.digest('hex')
}

exports.computeHash = computeHash