const { Schema, model } = require('mongoose')
const CustomError = require('../utils/CustomError')

const transactionSchema = new Schema({
    input: { type: String, default: null },
    outputs: { type: String, default: [] }
})

transactionSchema.static({
    new: async function(sender, recipient, amount) {
        if (amount > sender.balance) {
            const error = new CustomError('not enough balance')
            throw error
        } 
        const transaction = new this()
        const output1 = {
            amount: sender.balance - amount,
            address: sender.publicKey
        }
        const output2 = {
            amount,
            address: recipient
        }
        transaction.outputs.push(output1, output2)
        await transaction.save()
        return transaction
    }
})

const Transaction = model('Transaction', transactionSchema)

module.exports = Transaction