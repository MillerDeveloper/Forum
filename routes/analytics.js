const express = require('express')
const passport = require('passport')
const controller = require('../controllers/analytics')
const router = express.Router()

// passport.authenticate('jwt', {session: false}),

router.get('/', controller.getAllAnalytics)
router.post('/', controller.createAnalytics)
router.put('/', controller.updateAnalytics)

router.get('/updateCountVisitors', controller.updateCountVisitors)
 
module.exports = router