const express = require('express')
const passport = require('passport')
const controller = require('../controllers/company')
const router = express.Router()

// passport.authenticate('jwt', {session: false}),

router.get('/', controller.getCompanies)
router.get('/updateVisitors/:id', controller.updateVisitorsCount)
router.get('/getCountCompanies', controller.getCountCompanies)

router.post('/updateAvatar/:id', controller.updateAvatar) 
router.get('/:id', controller.getCompany)
router.post('/', passport.authenticate('jwt', {session: false}), controller.createCompany)
router.post('/companyRequest', passport.authenticate('jwt', {session: false}), controller.companyRequest)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.deleteCompany)
router.put('/:id', passport.authenticate('jwt', {session: false}), controller.updateCompany)

module.exports = router