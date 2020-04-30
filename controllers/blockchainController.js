const Block = require('../models/Block')
const Blockchain = require('../models/Blockchain')

const createChain = async () => {
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
    return blockchain
}

const validateChain = (currentBlock, prevBlock) => {
    if (currentBlock.previousHash !== prevBlock.hash) {
        return false
    }
    // if (currentBlock.hash !== currentBlock.computeHash()) {
    //     return false
    // }
    return true
}

const clearAll = async (req, res, next) => {
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
}

const show = async (req, res, next) => {    
    const blockchain = await Blockchain.findOrCreateOne()
    return res.json({
        blockchain
    })
}

exports.validateChain = validateChain
exports.createChain = createChain
exports.clearAll = clearAll
exports.show = show