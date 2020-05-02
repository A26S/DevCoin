const { createHash } = require('crypto')
const { ec } = require('elliptic')
const ellipticCurve = new ec('secp256k1')

const computeHash = (...args) => {
    const hash = createHash('SHA256')
    let message = ''
    args.map(element => {
        message += element.toString()
    })
    hash.update(`${message}`)
    return hash.digest('hex')
}

const generateKeyPair = () => {
    const keyPair = ellipticCurve.genKeyPair()
    const publicKey = keyPair.getPublic('hex')
    const privateKey = keyPair.getPrivate('hex')
    return { publicKey, privateKey }
}

const verifySignature = (publicKey, signature, hash) => {
    const keyPair = ellipticCurve.keyFromPublic(publicKey)
    keyPair.verify(hash, signature)
}

exports.computeHash = computeHash
exports.generateKeyPair = generateKeyPair
exports.verifySignature = verifySignature