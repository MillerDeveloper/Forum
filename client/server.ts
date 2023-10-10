import 'zone.js/dist/zone-node'
import 'localstorage-polyfill'

import { ngExpressEngine } from '@nguniversal/express-engine'
import * as express from 'express'
import { join } from 'path'

import { AppServerModule } from './src/main.server'
import { APP_BASE_HREF } from '@angular/common' 
// import { existsSync } from 'fs'
const server = require('../app')
const domino = require('domino')
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  // const server = express()
  const distFolder = join(process.cwd(), './dist/zarobits/browser')
  const indexHtml = fs.existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index'
  const template = fs.readFileSync(path.join(distFolder, 'index.html')).toString()

  const win = domino.createWindow(template.toString())
  global['window'] = win
  global['document'] = win.document
  global['self'] = win
  global['IDBIndex'] = win.IDBIndex
  global['document'] = win.document
  global['navigator'] = win.navigator
  global['getComputedStyle'] = win.getComputedStyle
  global['localStorage'] = localStorage

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }))

  server.set('view engine', 'html')
  server.set('views', distFolder)

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { })
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {  
    maxAge: '1y'
  }))  

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { 
      req, 
      preboot: true,
      providers: [{ 
        provide: APP_BASE_HREF, 
        useValue: req.baseUrl 
      }] 
    })
  })

  return server
}

function run(): void {
  const server = app()
   
  var httpServer = http.createServer(server)
  httpServer.listen(80, () => console.log(`HTTP listening on port 80`))

  if(
      process.env.NODE_ENV === 'production' && 
      fs.existsSync('/etc/letsencrypt/live/zarobitchany-za-kordonom.com/fullchain.pem') &&
      fs.existsSync('/etc/letsencrypt/live/zarobitchany-za-kordonom.com/privkey.pem') 
  ) { 
    const httpsOptions = {
      cert: fs.readFileSync("/etc/letsencrypt/live/zarobitchany-za-kordonom.com/fullchain.pem"),
      key: fs.readFileSync("/etc/letsencrypt/live/zarobitchany-za-kordonom.com/privkey.pem")
    } 

    var httpsServer = https.createServer(httpsOptions, server)
    httpsServer.listen(443, () => console.log(`HTTPS listening on port 443`)) 
  } 
}
 
// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire
const mainModule = __non_webpack_require__.main
const moduleFilename = mainModule && mainModule.filename || ''
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run()
}

export * from './src/main.server'
