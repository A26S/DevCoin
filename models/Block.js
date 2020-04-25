const { Schema, model } = require('mongoose')
const { computeHash } = require('../utils/computeHash')
const Blockchain = require('./Blockchain')

const getBlockchain = setTimeout(async () => {
        const blockchain = await Blockchain.findOne()
        return blockchain._id
    }, 0)

// const blockchain = setTimeout(() => getBlockchain(),0)

const blockSchema = new Schema({
    timestamp: { type: String, default: Date.now },
    previousHash: { type: String },
    // transactions: [{}],
    data: { type: String },
    chain: { type: Schema.Types.ObjectId, ref: 'Blockchain', default: getBlockchain },
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
        const blockchain = await Blockchain.findById(chain)
        const latestBlock = blockchain.populate('chain').latestBlock()
        // console.log(latestBlock)
        // console.log(blockchain)
        this.previousHash = latestBlock.hash
        this.hash = computeHash()
        await this.save()
        return
        // if it doesnt work, make mine a static function and `return new this`
    }
})

blockSchema.static({
    genesis: async function() {
        const genesisBlock = new this({ 
            timestamp: '1587569720271',
            previousHash: '-',
            hash: '0000' 
        })
        await genesisBlock.save()
        return genesisBlock
    }
})

const Block = model('Block', blockSchema)

module.exports = Block