const moment = require('moment')
const Company = require('../models/Company')
const Verification = require('../models/VerificationCompany')
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')
const ObjectId = require('mongoose').Types.ObjectId
const emailValidator = require("email-validator")
const Validator = require('validatorjs')
const fs = require('fs')
const keys = require('../config/keys')
const path = require('path')

module.exports.getFile = async (req, res) => {
     try { 
          var url = ''
          if(req.query.path && req.query.path.length < 2000) {
               req.query.path.split(' ').forEach((item) => url += '/' + item)
               var filePath = path.join(__dirname, keys.rootDir, url) 

               if (path.extname(filePath) && fs.existsSync(filePath)) {
                    const fileType = path.extname(filePath)

                    if(fileType === '.png' || fileType === '.jpg' || fileType === '.jpeg' || fileType === '.jfif' || fileType === '.webp' || fileType === '.PNG') {
                         var stat = fs.statSync(filePath) 

                         if(stat.isFile()) {
                              res.writeHead(200, {
                                   'Content-Type': 'image/jpeg + png + jpg',
                                   'Content-Length': stat.size
                              })
                         
                              var readStream = fs.createReadStream(filePath)
                              readStream.pipe(res)
                         } else { 
                              res.status(200).json('Ошибка чтения файла')
                         }
                    } else {
                         res.status(200).json('Не верный тип файла') 
                    }
               } else {
                    var filePath = path.join(__dirname, keys.rootDir, 'config', 'files', 'no-avatar.png') 
                    if (path.extname(filePath) && fs.existsSync(filePath)) { 
                         var stat = fs.statSync(filePath) 

                         res.writeHead(200, {
                              'Content-Type': 'image/jpeg + png + jpg',
                              'Content-Length': stat.size
                         })

                         var readStream = fs.createReadStream(filePath)
                         readStream.pipe(res, true)
                    }
               }
          } else {
               res.status(400).json('Ошибка пути файла') 
          }
     } catch(error) {
          errorHandler(res, error)
     } finally {

     }
}