const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
     name: String,
     email: String,
     city: String,
     phone: String,
     password: String,
     dateCreate: {
          type: Date,
          default: Date.now
     },
     companies: [{
          type: Schema.Types.ObjectId,
          ref: 'company' 
     }],
     logo: String,
     logs: [{
          date: {
               type: Date,
               default: Date.now
          },
          subject: String,
          viewed: {
               type: Boolean,
               default: false
          }
     }],
     rules: {
          moderator: {
               type: Boolean,
               default: false 
          },
          admin: {
               type: Boolean,
               default: false
          },
          canEditComments: {
               type: Boolean,
               default: false
          }
     },
     userData: [{
          ip: String,
          range: [],
          country: String,
          region: String,
          eu: String,
          timezone: String,
          city: String,
          ll: [],
          metro: Number,
          area: Number,
          browser: String,
          language: String
     }],
     moderated: {
          type: Boolean, 
          default: false
     }
})

module.exports = mongoose.model('user', userSchema)