const Blockchain = require('../models/Blockchain')
const { io } = require('../server')
const { getNode, getChain } = require('../utils/clientSocket')
const { BLOCKCHAIN } = require('../utils/socketActions')
const CustomError = require('../utils/CustomError')

const broadcastBlockchain = async (req, res, next) => {
    try {
        const blockchain = await Blockchain.findOrCreateOne()
        io.emit(BLOCKCHAIN, blockchain)
        const socketNode = getNode(req)
        getChain(socketNode)
        return next()
    } catch (err) {
        const error = new CustomError('could not get the blockchain', 500)
        throw error
    }
}

module.exports = broadcastBlockchain