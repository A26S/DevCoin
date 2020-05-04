const Transaction = require('../models/Transaction')
const Wallet = require('../models/Wallet')
const TransactionPool = require('../models/TransactionPool')

const createTransaction = async (req, res, next) => {
    try {
        const senderWallet = await Wallet.new()
        const recipientWallet = await Wallet.new()
        const transaction = await Transaction.new(senderWallet, recipientWallet, 3)
        if (transaction.verifySignature(senderWallet)) {
            const { amount, from, to } = await transaction.complete(senderWallet, recipientWallet)
            const transactionPool = await TransactionPool.findOrCreateOne()
            await transactionPool.add(transaction)
            return res.json({
                amount,
                from,
                to
            })
        }
    } catch (error) {
        return next(error)
    }
}

exports.createTransaction = createTransaction