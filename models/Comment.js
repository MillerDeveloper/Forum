const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
     user: {
          name: String,
          logo: String,
          email: String
     },
     userData: {
          country: String,
          city: String,
          region: String,
          timezone: String,
          ip: String,
          ll: [],
          range: [],
          browser: String,
          language: String
     },
     idCompany: {
          type: Schema.Types.ObjectId,
          ref: 'company'
     },
     root: {
          type: Boolean,
          default: false
     },
     isAnonymous: Boolean,
     nameUser: String,
     text: String,
     date: {
          type: Date,
          default: Date.now
     },
     replies: {
          type: Array,
          default: []
     },
     replyForName: String,
     pickedRating: Number,
     hidden: {
          type: Boolean,
          default: false
     },
     approved: {
          type: Boolean, 
          default: false
     },
     isNotFirstUserComment: {
          type: Boolean,
          default: false
     },
     verificated: {
          type: Boolean,
          default: false
     }
     // hiddenTo -> date 
})

module.exports = mongoose.model('comment', commentSchema)