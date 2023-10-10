const express = require('express')
const passport = require('passport')
const controller = require('../controllers/auth')
const router = express.Router()

// passport.authenticate('jwt', {session: false}),

router.post('/login', controller.login)
router.post('/register', controller.register)

module.exports = router