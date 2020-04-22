const { Schema, model } = require('mongoose')
const { computeHash } = require('../utils/computeHash')

const blockSchema = new Schema({
    timestamp: { type: String, default: Date.now },
    previousHash: { type: String },
    transactions: [{}],
    chain: { type: Schema.Types.ObjectId, ref: 'Blockchain', default: '5ea0b8510ebb489e12b18d8f' },
    hash: { type: String, default: '' }
})

blockSchema.method({
    computeHash: function() {
        const { timestamp, previousHash, transactions } = this
        const hash = computeHash(timestamp, previousHash, transactions)
        return hash
    },
    mine: function() {
        const { chain, computeHash } = this
        const latestBlock = chain.populate('chain').latestBlock()
        this.previousHash = latestBlock.hash
        this.hash = computeHash()
        await this.save()
        return
        // if it doesnt work, make mine a static function and `return new this`
    }
})

blockSchema.static({
    genesis: function() {
        const genesisBlock = new this({ 
            timestamp: '1587569720271',
            previousHash: '-',
            hash: '0000' 
        })
        return genesisBlock
    }
})

const Block = model('Block', blockSchema)

module.exports = Block