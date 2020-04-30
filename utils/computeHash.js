const crypto = require('crypto')
const { MINE_RATE } = process.env

const computeHash = (timestamp, previousHash, transactions, nonce) => {
    const { createHash } = crypto
    const hash = createHash('SHA256')
    hash.update(`${timestamp}-${previousHash}-${transactions}-${nonce}`)
    return hash.digest('hex')
}

const adjustDifficulty = (difficulty, currentTime) => {
    Date.now() - currentTime > MINE_RATE ? difficulty-- : difficulty++
    return difficulty
}

exports.computeHash = computeHash
exports.adjustDifficulty = adjustDifficulty