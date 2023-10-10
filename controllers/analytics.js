const moment = require('moment')
const Analytics = require('../models/Analytics')
const errorHandler = require('../utils/errorHandler')

module.exports.getAllAnalytics = async (req, res) => {
     try {
          const analytics = await Analytics.find({}).sort("-date")
          res.status(200).json(analytics)
     } catch (error) {
          errorHandler(res, error)
     }
}

module.exports.createAnalytics = async (req, res) => {
     try {

     } catch(error) {
          errorHandler(res, error)
     }
}

module.exports.updateAnalytics = async (req, res) => {
     try {
          const analytics = await Analytics.findOne({date: new Date()})
          if(analytics) {
                
          } else {
               const newDateAnalysis = new Analytics()
               await newDateAnalysis.save() 
          }
     } catch(error) {
          errorHandler(res, error)
     }
}

module.exports.updateCountVisitors = async (req, res) => {
     try {
          var dateTime = moment();

          var dateValue = moment({
               year: dateTime.year(),
               month: dateTime.month(),
               day: dateTime.date()
          })
          const analytics = await Analytics.findOne({date: dateValue})

          if(analytics) { 
               await Analytics.updateOne(
                    {_id: analytics._id},
                    {$inc: {'visitors' : 1}}
               )

               res.status(200).json(null)
          } else {
               const newDateAnalysis = new Analytics({
                    date: dateValue
               })

               await newDateAnalysis.save() 
               res.status(201).json(null)
          } 
     } catch(error) {
          errorHandler(res, error)
     } 
}
