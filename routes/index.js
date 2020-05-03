const router = require('express').Router()
const { clearAll, show } = require('../controllers/blockchainController')
const Block = require('../models/Block') // ---- this was causing errors!!!
const Wallet = require('../models/Wallet')
const Transaction = require('../models/Transaction')

router.get('/blocks', show)

router.get('/mine', async (req, res, next) => {   
    const block = new Block()
    await block.mine()
    return res.json({
        block
    })
})

router.post('/create', async (req, res, next) => {
    try {
        const wallet = await Wallet.new()
        return res.json({
            wallet
        })
    } catch (error) {
        return next(error)
    }
})

router.post('/send', async (req, res, next) => {
    const wallet1 = await Wallet.new()
    const wallet2 = await Wallet.new()
    // try {
        const transaction = await Transaction.new(wallet1, wallet2, 2)
        console.log(transaction.verifySignature(wallet1))
        return res.json({
            transaction
        })
    // } catch (error) {
    //      next(error)
    // }
})

router.delete('/clear', clearAll)

module.exports = router