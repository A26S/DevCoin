const { Schema, model } = require('mongoose')
const CustomError = require('../utils/CustomError')
const { validateChain } = require('../controllers/blockchainController')

const blockchainSchema = new Schema({
    chain: [{ type: Schema.Types.ObjectId, ref: 'Block' }]
})

blockchainSchema.method({
    latestBlock: function() {
        const { chain } = this
        const latestBlock = [...chain].pop()
        return latestBlock
    },
    addBlock: async function(newBlock) {
        const { chain } = this
        chain.push(newBlock)
        await this.save()
        return
    },
    isValid: function() {
        const { chain } = this
        chain.map((block, index) => {
            const currentBlock = chain[index]
            const previousBlock = chain[index - 1]
            if (i > 1) {
                return validateChain(currentBlock, previousBlock)
            }
        })
    }
})

blockchainSchema.static({
    findOrCreateOne: async function() {   
        const Block = require('./Block') // ---- require Block here because of a weird bug!!!
        try { 
            let blockchain = await this.findOne()
            if (!blockchain) {
                blockchain = await this.create({})
            }
            if (!blockchain.chain.length) {
                const genesisBlock = await Block.genesis(blockchain._id)
                blockchain.chain.push(genesisBlock)
                await blockchain.save()
            }
            console.log(`BLOCKCHAINNN ${blockchain}`)
            return blockchain
        } catch (error) {
            throw error
        }   
    }
})

const Blockchain = model('Blockchain', blockchainSchema)

module.exports = Blockchain