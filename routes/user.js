const express = require('express')
const passport = require('passport')
const controller = require('../controllers/user')
const router = express.Router()

// passport.authenticate('jwt', {session: false}),

router.get('/', passport.authenticate('jwt', {session: false}), controller.getCurrentUser)
router.get('/getUserCompanies', passport.authenticate('jwt', {session: false}), controller.getUserCompanies)
router.get('/verify/fetch', passport.authenticate('jwt', {session: false}), controller.getNotModerated)

router.post('/updateAvatar/:id', controller.updateAvatar) 
router.post('/verify/allowUser', controller.allowUser) 
router.post('/verify/disAllowUser', controller.disAllowUser) 

router.patch('/updateData', passport.authenticate('jwt', {session: false}), controller.updateData)
router.patch('/changePassword', passport.authenticate('jwt', {session: false}), controller.changePassword)

module.exports = router