const Verification = require('../models/VerificationCompany')
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')

module.exports.getNotVerified = async (req, res) => {
     try {
         if(req.user.rules && req.user.rules.moderator === true) {
              const notVerified = await Verification.find({}) 
              res.status(200).json(notVerified)
         } else {
              res.status(400).json('Доступ запрещён')
         }
     } catch(error) {
          errorHandler(res, error)
     } 
} 

module.exports.allow = async (req, res) => {
     try {
         const candidate = await User.findById(req.body.user)
         if(candidate) {
              await User.updateOne(
                    {_id: req.body.user},
                    {$push: {
                         companies: req.body.company
                    }}
              )

              await Verification.deleteOne({_id: req.body._id})
              res.status(200).json(null)
         }
     } catch(error) {
          errorHandler(res, error)
     } 
}


module.exports.disAllow = async (req, res) => {
     try {
          await Verification.deleteOne({_id: req.body._id})
          res.status(200).json(null)
     } catch(error) {
          errorHandler(res, error)
     }
}
