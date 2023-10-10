const mongoose = require('mongoose')
const Schema = mongoose.Schema

const analyticsSchema = new Schema({
   visitors: {
      type: Number,
      default: 0
   },
   date: {
      type: Date,
      default: Date.now
   }
})

module.exports = mongoose.model('analytics', analyticsSchema)