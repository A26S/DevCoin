const { Schema, model } = require('mongoose')
const { createECDH } = require('crypto')

const walletSchema = new Schema({
    balance: { type: Number, default: 10 },
    publicKey: { type: String },
    privateKey: { type: String }
})

walletSchema.method({
    generateKeyPair: async function() {
        const ec = createECDH('secp256k1')
        ec.generateKeys('hex')
        this.publicKey = ec.getPublicKey('hex')
        this.privateKey = ec.getPrivateKey('hex')
        await this.save()
        return
    }
})

const Wallet = model('Wallet', walletSchema)

module.exports = Wallet