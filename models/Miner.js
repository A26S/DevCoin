const { Schema, model } = require('mongoose')
const Wallet = require('../models/Wallet')
const TransactionPool = require('../models/TransactionPool')
const Blockchain = require('../models/Blockchain')
const Block = require('../models/Block')
const CustomError = require('../utils/CustomError')

const minerSchema = new Schema({
    wallet: { type: Schema.Types.ObjectId, ref: 'Wallet' }
})

minerSchema.method({
    mine: async function() {
        const { wallet } = this
        // try {
            const pool = await TransactionPool.findOrCreateOne()
            const block = await Block.mineOne(pool.transactions)
            await pool.confirmTransactions()
            const blockchain = await Blockchain.findOrCreateOne()
            const transaction = await blockchain.rewardMiner(wallet)
            return {
                block,
                transaction
            }
        // } catch (err) {
        //     const error = new CustomError('could not mine')
        //     throw error
        // }
    }
})

minerSchema.static({
    new: async function() {
        const miner = new this()
        const wallet = await Wallet.new()
        miner.wallet = wallet
        await miner.save()
        return miner
    }
})

const Miner = model('Miner', minerSchema)

module.exports = Miner