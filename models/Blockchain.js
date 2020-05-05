const { Schema, model } = require('mongoose')
const CustomError = require('../utils/CustomError')
const Wallet = require('../models/Wallet')

const blockchainSchema = new Schema({
    chain: [{ type: Schema.Types.ObjectId, ref: 'Block' }],
    wallet: { type: Schema.Types.ObjectId, ref: 'Wallet' }
})

blockchainSchema.method({
    createWallet: async function() {
        const wallet = await Wallet.new()
        wallet.balance = 500000
        this.wallet = wallet
        await Promise.all([this.save(), wallet.save()])
        return wallet
    },
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
    isValid: async function() {
        const { validateChain } = require('../controllers/blockchainController') // ---- this was causing errors!
        const { chain } = this
        let isValid 
        await chain.map(async (currentBlock, index, array) => {
            const previousBlock = array[index - 1]
            if (index > 0) {
                isValid = await validateChain(currentBlock, previousBlock)
                // console.log('map', isValid)
            }
            console.log('map', isValid)
            // return isValid
        })
        // console.log(isValid)
        return isValid
    }
})

blockchainSchema.static({
    findOrCreateOne: async function() {   
        const Block = require('./Block') // ---- this was causing errors!!!
        try { 
            let blockchain = await this.findOne()
            if (!blockchain) {
                blockchain = await this.create({})
                await blockchain.createWallet()
            }
            if (!blockchain.chain.length) {
                const genesisBlock = await Block.genesis(blockchain._id)
                blockchain.chain.push(genesisBlock)
                await blockchain.save()
            }
            return blockchain
        } catch (err) {
            const error = new CustomError('could not get the blockchain')
            throw error
        }   
    }
})

const Blockchain = model('Blockchain', blockchainSchema)

module.exports = Blockchain