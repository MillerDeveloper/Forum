const express = require('express')
const passport = require('passport')
const controller = require('../controllers/comment')
const router = express.Router()

// passport.authenticate('jwt', {session: false}),

// router.get('/', controller.getComments)
router.get('/:id', controller.getComments)
router.get('/verify/getNotVerifiedComments', passport.authenticate('jwt', {session: false}), controller.getNotVerifiedComments)
router.get('/count/countMoodComments/:id', controller.countMoodComments)
router.get('/count/countComments/:id', controller.countComments)

router.put('/verify/allowComment', passport.authenticate('jwt', {session: false}), controller.allowComment)
router.put('/verify/disAllowComment', passport.authenticate('jwt', {session: false}), controller.disAllowComment)
router.put('/hideComment', passport.authenticate('jwt', {session: false}), controller.hideComment)
router.put('/:id', passport.authenticate('jwt', {session: false}), controller.updateComment)

router.post('/', controller.createComment) 

module.exports = router