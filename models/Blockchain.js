const { Schema, model } = require('mongoose')

const blockchainSchema = new Schema({
    chain: {}
})

const Blockchain = model('Blockchain', blockchainSchema)

module.exports = Blockchain