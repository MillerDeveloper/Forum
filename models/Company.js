const mongoose = require('mongoose')
const Schema = mongoose.Schema

const companySchema = new Schema({
     name: String,
     description: String,
     dateCreate: {
          type: Date,
          default: Date.now
     },
     tags: [{
          name: String
     }],
     logo: String,
     images: [{
          data: Buffer, 
          contentType: String 
     }],
     city: String,
     rating: {
          type: Number,
          default: 0
     },
     site: String,
     email: String,
     address: [{
          country: String,
          cities: [{
               city: String,
               addresses: []
          }]
     }],
     phones: [{
          phone: String
     }],
     director: {
          name: String,
          phone: String,
     },
     comments: [{
          type: Schema.Types.ObjectId,
          ref: 'comments'
     }],
     visitorsCount: Number,
     hiddenComments: {
          type: [{
               type: Schema.Types.ObjectId,
               ref: 'comments'
          }],
          default: []
     },
     specialization: {
          type: String,
          default: 'Трудоустройство'
     },
     yearOfFoundation: String,
     licenseNo: String,
     moderated: {
          type: Boolean,
          default: false
     },
     isInTop: {
          type: Boolean,
          default: false
     }
})

module.exports = mongoose.model('company', companySchema)