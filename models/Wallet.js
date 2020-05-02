const { Schema, model } = require('mongoose')
const { generateKeyPair } = require('../utils/crypto')

const walletSchema = new Schema({
    balance: { type: Number, default: 10 },
    publicKey: { type: String },
    privateKey: { type: String }
})

walletSchema.method({
    generateKeyPair: async function() {
        const { publicKey, privateKey } = generateKeyPair()
        this.publicKey = publicKey
        this.privateKey = privateKey
    },
    signTransaction: function(hash) {
        const { keyPair } = this
        keyPair.sign(hash)
    }
})

walletSchema.static({
    new: async function() {
        const wallet = new this()
        wallet.generateKeyPair()
        await wallet.save()
        return wallet
    }
})

const Wallet = model('Wallet', walletSchema)

module.exports = Wallet