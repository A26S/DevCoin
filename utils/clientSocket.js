const { client } = require('../server')

const { PORT } = process.env

const getNode = req => {
    const { protocol, hostname } = req
    const connectionString = `${protocol}://${hostname}:${PORT}`
    const clientNode = client(connectionString)
    return clientNode
}

const onBlockchain = blockchain => {
    console.log(blockchain)
}

exports.getNode = getNode