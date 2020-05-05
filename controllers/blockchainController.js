const Block = require('../models/Block')
const Blockchain = require('../models/Blockchain')
const Wallet = require('../models/Wallet')
const Transaction = require('../models/Transaction')
const TransactionPool = require('../models/TransactionPool')
const CustomError = require('../utils/CustomError')
const { computeHash } = require('../utils/crypto')

const createChain = async () => {
    let blockchain = await Blockchain.findOne()
    if (!blockchain) {
        blockchain = await Blockchain.create({})
    }
    if (!blockchain.chain.length) {
        const genesisBlock = await Block.genesis(blockchain._id)
        blockchain.chain.push(genesisBlock)
        await blockchain.save()
    }
    return blockchain
}

const validateChain = async (currentId, previousId) => {
    const [currentBlock, previousBlock] = await Promise.all([Block.findById(currentId), Block.findById(previousId)])
    if (currentBlock.previousHash !== previousBlock.hash) {
        return false
    }
    const { timestamp, previousHash, nonce } = currentBlock
    if (currentBlock.hash !== computeHash(timestamp, previousHash, 'lol', nonce)) {
        return false
    }
    return true
}


const show = async (req, res, next) => {    
    // try {
        const blockchain = await Blockchain.findOrCreateOne()
        if (!blockchain) {
            const error = new CustomError('could not create blockchain')
            error.status = 500
            throw error
        }
        console.log('is valid? ', await blockchain.isValid().then(res => console.log(res)))
        return res.status(200).json({
            blockchain
        })
    // } catch (error) {
    //     return next(error)
    // }
}
        
const clearAll = async (req, res, next) => {
    try {
        const blocks = await Block.find()
        const chain = await Blockchain.find()
        const wallets = await Wallet.find()
        const transactions = await Transaction.find()
        const transactionPool = await TransactionPool.find()
        const blockchain = [...blocks, ...chain, ...wallets, ...transactions, ...transactionPool]
        for await (const element of blockchain) {
            element.deleteOne()
        }
        return res.json({
            message: 'deleted the blockchain and all blocks',
            blockchain
        })
    } catch (error) {
        const err = new CustomError('could not access database', 500)
        return next(err)
    }
}

exports.createChain = createChain
exports.validateChain = validateChain
exports.show = show
exports.clearAll = clearAll