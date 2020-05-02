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

router.post('/send', async (req, res, next) => {
    const wallet = await Wallet.new()
    return res.json({
        wallet
    })
})

router.delete('/clear', clearAll)

module.exports = router