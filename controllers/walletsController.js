const Wallet = require('../models/Wallet')

const createWallet = async (req, res, next) => {
    try {
        const wallet = await Wallet.new()
        return res.json({
            wallet
        })
    } catch (error) {
        return next(error)
    }
}

exports.createWallet = createWallet