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

exports.validateChain = validateChain
exports.createChain = createChain