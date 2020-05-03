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

const getKeyPair = privateKey => {
    const keyPair = ellipticCurve.keyFromPrivate(privateKey, 'hex')
    return keyPair
}

const createSignature = (privateKey, hash) => {
    const keyPair = getKeyPair(privateKey)
    const signature = keyPair.sign(hash)
    return signature
}

const verifySignature = (keyPair, signature, hash) => {
    // const keyPair = getKeyPair(publicKey)
    return keyPair.verify(hash, signature)
}

exports.computeHash = computeHash
exports.generateKeyPair = generateKeyPair
exports.getKeyPair = getKeyPair
exports.createSignature = createSignature
exports.verifySignature = verifySignature