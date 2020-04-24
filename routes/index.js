const router = require('express').Router()
const Block = require('../models/Block')
const Blockchain = require('../models/Blockchain')

router.get('/blocks', async (req, res, next) => {
    const blockchain = await Blockchain.find()
    return res.json({
        blockchain
    })
})

router.get('/mine', async (req, res, next) => {
    const block = new Block()
    await block.mine()
    return res.json({
        block
    })
})

module.exports = router