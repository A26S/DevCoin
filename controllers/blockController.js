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


const adjustDifficulty = (difficulty, currentTime) => {
    Date.now() - currentTime > MINE_RATE ? difficulty-- : difficulty++
    return difficulty
}

exports.adjustDifficulty = adjustDifficulty
exports.getHashAndDifficulty = getHashAndDifficulty