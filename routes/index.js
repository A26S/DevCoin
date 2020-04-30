const router = require('express').Router()
const { clearAll, show } = require('../controllers/blockchainController')
const Blockchain = require('../models/Blockchain')
const Block = require('../models/Blockwtf') // ---- this was causing errors!!!
const { createChain } = require('../utils/chainHelpers')

router.get('/blocks', show)

router.get('/mine', async (req, res, next) => {   
    const block = new Block()
    await block.mine()
    return res.json({
        block
    })
})

router.delete('/clear', clearAll)

module.exports = router