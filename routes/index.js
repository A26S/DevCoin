const router = require('express').Router()
const { clearAll, show } = require('../controllers/blockchainController')
const { createTransaction } = require('../controllers/transactionsController')
const Block = require('../models/Block') // ---- this was causing errors!!!


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

router.post('/send', createTransaction)

router.delete('/clear', clearAll)

module.exports = router