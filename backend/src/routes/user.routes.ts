import express from 'express'
import { User_Controller } from '../controllers/user.controller'
import { verifyCookie, checkIsVerified } from '../middlewares/auth.middlewares'
import { resendVerificationLimiter, createAccountLimiter, loginLimiter } from '../utils/rateLimiter'
const router = express.Router()

router.post('/login',loginLimiter, User_Controller.getToken)
router.post('/create-account', createAccountLimiter, User_Controller.createAccount)
router.get('/isAuthenticated', User_Controller.isAuthenticated)
router.post('/resend-verification', resendVerificationLimiter,  User_Controller.resendEmailVerification)
router.post('/verify-code', User_Controller.verifyCode)

//Protected routes
router.get('/profile', verifyCookie, User_Controller.getProfile)
router.delete('/profile/delete-profile', verifyCookie,  User_Controller.deleteProfile)
router.put('/profile/change-username', loginLimiter ,verifyCookie, User_Controller.changeUsername)
router.put('/profile/change-password', loginLimiter, verifyCookie, User_Controller.changePassword)
router.post('/logout', verifyCookie, User_Controller.logout)




export default router
