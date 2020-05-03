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
        // const data = JSON.stringify(this.outputs)
        const hash = computeHash(this.outputs)
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
        const { input: { signature }, outputs } = this
        const { privateKey } = sender
        const keyPair = getKeyPair(privateKey)
        const hash = computeHash(outputs)
        const verified = verifySignature(keyPair, signature, hash)
        if (verified) return verified
        const error = new CustomError('invalid signature')
        throw error
    },
    complete: async function(sender, recipient) {
        const { outputs } = this
        sender.balance = outputs[0].newBalance
        recipient.balance += outputs[1].amount
        await Promise.all([sender.save(), recipient.save()])
        return
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
            newBalance: sender.balance - amount,
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