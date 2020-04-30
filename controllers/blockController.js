const crypto = require('crypto')
const { MINE_RATE } = process.env

const getHashAndDifficulty = async id => {
    const Block = require('../models/Block')
    const block = await Block.findById(id)
    const previousHash = block.hash
    const difficulty = block.difficulty
    return {
        previousHash,
        difficulty
    }
} 

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
exports.getHashAndDifficulty = getHashAndDifficulty