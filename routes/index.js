const router = require('express').Router()
const { clearAll, show } = require('../controllers/blockchainController')
const Block = require('../models/Block') // ---- this was causing errors!!!

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