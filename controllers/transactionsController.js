const Transaction = require('../models/Transaction')
const Wallet = require('../models/Wallet')

const createTransaction = async (req, res, next) => {
    try {
        const senderWallet = await Wallet.new()
        const recipientWallet = await Wallet.new()
        const transaction = await Transaction.new(senderWallet, recipientWallet, 3)
        if (transaction.verifySignature(senderWallet)) {
            const { amount, from, to, status } = await transaction.addToPool(senderWallet, recipientWallet)
            return res.json({
                amount,
                from,
                to,
                status
            })
        }
    } catch (error) {
        return next(error)
    }
}

exports.createTransaction = createTransaction