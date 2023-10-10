const moment = require('moment')
const Company = require('../models/Company')
const Comment = require('../models/Comment')
const Verification = require('../models/VerificationCompany')
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')
const ObjectId = require('mongoose').Types.ObjectId
const emailValidator = require("email-validator")
const Validator = require('validatorjs')
const fs = require('fs')
const path = require('path')
const keys = require('../config/keys') 

module.exports.getCompanies = async (req, res) => {
     try {          
          const sortParams = new Object()
          console.log(req.clientIp) 

	     if(req.query['isInTop']) {
               sortParams['isInTop'] = true
          }

          if(req.query.city) {
               sortParams.address = {
                    $elemMatch: {
                         city: req.query.city
                    }
               }
          }

          const companies = await Company
               .find(sortParams)
               .sort(req.query['sortBy'] || {rating: -1}) 
               .limit(req.query['limit'] ? +req.query['limit'] : 0)
               .skip(+req.query['skip'] || 0) 

     
          companies.sort((a, b) => {
               if(a.comments.length > b.comments.length) {
                    return -1
               }

               if(a.comments.length < b.comments.length) {
                    return 1
               }

               return 0
          }) 

          res.status(200).json(companies)
     } catch(error) {
          errorHandler(res, error)
     } 
}

module.exports.getCompany = async (req, res) => {
     try {
          if(ObjectId.isValid(req.params.id)) { 
               const company = await Company.findById(req.params.id)
               res.status(200).json(company)
          }
     } catch(error) {
          errorHandler(res, error)
     }
}


module.exports.createCompany = async (req, res) => {
     try {
          const rules = {
               name: 'required|max:1000',
               email: 'email',
               description: 'max:5000',
               site: 'max:1000',
               director: 'max:1000',
               tags: 'array',
               specialization: 'max:5000',
               yearOfFoundation: 'min:1800|max:3000',
               licenseNo: 'max:3000',
               address: 'array',
               phones: 'array',
          }
          
          const {name, email, description, site, director, tags, specialization, yearOfFoundation, licenseNo, address, phones} = req.body
          const data = {name, email, description, site, director, tags, specialization, yearOfFoundation, licenseNo, address, phones}

          let validation = new Validator(data, rules)

          if(validation.passes()) {
               const candidate = await Company.findOne({name: data.name})
               if(candidate) {
                    res.status(400).json('Такая компания уже существует')
               } else {  
                    const newCompany = new Company(data)
                    await newCompany.save()   
                    await User.updateOne(
                         {_id: req.user._id},
                         {$push: { 
                              companies: newCompany._id
                         }}
                    )

                    res.status(201).json(newCompany)
               }
          } else {
               res.status(400).json('Не корректные данныe')
          }
     } catch(error) {
          errorHandler(res, error)
     } finally {

     }
}


module.exports.deleteCompany = async (req, res) => {
     try {
          if(ObjectId.isValid(req.params.id)) {
               const user = await User.find({companies: {$in: req.params.id}}) 
               if(user) {
                    const company = await Company.findById({_id: req.params.id}).select({comments: true})

                    await Comment.deleteMany({_id: {$in: company.comments}})   
                    await Company.deleteOne({_id: req.params.id})
                    res.status(200).json(null)
               } else {
                    res.status(400).json(null)
               }
          }
     } catch(error) {
          errorHandler(res, error)
     } finally {

     }
}

module.exports.updateCompany = async (req, res) => {
     try {
          if(req.user.companies.includes(req.params.id)) {
               const rules = {
                    name: 'required|max:1000',
                    email: 'email',
                    description: 'max:5000',
                    site: 'max:1000',
                    director: 'max:1000',
                    specialization: 'max:5000',
                    licenseNo: 'max:3000',
                    address: 'array',
               } 

               const {name, email, description, site, director, tags, specialization, yearOfFoundation, licenseNo, address, phones} = req.body
               const data = {name, email, description, site, director, tags, specialization, yearOfFoundation, licenseNo, address, phones}
     
               let validation = new Validator(data, rules)

               if(validation.passes()) {
                    await Company.updateOne(
                         {_id: req.params.id},
                         {$set: data} 
                    )

                    res.status(200).json(null)
               } else {
                    res.status(400).json('Тест не пройден')
               }
          } else {
               res.status(400).json('Компания Вам не пренадлежит')
          }
     } catch(error) {
          errorHandler(res, error)
     } 
}

module.exports.companyRequest = async (req, res) => { 
     try {
          if(ObjectId.isValid(req.body._id) && emailValidator.validate(req.body.email)) {
               const candidate = await Company.findById({_id: req.body._id})
               if(candidate) {
                    const rules = {
                         fio: 'required|max:1000',
                         email: 'required:email'
                    }
                    
                    const data = {
                         fio: req.body.fio,
                         email: req.body.email
                    }
            
                    let validation = new Validator(data, rules)
          
                    if(validation.passes()) {
                         const request = new Verification({
                              user: req.user._id,
                              company: candidate._id,
                              fio: req.body.fio,
                              email: req.body.email
                         })

                         await request.save()
                         await User.updateOne(
                              {_id: req.user._id},
                              {$push: {
                                   logs: {
                                        subject: `Отправлен запрос на управление компанией ${candidate.name}` 
                                   }
                              }}
                         )

                         res.status(201).json(null)
                    } else {
                         console.log(validation.errors);
                         res.status(400).json('Не верные данные')
                    }
               } else {
                    res.status(400).json('Компании не существует')
               }
          } else {
               res.status(400).json('Пользователя не существует')
          }
     } catch(error) {
          errorHandler(res, error)
     } finally {

     }
}

module.exports.updateAvatar = async (req, res) => { 
     try {
          if(ObjectId.isValid(req.params.id)) {
               const candidate = await Company.findById({_id: req.params.id})

               if(candidate && req.files && req.files.avatar) {
                    const avatarName = req.files.avatar.name.split(' ').join('')

                    if(!fs.existsSync(path.join(__dirname, keys.rootDir, 'uploads', 'companyImages'))) {
                         fs.mkdirSync(path.join(__dirname, keys.rootDir, 'uploads', 'companyImages'))
                    }

                    if (!fs.existsSync(path.join(__dirname, keys.rootDir, 'uploads', 'companyImages', candidate._id.toString()))){
                         fs.mkdirSync(path.join(__dirname, keys.rootDir, 'uploads', 'companyImages', candidate._id.toString()))
                    }

                    if(candidate.logo && fs.existsSync(path.join(__dirname, keys.rootDir, candidate.logo))) {  
                         fs.unlinkSync(path.join(__dirname, keys.rootDir, candidate.logo))  
                    }

                    fs.writeFile(path.join(__dirname, keys.rootDir, 'uploads', 'companyImages', candidate._id.toString(), avatarName), req.files.avatar.data, 'ascii', async function (err) { 
                         if (err) throw err;

                         await Company.updateOne(
                              {_id: req.params.id},
                              {$set: {
                                   logo: `uploads/companyImages/${candidate._id}/${avatarName}`
                              }}
                         )

                         res.status(200).json(null) 
                    })
               } else {
                    res.status(200).join('Пустой файл')
               }
          } else {
               res.status(404).json('Компания не найдена')
          }
     } catch(error) {
          errorHandler(res, error)
     }
}

module.exports.updateVisitorsCount = async (req, res) => {
     try {
          if(ObjectId.isValid(req.params.id)) {
               await Company.updateOne(
                    {_id: req.params.id},
                    {$inc : {'visitorsCount' : 1}}
               )

               res.status(200).json(null)
          }
     } catch(error) {
          errorHandler(res, error)
     }
}


module.exports.getCountCompanies = async (req, res) => {
     try {
          const count = await Company.find({}).count()
          res.status(200).json(count)
     } catch(error) {
          errorHandler(res, error)
     }
}
