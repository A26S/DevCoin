const router = require('express').Router()
const { clearAll, show } = require('../controllers/blockchainController')
const { createTransaction } = require('../controllers/transactionsController')
const { createWallet } = require('../controllers/walletsController')
const Block = require('../models/Block') // ---- this was causing errors!!!
const TransactionPool = require('../models/TransactionPool')


router.get('/blocks', show)

router.get('/mine', async (req, res, next) => {   
    const block = new Block()
    await block.mine()
    return res.json({
        block
    })
})

router.get('/transactions', async (req, res, next) => {
    const pool = await TransactionPool.findOrCreateOne()
    const { transactions } = pool
    return res.json({
        transactions
    })
})
router.post('/create', createWallet)

router.post('/send', createTransaction)

router.delete('/clear', clearAll)

module.exports = router