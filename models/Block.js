const { Schema, model } = require('mongoose')
const { computeHash } = require('../utils/computeHash')

const blockSchema = new Schema({
    timestamp: { type: String, default: Date.now },
    previousHash: { type: String },
    // transactions: [{}],
    data: { type: String },
    chain: { type: Schema.Types.ObjectId, ref: 'Blockchain', default: '5ea237d65fab51b1dbaea178' },
    hash: { type: String, default: '' }
})

blockSchema.method({
    computeHash: function() {
        const { timestamp, previousHash, data } = this
        const hash = computeHash(timestamp, previousHash, data)
        return hash
    },
    mine: async function() {
        const { chain, computeHash } = this
        console.log(chain)
        const latestBlock = this.chain.populate('chain').latestBlock()
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