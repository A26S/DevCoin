class Blockchain {
    constructor() {

    }

    getLatestBlock() {
        const { chain } = this
        const latestBlock = [...chain].pop()
        return latestBlock
    }
}