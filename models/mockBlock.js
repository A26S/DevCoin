const crypto = require('crypto')

class Block {
    constructor(timestamp, previousHash, transactions) {
        this.timestamp = timestamp
        this.previousHash = previousHash
        this.transactions = transactions
        this.hash = this.computeHash()
    }

    computeHash() {
        const { timestamp, previousHash, transactions } = this
        const hash = crypto.createHash('sha256')
        hash.update(`${timestamp}-${previousHash}-${transactions}`)
        return hash.digest('hex')
    }

    static Genesis() {

    }
}