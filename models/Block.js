const { Schema, model } = require('mongoose')
const Blockchain = require('./Blockchain')
const { adjustDifficulty, getHashAndDifficulty } = require('../controllers/blockController')
const { computeHash } = require('../utils/crypto')

const { DIFFICULTY } = process.env

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
        let { timestamp, hash, nonce } = this
        const blockchain = await Blockchain.findOrCreateOne()
        const latestBlock = blockchain.latestBlock()
        let { previousHash, difficulty } = await getHashAndDifficulty(latestBlock)
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
    mineOne: async function(transactions) {
        const block = new this()
        await block.mine(transactions)
        return block
    }
})

const Block = model('Block', blockSchema)

module.exports = Block