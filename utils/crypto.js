const { createHash } = require('crypto')
const { ec } = require('elliptic')

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
    const ellipticCurve = new ec('secp256k1')
    const keys = ellipticCurve.genKeyPair()
    const publicKey = keys.getPublic('hex')
    const privateKey = keys.getPrivate('hex')
}

exports.computeHash = computeHash
exports.generateKeyPair = generateKeyPair