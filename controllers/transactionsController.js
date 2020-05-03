const Transaction = require('../models/Transaction')
const Wallet = require('../models/Wallet')

const createTransaction = async (req, res, next) => {
    try {
        const senderWallet = await Wallet.new()
        const recipientWallet = await Wallet.new()
        const transaction = await Transaction.new(senderWallet, recipientWallet, 2)
        if (transaction.verifySignature(senderWallet)) {
            transaction.complete(senderWallet, recipientWallet)
            return res.json({
                transaction
            })
        }
    } catch (error) {
        return next(error)
    }
}

exports.createTransaction = createTransaction