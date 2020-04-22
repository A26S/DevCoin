const validateChain = (currentBlock, prevBlock) => {
    if (currentBlock.previousHash !== prevBlock.hash) {
        return false
    }
    // if (currentBlock.hash !== currentBlock.computeHash()) {
    //     return false
    // }
    return true
}

exports.validateChain = validateChain