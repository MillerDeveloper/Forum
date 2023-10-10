const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
     name: String,
     dateCreate: {
          type: Date,
          default: Date.now
     },
     ips: [{
          ip: String,
          range: [],
          country: String,
          region: String,
          eu: String,
          timezone: String,
          city: String,
          ll: [],
          metro: Number,
          area: Number 
     }],
     comments: []
})

module.exports = mongoose.model('user', userSchema)