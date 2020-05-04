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
    }
})

transactionPoolSchema.static({
    findOrCreateOne: async function() {
        const existingPool = await this.findOne()
        if (!existingPool) {
            const pool = await this.create({})
            return pool
        }
        return existingPool
    }
})

const TransactionPool = model('TransactionPool', transactionPoolSchema)

module.exports = TransactionPool