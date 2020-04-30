const { Schema, model } = require('mongoose')
const { computeHash } = require('../utils/computeHash')
const { createChain } = require('../utils/chainHelpers')
const Blockchain = require('./Blockchain')

let { DIFFICULTY, MINE_RATE } = process.env

const blockSchema = new Schema({
    timestamp: { type: String, default: Date.now },
    previousHash: { type: String },
    // transactions: [{}],
    data: { type: String },
    chain: { type: Schema.Types.ObjectId, ref: 'Blockchain' },
    hash: { type: String, default: '' },
    nonce: { type: Number, default: 0 },
    difficulty: { type: Number, default: DIFFICULTY }
})

blockSchema.method({
    mine: async function() {
        let { timestamp, hash, nonce } = this
        const blockchain = await Blockchain.findOrCreateOne()
        const latestBlock = blockchain.latestBlock()
        const previousHash = await Block.findByIdAndReturnHash(latestBlock)
        console.log(DIFFICULTY++)
        while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY)) {
            nonce++
            hash = computeHash(timestamp, previousHash, 'lol', nonce)
        }
        this.previousHash = previousHash
        this.hash = hash
        this.nonce = nonce
        blockchain.chain.push(this)
        const persistChangesToDB = [blockchain.save(), this.save()]
        await Promise.all(persistChangesToDB)
        return
        // if it doesnt work, make mine a static function and `return new this`
    }
})

blockSchema.static({
    genesis: async function(chain) {
        const genesisBlock = await this.create({ 
            timestamp: '1587569720271',
            previousHash: '-',
            chain,
            hash: '0000' 
        })
        return genesisBlock
    },
    findByIdAndReturnHash: async function(id) {
        const block = await this.findById(id)
        return block.hash
    }
})

const Block = model('Block', blockSchema)

module.exports = Block