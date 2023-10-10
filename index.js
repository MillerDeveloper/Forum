
const app = require('./app')
const http = require('http')
const fs = require('fs')
const https = require('https')

const PORT = process.env.PORT || 80

if (process.env.NODE_ENV === 'production') {

     const httpsOptions = {
          cert: fs.readFileSync("/etc/letsencrypt/live/zarobitchany-za-kordonom.com/fullchain.pem"),
          key: fs.readFileSync("/etc/letsencrypt/live/zarobitchany-za-kordonom.com/privkey.pem")
     }

     https
          .createServer(httpsOptions, app)
          .listen(443, () => console.log(`HTTPS listening on port 443`))
}

http
     .createServer(app)
     .listen(PORT, () => console.log(`HTTP listening on port ${PORT}`))