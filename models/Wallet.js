const { Schema, model } = require('mongoose')
const { generateKeyPair, getKeyPair } = require('../utils/crypto')

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
        const { publicKey } = this
        const keyPair = getKeyPair(publicKey)
        const signature = keyPair.sign(hash, 'base64')
        return signature.toDER('hex')
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