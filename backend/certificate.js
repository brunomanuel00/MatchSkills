const https = require('https')
const fs = require('fs')

const app = require('./app')

const options = {
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem')
}

https.createServer(options, app).listen(3001, () => {
    console.log('HTTPS server running on https://localhost:3001')
})