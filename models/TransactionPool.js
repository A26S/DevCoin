const { Schema, model } = require('mongoose')
const CustomError = require('../utils/CustomError')

const transactionPoolSchema = new Schema({
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }]
})

transactionPoolSchema.method({
    add: async function(transaction) {
        const { transactions } = this
        transactions.push(transaction)
        try {
            await this.save()
        } catch (err) {
            const error = new CustomError('could not add the transaction to the pool')
            throw error
        }
    },
    confirmTransactions: async function() {
        const Transaction = require('../models/Transaction') // the import was causing errors!!!
        for await (const t of this.transactions) {
            transaction = await Transaction.findOne(t)
            transaction.status = 'Confirmed'
            await transaction.save()
        }
        await this.clear()
    },
    clear: async function() {
        this.transactions = []
        await this.save()
        return
    }
})

transactionPoolSchema.static({
    findOrCreateOne: async function() {
        const existingPool = await this.findOne()
        if (existingPool) {
            return existingPool
        }
        const pool = await this.create({})
        return pool
    }
})

const TransactionPool = model('TransactionPool', transactionPoolSchema)

module.exports = TransactionPool