const express = require('express')
const passport = require('passport')
const controller = require('../controllers/verification')
const router = express.Router()

// passport.authenticate('jwt', {session: false}),

router.get('/', passport.authenticate('jwt', {session: false}), controller.getNotVerified)
router.post('/allow', passport.authenticate('jwt', {session: false}), controller.allow)
router.post('/disAllow', passport.authenticate('jwt', {session: false}), controller.disAllow)

module.exports = router