const { Schema, model } = require('mongoose')
const { computeHash } = require('../utils/computeHash')

const blockSchema = new Schema({
    timestamp: { type: String, default: Date.now },
    previousHash: { type: String },
    transactions: [{}],
    chain: { type: Schema.Types.ObjectId, ref: 'Blockchain' },
    hash: { type: String, default: '' }
})

blockSchema.method({
    computeHash: function() {
        const { timestamp, previousHash, transactions } = this
        const hash = computeHash(timestamp, previousHash, transactions)
        return 
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