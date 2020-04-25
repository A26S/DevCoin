const router = require('express').Router()
const Block = require('../models/Block')
const Blockchain = require('../models/Blockchain')

router.get('/blocks', async (req, res, next) => {
    let blockchain = await Blockchain.findOne()
    if (!blockchain) {
        let blockchain = new Blockchain
        await blockchain.save()
        // console.log(blockchain)
        return 
    }
    if (!blockchain.chain.length) {
        console.log(blockchain)
        const genesisBlock = Block.genesis()
        blockchain.chain.push(genesisBlock)
        await blockchain.save()
    }
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