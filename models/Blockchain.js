const { Schema, model } = require('mongoose')

const blockchainSchema = new Schema({
    chain: [{ type: Schema.Types.ObjectId, ref: 'Block' }]
})

const Blockchain = model('Blockchain', blockchainSchema)

module.exports = Blockchain