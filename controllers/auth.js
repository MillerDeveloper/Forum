const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')
const emailValidator = require("email-validator")
const passwordValidator = require('password-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')

module.exports.login = async (req, res) => {
     try {
          const schema = new passwordValidator()
          schema
               .is().min(6) 
               .is().max(100) 

          if(emailValidator.validate(req.body.email) && schema.validate(req.body.password)) {
               const candidate = await User.findOne({email: req.body.email})

               if(candidate) {
                    const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)

                    if(passwordResult) {
                         const token = jwt.sign({ 
                              email: candidate.email, 
                              userId: candidate._id
                         }, keys.jwt, {expiresIn: 86400})

                         res.cookie('token', token)

                         res.status(200).json(token)
                    } else {
                         res.status(403).json("Не верный email или пароль")
                    }
               } else {
                    res.status(403).json("Такого пользователя не существует")
               }
          } else {
               res.status(403).json("Не верный email или пароль")
          }
     } catch(error) {
          errorHandler(res, error)
     } 
}

module.exports.register = async (req, res) => { 
     try {
          const schema = new passwordValidator()
          schema
               .is().min(6) 
               .is().max(100)
               .has().not().spaces()    


          if(emailValidator.validate(req.body.email)) {
               if(schema.validate(req.body.password) && schema.validate(req.body.repeatedPassword)) {
                    if(
                         req.body.password === req.body.repeatedPassword && 
                         req.body.email.length > 4 && req.body.email.length < 254 &&
                         req.body.name 
                    ) {
                         const candidate = await User.findOne({email: req.body.email}).select({password: false})

                         if(candidate) {
                              res.status(409).json("Пользователь с такием email существует")
                         } else {
                              const salt = bcrypt.genSaltSync(10)
                              const password = req.body.password

                              const newUser = new User({
                                   name: req.body.name,
                                   email: req.body.email,
                                   password: bcrypt.hashSync(password, salt),
                                   userData: [{
                                        browser: req.headers["user-agent"],
                                        language: req.headers["accept-language"],
                                        ip: req.clientIp
                                   }] 
                              })

                              await newUser.save()
                              res.status(200).json(newUser)
                         }
                    } else {
                         res.status(400).json("Не коректные данные")
                    }
               } else {
                    res.status(400).json("Не коректный пароль")
               }
          } else {
               res.status(400).json("Не коректный email")
          }
     } catch(error) {
          errorHandler(res, error)
     }
}
