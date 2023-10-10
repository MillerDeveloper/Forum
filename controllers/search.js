const moment = require('moment')
const Company = require('../models/Company')
const errorHandler = require('../utils/errorHandler')
const ObjectId = require('mongoose').Types.ObjectId

module.exports.searchCompanies = async (req, res) => {
     try {
          if(req.body.searchValue) {
               const companies = await Company.find({
                    $or: [
                         // {name: {$regex: `${req.body.searchValue}/i`}},
                         {name: {$regex: new RegExp("^" + req.body.searchValue.toLowerCase(), "i")}},
                         {description: {$regex: new RegExp("^" + req.body.searchValue.toLowerCase(), "i")}},
                         {'tags.name': {
                              $regex: new RegExp("^" + req.body.searchValue.toLowerCase(), "i")
                         }},
                         {city: {$regex: new RegExp("^" + req.body.searchValue.toLowerCase(), "i")}},
                         {site: {$regex: new RegExp("^" + req.body.searchValue.toLowerCase(), "i")}},
                         {email: {$regex: new RegExp("^" + req.body.searchValue.toLowerCase(), "i")}},
                         {address: {
                              $elemMatch: { 
                                   city: {
                                        $regex: new RegExp("^" + req.body.searchValue.toLowerCase(), "i")
                                   }
                              }
                         }},
                         {"address.address": {
                             $regex: new RegExp("^" + req.body.searchValue.toLowerCase(), "i"),
                         }}, 
                         {director: {$regex: new RegExp("^" + req.body.searchValue.toLowerCase(), "i")}},
                         {licenseNo: {$regex: new RegExp("^" + req.body.searchValue.toLowerCase(), "i")}},
                    ]
               }).sort({rating: -1})

               res.status(200).json(companies)
          } else { 


               res.status(200).json(null)
          }
     } catch(error) {
          errorHandler(res, error)
     } finally { 

     }
}
