const { Schema, model } = require('mongoose')
const TransactionPool = require('./TransactionPool')
const { computeHash, getKeyPair, verifySignature } = require('../utils/crypto')
const CustomError = require('../utils/CustomError')

const { MINING_REWARD } = process.env

const transactionSchema = new Schema({
    input: { type: Object, default: {} },
    outputs: [{ type: Object }],
    status: { type: String, default: 'Unconfirmed' },
    pool: { type: Schema.Types.ObjectId, ref: 'TransactionPool' }
})

transactionSchema.method({
    sign: async function(sender) {
        const { balance, publicKey } = sender
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
    addToPool: async function(sender, recipient) {
        const { outputs, pool, status } = this
        const from = sender.publicKey
        const to = recipient.publicKey
        const amount = outputs[1].amount
        sender.balance = outputs[0].newBalance
        recipient.balance += amount
        await Promise.all([sender.save(), recipient.save()], pool.add(this))
        return { 
            amount,
            from, 
            to, 
            status
        }
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
        const pool = await TransactionPool.findOrCreateOne()
        transaction.pool = pool
        await transaction.sign(sender)
        return transaction
    },
    minerReward: async function(blockchainWallet, minerWallet) {
        if (MINING_REWARD > blockchainWallet.balance) {
            const error = new CustomError('there is no more currency that will go into circulation', 401)
            throw error
        } 
        const transaction = new this()
        const output1 = {
            newBalance: blockchainWallet.balance - MINING_REWARD,
            address: blockchainWallet.publicKey
        }
        const output2 = {
            amount: MINING_REWARD,
            address: minerWallet
        }
        transaction.outputs.push(output1, output2)
        await transaction.sign(blockchainWallet)
        blockchainWallet.balance -= MINING_REWARD
        minerWallet.balance += parseInt(MINING_REWARD)
        await Promise.all([blockchainWallet.save(), minerWallet.save()])
        return
    }
})

const Transaction = model('Transaction', transactionSchema)

module.exports = Transaction