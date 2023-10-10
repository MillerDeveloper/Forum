const express = require('express')
const passport = require('passport')
const controller = require('../controllers/file')
const router = express.Router()

// passport.authenticate('jwt', {session: false}),

router.get('/', controller.getFile)
router.get('/:id', controller.getFile)
router.get('/uploads/logosCompanies/:id', controller.getFile) 

module.exports = router