const { Schema, model, Mixed } = require('mongoose')
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
        await this.save()
        return
    },
    signTransaction: function(hash) {
        const { keyPair } = this
        keyPair.sign(hash)
    }
})

// walletSchema.static({
//     new: async function() {
//         const wallet = new this()
//         wallet.generateKeyPair()
//         // console.log(wallet)
//         await wallet.save()
//         return 
//     }
// })

const Wallet = model('Wallet', walletSchema)

module.exports = Wallet