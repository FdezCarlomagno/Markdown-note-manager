import { rateLimit } from 'express-rate-limit'

const resendVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit to 3 requests per windowMs
  message: 'Too many resend requests. Please try again later.',
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // allow only 5 login attempts per window per IP
  message: 'Too many login attempts. Please try again later.'
});

const createAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many accounts created from this IP. Please try again later.'
});


const appLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: 'To many requests. Try again later'
})

export {
    resendVerificationLimiter,
    appLimiter,
    loginLimiter,
    createAccountLimiter
}
