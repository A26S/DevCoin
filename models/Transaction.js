const { Schema, model } = require('mongoose')
const CustomError = require('../utils/CustomError')
const { computeHash, getKeyPair, verifySignature } = require('../utils/crypto')

const transactionSchema = new Schema({
    input: { type: Object, default: {} },
    outputs: { type: Object, default: [] }
})

transactionSchema.method({
    sign: async function(sender) {
        const { balance, publicKey } = sender
        const data = JSON.stringify(this.outputs)
        const hash = computeHash(data)
        this.input = {
            timestamp: Date.now(),
            amount: balance,
            address: publicKey,
            signature: sender.signTransaction(hash)
        }
        await this.save()
        return
    },
    verifySignature: function(sender) {
        const { input, outputs } = this
        const { signature } = input
        const keyPair = getKeyPair(sender.privateKey)
        const hash = computeHash(JSON.stringify(outputs))
        return verifySignature(keyPair, signature, hash)
    }
})

transactionSchema.static({
    new: async function(sender, recipient, amount) {
        if (amount > sender.balance) {
            const error = new CustomError('not enough balance', 401)
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
        await transaction.sign(sender)
        return transaction
    }
})

const Transaction = model('Transaction', transactionSchema)

module.exports = Transaction