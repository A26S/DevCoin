const { Schema, model } = require('mongoose')

const minerSchema = new Schema({
    blockchain: { type: Schema.Types.ObjectId, ref: 'Blockchain' },
    transactionPool: { type: Schema.Types.ObjectId, ref: 'TransactionPool' },
    wallet: { type: Schema.Types.ObjectId, ref: 'Wallet' }
})

const Miner = model('Miner', minerSchema)

module.exports = Miner