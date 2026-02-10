const router = require('express').Router()
const authController = require('../../controllers/auth.controller')
const { registerValidation, loginValidation } = require('../../validations/auth.validation')
const validate = require('../../middlewares/validate.middleware')
const { authLimiter } = require('../../middlewares/rateLimit.middleware')

router.post('/register', authLimiter, registerValidation, validate, authController.register)
router.post('/login',authLimiter, loginValidation, validate, authController.login)
router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)

module.exports = router