const mongoose = require('mongoose')
const Schema = mongoose.Schema

const verificationSchema = new Schema({
     type: String,

     company: {
          type: Schema.Types.ObjectId,
          ref: 'company'
     },
     fio: String,
     email: String,
     user: {
          type: Schema.Types.ObjectId,
          ref: 'user'
     },
     allowed: {
          type: Boolean,
          default: false
     },
     date: {
          type: Date,
          default: Date.now
     }
})

module.exports = mongoose.model('verification', verificationSchema)