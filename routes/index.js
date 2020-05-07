const router = require('express').Router()
const { clearAll, show } = require('../controllers/blockchain')
const { createWallet, createTransaction, getTransactions, mine } = require('../controllers/cryptocurrency')

router.get('/blocks', show)

router.get('/mine', mine)

router.post('/create', createWallet)

router.post('/send', createTransaction)

router.get('/transactions', getTransactions)

router.delete('/clear', clearAll)

module.exports = router