const { Schema, model } = require('mongoose')
const Wallet = require('../models/Wallet')
const TransactionPool = require('../models/TransactionPool')
const Blockchain = require('../models/Blockchain')
const Block = require('../models/Block')

const minerSchema = new Schema({
    // blockchain: { type: Schema.Types.ObjectId, ref: 'Blockchain' },
    // transactionPool: { type: Schema.Types.ObjectId, ref: 'TransactionPool' },
    wallet: { type: Schema.Types.ObjectId, ref: 'Wallet' }
})

minerSchema.method({
    mine: async function() {
        const { wallet } = this
        const pool = await TransactionPool.findOrCreateOne()
        const { transactions } = pool
        const block = await Block.mineOne(transactions)
        const blockchain = await Blockchain.findOrCreateOne()
        const transaction = await blockchain.rewardMiner(wallet)
        await pool.clear()
        return {
            block,
            transaction
        }
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