const router = require('express').Router()
const Block = require('../models/Block')
const Blockchain = require('../models/Blockchain')
const { createChain } = require('../utils/chainHelpers')

router.get('/blocks', async (req, res, next) => {    
    // const blockchain = await Blockchain.createOne()
    // async function() {
        let blockchain = await Blockchain.findOne()
        if (!blockchain) {
            blockchain = await Blockchain.create({})
        }
        if (!blockchain.chain.length) {
            console.log(typeof Block)
            console.log(typeof Blockchain)
            const genesisBlock = await Block.genesis(blockchain._id)
            blockchain.chain.push(genesisBlock)
            await blockchain.save()
        }
        console.log(`BLOCKCHAINNN ${blockchain}`)
        // return blockchain
    // }
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

router.delete('/clear', async (req, res, next) => {
    const blocks = await Block.find()
    const chain = await Blockchain.find()
    const blockchain = [...blocks, ...chain]
    for await (const element of blockchain) {
        element.deleteOne()
    }
    return res.json({
        message: 'deleted the blockchain and all blocks',
        blockchain
    })
})

module.exports = router