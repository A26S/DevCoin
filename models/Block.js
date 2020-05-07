const { Schema, model } = require('mongoose')
const Blockchain = require('./Blockchain')
const { computeHash } = require('../utils/crypto')

const { DIFFICULTY, MINE_RATE } = process.env

const blockSchema = new Schema({
    timestamp: { type: String, default: Date.now },
    previousHash: { type: String },
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
    chain: { type: Schema.Types.ObjectId, ref: 'Blockchain' },
    hash: { type: String, default: '' },
    nonce: { type: Number, default: 0 },
    difficulty: { type: Number, default: DIFFICULTY }
})

blockSchema.method({
    mine: async function(transactions) {
        let { timestamp, hash, nonce, adjustDifficulty } = this
        const blockchain = await Blockchain.findOrCreateOne()
        const latestBlock = blockchain.latestBlock()
        let { previousHash, difficulty } = await Block.getHashAndDifficulty(latestBlock)
        while (hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
            nonce++
            hash = computeHash(timestamp, previousHash, transactions, nonce)
        }
        difficulty = adjustDifficulty(difficulty, timestamp)
        this.previousHash = previousHash
        this.hash = hash
        this.transactions = transactions
        this.nonce = nonce
        this.difficulty = difficulty
        const persistChangesToDB = [blockchain.addBlock(this), this.save()]
        await Promise.all(persistChangesToDB)
        return this
        // if it doesnt work, make mine a static function and `return new this`
    },
    adjustDifficulty: (difficulty, currentTime) => {
        Date.now() - currentTime > MINE_RATE ? difficulty-- : difficulty++
        return difficulty
    }
})

blockSchema.static({
    genesis: async function(chain) {
        const genesisBlock = await this.create({ 
            timestamp: '1587569720271',
            previousHash: '-',
            chain,
            hash: '0000',
            difficulty: DIFFICULTY
        })
        return genesisBlock
    },
    getHashAndDifficulty: async function(id) {
        const block = await this.findById(id)
        const previousHash = block.hash
        const difficulty = block.difficulty
        return {
            previousHash,
            difficulty
        }
    },
    mineOne: async function(transactions) {
        const block = new this()
        await block.mine(transactions)
        return block
    }
})

const Block = model('Block', blockSchema)

module.exports = Block