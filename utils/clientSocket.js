const { client } = require('../server')

client.on('blockchain', blockchain => {
    console.log(blockchain)
})