const express = require('express')
const passport = require('passport')
const controller = require('../controllers/search')
const router = express.Router()

// passport.authenticate('jwt', {session: false}),

router.post('/', controller.searchCompanies)

module.exports = router 