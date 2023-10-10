const moment = require('moment')
const User = require('../models/User')
const Company = require('../models/Company')
const errorHandler = require('../utils/errorHandler')
const ObjectId = require('mongoose').Types.ObjectId
const emailValidator = require("email-validator")
const passwordValidator = require('password-validator')
const bcrypt = require('bcryptjs')
const keys = require('../config/keys')
const phone = require('phone')
const fs = require('fs')
const path = require('path')

module.exports.getCurrentUser = async (req, res) => {
     try {
          if(req.user && ObjectId.isValid(req.user._id)) {
               const currentUser = await User.findById({_id: req.user._id}).select({password: false})
               if(currentUser) {
                    res.status(200).json(currentUser)
               } else {
                    res.status(200).json(null)
               } 
          } else {
               res.status(403).json(null)
          }
     } catch(error) { 
          errorHandler(res, error)
     } finally { 

     }
}

module.exports.updateData = async (req, res) => { 
     try {
          if(
               ObjectId.isValid(req.body.idUser) &&
               emailValidator.validate(req.body.email) &&
               req.body.name.length > 1 && req.body.name.length < 100 
          ) {
               const candidate = await User.findById({_id: req.body.idUser})

               if(candidate) {
                    await User.updateOne(
                         {_id: req.body.idUser}, 
                         {$set: {
                              email: req.body.email,
                              name: req.body.name
                         }}
                    )

                    res.status(200).json(null)
               } else {
                    res.status(404).json('Пользователь не найден')
               }
         } else {
              res.status(400).json('Не корректные данные') 
         }
     } catch(error) {
          errorHandler(res, error) 
     }
}

module.exports.changePassword = async (req, res) => { 
     try {
          const schema = new passwordValidator()
          schema
               .is().min(6) 
               .is().max(100)
               .has().not().spaces()   
          if(
               schema.validate(req.body.oldPassword) &&
               schema.validate(req.body.password) &&
               schema.validate(req.body.repeatedPassword) 
          ) {
               if(req.body.password === req.body.repeatedPassword) {
                    const candidate = await User.findById({_id: req.user._id})
                    if(candidate) {
                         if(bcrypt.compareSync(req.body.oldPassword, candidate.password)) {
                              const salt = bcrypt.genSaltSync(10)
                              const password = req.body.password

                              await User.updateOne(
                                   {_id: req.user._id},
                                   {
                                        $set: {
                                             password: bcrypt.hashSync(password, salt)  
                                        },
                                        $push: {
                                             logs: {
                                                  subject: 'Пароль был изменён'
                                             }
                                        }
                                   }
                              )

                              res.status(200).json(null)
                         } else {
                              res.status(400).json("Старый пароль не совпадает")
                         }
                    } else {
                         res.status(404).json("Пользователь не найден")
                    }
               } else {
                    res.status(400).json("Пароли не совпадают")
               }
          } else {
               res.status(400).json("Пароли не валидны")
          }
     } catch(error) {
          errorHandler(res, error)
     }
}

module.exports.getUserCompanies = async (req, res) => { 
     try {
          const candidate = await User.findById({_id: req.user._id})
          if(candidate) {
               const userCompanies = await Company.find({_id: {
                    $in: candidate.companies
               }})

               res.status(200).json(userCompanies)
          } else {
               res.status(404).json("Пользователь не найден")
          } 
     } catch(error) {
          errorHandler(res, error)
     }
}


module.exports.updateAvatar = async (req, res) => { 
     try {
          if(ObjectId.isValid(req.params.id)) {
               const candidate = await User.findById({_id: req.params.id})

               if(candidate && req.files && req.files.avatar) {
                    const avatarName = req.files.avatar.name.split(' ').join('')

                    if (!fs.existsSync(path.join(__dirname, keys.rootDir, 'uploads', 'UserImages'))){
                         fs.mkdirSync(path.join(__dirname, keys.rootDir, 'uploads', 'UserImages')) 
                    }

                    console.log(__dirname, keys.rootDir, 'uploads', 'UserImages', candidate._id)

                    if (!fs.existsSync(path.join(__dirname, keys.rootDir, 'uploads', 'UserImages', candidate._id.toString()))){
                         fs.mkdirSync(path.join(__dirname, keys.rootDir, 'uploads', 'UserImages', candidate._id.toString())) 
                    }

                    if(candidate.logo && fs.existsSync(path.join(__dirname, keys.rootDir, candidate.logo))) { 
                         fs.unlinkSync(path.join(__dirname, keys.rootDir, candidate.logo))  
                    }

                    fs.writeFile(path.join(__dirname, keys.rootDir, 'uploads', 'UserImages', candidate._id.toString(), avatarName), req.files.avatar.data, 'ascii', async function (err) { 
                         if (err) throw err;
     
                         await User.updateOne(
                              {_id: req.params.id},
                              {$set: {
                                   logo: `uploads/UserImages/${candidate._id}/${avatarName}`
                              }}
                         )

                         res.status(200).json(null) 
                    })
               } else {
                    res.status(200).join('Пустой файл')
               }
          } else { 
               res.status(404).json('Пользователь не найден')
          }
     } catch(error) {
          errorHandler(res, error)
     } 
}

module.exports.getNotModerated = async (req, res) => {
     try {
          const users = await User.find({moderated: false}).select({password: false})
          res.status(200).json(users)
     } catch(error) {
          errorHandler(res, error)
     }
}

module.exports.allowUser = async (req, res) => {
     try {
          if(ObjectId.isValid(req.body._id)) {
               await User.updateOne(
                    {_id: req.body._id},
                    {moderated: true}
               )

               res.status(200).json(null)
          } else {
               res.status(404).json(null)
          }
     } catch(error) {
          errorHandler(res, error)
     }
}

module.exports.disAllowUser = async (req, res) => {
     try {
          if(ObjectId.isValid(req.body._id)) { 
               await User.deleteOne({_id: req.body._id})
               res.status(200).json(null)
          } else {
               res.status(404).json(null)
          }
     } catch(error) {
          errorHandler(res, error)
     }
}