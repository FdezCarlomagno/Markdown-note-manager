import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Note_Error from "../middlewares/noteError";
import { User_model } from "../models/user.model";
import { User, UserToken } from "../types/models";
import bcrypt from 'bcryptjs'
import createResponse from '../utils/createResponse';
import { checkEmailFormat, emailExists } from "../utils/checkEmail";
import { getUserById } from "../utils/getUser";
import { validatePassword } from "../utils/validatePassword";
import crypto from 'crypto'
import { Email_Service } from "../services/emailService";
import dotenv from 'dotenv'
dotenv.config()

/**
 * The class responsible for managing user accounts.
 * 
 * <p>
 *  The functions of the {@link User_Controller} are the following:
 *      <li>Set the httpOnly Cookie for user Authentication (login)</li>
 *      <li>Destroy the user´s httpOnly Cokkie for log out</li>
 *      <li>Handle user authentication</li>
 *      <li>Create user account</li>
 *      <li>Verify token and verification code</li>
 *      <li>Verifies user account</li>
 *      <li>CRUD operations on a user</li>
 * </p>
 * 
 * @author Valentin F. Carlomagno
 * @version 1.0
 */


export class User_Controller {
    /** Private Json Web Token secret that comes from an .env variable */
    private static readonly secret: string = process.env.JWT_SECRET as string

    /**
   * Generates a JWT for user authentication and sets it as an HttpOnly cookie.
   *
   * @remarks
   * - Requires Basic Authentication header with base64-encoded `email:password`.
   * - Validates credentials against the database.
   * - Returns a JWT with a 7-day expiration, stored in a secure cookie.
   * - Uses error middleware (`Note_Error`) for standardized error handling.
   *
   * @param req Express request containing the `Authorization` header.
   * @param res Express response where the JWT cookie is set.
   * @param next Express error-handling middleware.
   * 
   * @returns A promise resolving to an Express `Response` with the token, or calls `next` with an error.
   * 
   * @throws {Note_Error} If:
   * - Authorization header is missing or invalid.
   * - Email format is invalid.
   * - User not found or password mismatch.
   * - JWT secret is missing.
   */
    public static async getToken(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const headers = req.headers.authorization

        if (!headers) {
            return next(new Note_Error(createResponse(true, 'Missing auth header', []), 400))
        }

        const [header, credentials] = headers.split(' ')

        if (header !== 'Basic' || !credentials) {
            return next(new Note_Error(createResponse(true, 'Invalid auth type', []), 400))
        }

        const decodedCredentials = Buffer.from(credentials as string, 'base64').toString('utf-8')

        const [email, password] = decodedCredentials.split(':')

        if (!checkEmailFormat(email)) {
            return next(new Note_Error(createResponse(true, 'Invalid email format', []), 400))
        }

        if (!email || !password) {
            return next(new Note_Error(createResponse(true, 'Invalid authentication credentials', []), 400))
        }

        try {
            const user = await User_model.getUserByEmail(email)

            if (!user) {
                throw new Note_Error(createResponse(true, `User with email ${email} not found`, []), 404)
            }

            const match = await bcrypt.compare(password, user.password)

            if (!match) {
                throw new Note_Error(createResponse(true, 'Invalid credentials', []), 400)
            }

            if (!process.env.JWT_SECRET && !User_Controller.secret) {
                throw new Note_Error(createResponse(true, "JWT secret key is missing. Please check your .env file.", []), 500);
            }

            //Create the token
            const token = jwt.sign({
                sub: user.id,
                email: user.email,
                isAdmin: user.isAdmin,
                tokenVersion: user.tokenVersion,
                isVerified: user.isVerified,
                verification_code: user.verification_code,
                code_expires: user.code_expires
            }, User_Controller.secret, { expiresIn: "7d" })

            // Set the token in an HTTP-only cookie
            //For production
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            return res.status(201).json(createResponse(false, 'Token succesfully created', token))
        } catch (err: any) {
            console.log(err)
            return next(err)
        }
    }

    /**
     * Clears the HttpOnly Cookie for logout.
     * 
     * @remarks
     * - Assumes that the user is already logged in.
     * - Uses error middleware (`Note_Error`) for standardized error handling.
     * 
     * @param req Express request containing the Authorized user
     * @param res Express response that clears the cookie
     * @param next Express error-handling middleware.
     * @returns A promise resolving to an express ´Response´ with a success message or calls ´next´ with an error
     * 
     * @throws {@link Note_Error} if the user is not logged in.
     */
    public static async logout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        if (!(req as any).user) {
            return next(new Note_Error(createResponse(true, 'User not logged in', []), 401))
        }

        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });

        return res.json(createResponse(false, 'Logout succesful', []))
    }

    /**
     * Returns if the user is authenticated or not.
     * Used to quickly check the authentication of the user.
     * 
     * @param req Express request containing the Authorized (or not) user
     * @param res Express response
     * @param next Express error-handling middleware.
     * @returns A promise resolving to an express ´Response´ with an object {@link authenticated: false} if the user is not authenticated or {@link authenticated: true} if the user is authenticated, or calls ´next´ with an error.
     */
    public static async isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const token = req.cookies.jwt

        if (!token) {
            return res.json(createResponse(false, 'User not logged in', { authenticated: false }))
        }

        try {
            const decodedToken = jwt.verify(token, User_Controller.secret) as UserToken

            return res.json(createResponse(false, 'User is logged in', { authenticated: true }))
        } catch (err: any) {
            return res.json(createResponse(false, 'User not logged in', { authenticated: false }))
        }
    }

    public static async createAccount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        if ((req as any).user) {
            return next(new Note_Error(createResponse(true, 'Already logged in', []), 400))
        }

        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return next(new Note_Error(createResponse(true, 'Missing mandatory fields', []), 400))
        }

        if (!checkEmailFormat(email)) {
            return next(new Note_Error(createResponse(true, 'Invalid email format', []), 400))
        }

        if (!validatePassword(password)) {
            return next(new Note_Error(createResponse(true, 'The password must have 8+ chars, uppercase letters (A-Z), lowercase letters (a-z), digits (0-9)', []), 400))
        }


        const userEmailExists: boolean = await emailExists(email)
        if (userEmailExists) {
            return next(new Note_Error(createResponse(true, 'Account already registered', []), 400))
        }

        try {
            const { userId, verificationCode } = await User_model.createAccount(username, email, password)

            if (!userId) {
                throw new Note_Error(createResponse(true, 'Could not create account', []), 500)
            }

            console.log("Verification code from controller", verificationCode)

            await Email_Service.sendVerificationCode(email, verificationCode)

            return res.json(createResponse(false, 'Account succesfully created. Check email for verification code', {
                needsVerification: true
            }))
        } catch (err: any) {
            console.error(err)
            return next(err)
        }
    }

    public static async verifyCode(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { email, code } = req.body;

        if (!email || !code) {
            return next(new Note_Error(createResponse(true, 'Missing email or verification code', []), 400));
        }

        try {
            //invalid or expired
            //check date verification in model
            const isValid = await User_model.verifyCode(email, code);

            if (!isValid) {
                return next(new Note_Error(createResponse(true, 'Invalid or expired verification code', []), 400));
            }

            return res.json(createResponse(false, 'Email successfully verified', []));
        } catch (err) {
            console.error(err)
            return next(err);
        }
    }

    public static async resendEmailVerification(req: Request, res: Response, next: NextFunction) {
        const { email } = req.body

        try {
            if (!email || !checkEmailFormat(email)) {
                throw new Note_Error(createResponse(true, 'Invalid email format', []), 400)
            }

            const user = await User_model.getUserByEmail(email)

            if (!user) {
                throw new Note_Error(createResponse(true, 'User not found', []), 404)
            }

            //If its already verified return
            if (user.isVerified) {
                return res.json(createResponse(false, 'User already verified', []))
            }

            const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const newCodeExpires = new Date(Date.now() + 3600000); // 1 hour expiration

            await User_model.updateVerificationCode(
                user.id,
                newVerificationCode,
                newCodeExpires
            )
            //Resend the email

            await Email_Service.sendVerificationCode(user.email, newVerificationCode)

            return res.json(createResponse(false, 'Verification email sent', []))
        } catch (err: any) {
            console.log(err)
            return next(err)
        }
    }

    public static async getUserByEmail(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { email } = req.body;

        if (!email) {
            return next(new Note_Error(createResponse(true, 'Missing mandatory fields', []), 400))
        }
        try {
            const user = await User_model.getUserByEmail(email) as User

            if (!user) {
                throw new Note_Error(createResponse(true, 'User not found', []), 404)
            }

            return res.json(createResponse(false, 'User succesfully retrieved', user))
        } catch (err: any) {
            return next(err)
        }
    }

    public static async getProfile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const userFromToken: UserToken = (req as any).user;

        if (!userFromToken) return next(new Note_Error(createResponse(true, 'Profile not found', []), 400))

        try {
            const user = await getUserById(Number(userFromToken.sub))

            if (!user) {
                throw new Note_Error(createResponse(true, 'User not found', []), 404)
            }

            return res.json(createResponse(false, 'Profile retrieved', user))
        } catch (err: any) {
            return next(err)
        }


    }

    public static async deleteProfile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const reqUser = (req as any).user
        const { password } = req.body;

        try {
            //Validaciones de campos
            if (!password || password.trim() === '') {
                throw new Note_Error(createResponse(true, 'Missing password field', []), 400)
            }

            if (!(req as any).user) {
                throw new Note_Error(createResponse(true, 'User not logged in', []), 400)
            }

            //Validacion de email
            const userEmailExists: boolean = await emailExists(reqUser.email)
            if (!userEmailExists) {
                throw new Note_Error(createResponse(true, `User with email ${reqUser.email} does not exist`, []), 404)
            }

            //Validacion de usuario existente
            const user = await getUserById((reqUser.sub)) as User
            if (!user || user.id !== reqUser.sub) {
                throw new Note_Error(createResponse(true, 'User not found', []), 404)
            }

            //Validacion de contraseña
            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                throw new Note_Error(createResponse(true, 'Wrong password', []), 400)
            }

            //Invalidate token
            const affectedRowsToken = await User_model.updateTokenVersion(user.id)
            //Delete profile
            const affectedRowsUser = await User_model.deleteProfile(user.id)
            const affectedRows = affectedRowsToken + affectedRowsUser - 1

            //Clear cookie
            res.clearCookie('jwt', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'none',
            });

            return res.json(createResponse(false, 'Account succesfully deleted', { RowsAffected: affectedRows }))

        } catch (err: any) {
            return next(err)
        }
    }

    public static async changeUsername(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { newUsername } = req.body
        const reqUser = (req as any).user as UserToken
        const reqUserId = Number(reqUser.sub)

        try {
            if (!newUsername || newUsername.trim() === '') {
                throw new Note_Error(createResponse(true, 'Please specify a new username', []), 400)
            }

            if (!(req as any).user) {
                throw new Note_Error(createResponse(true, 'User not logged in', []), 400)
            }

            const userToUpdate: User = await getUserById(reqUserId) as User

            if (!userToUpdate || userToUpdate.id !== reqUserId) {
                throw new Note_Error(createResponse(true, 'User not found', []), 404)
            }

            const affectedRows = await User_model.changeUsername(userToUpdate.id, newUsername)

            return res.json(createResponse(false, 'Username succesfully updated', { rowsAffected: affectedRows }))

        } catch (err: any) {
            return next(err)
        }
    }

    public static async changePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { originalPassword: oldPassword } = req.body
        //this is the new password
        const { newPassword } = req.body
        const reqUser: UserToken = (req as any).user
        const reqUserId = Number(reqUser.sub)

        try {
            if (!oldPassword || oldPassword.trim() === '') {
                throw new Note_Error(createResponse(true, 'Please enter your original password', []), 400)
            }

            if (!newPassword || newPassword.trim() === '') {
                throw new Note_Error(createResponse(true, 'Please specify a new password', []), 400)
            }

            const userFromDb: User = await getUserById(reqUserId) as User

            if (!userFromDb || userFromDb.id !== reqUserId) {
                throw new Note_Error(createResponse(true, 'User not found', []), 404)
            }

            const matchPasswords = await bcrypt.compare(oldPassword, userFromDb.password)
            if (!matchPasswords) {
                throw new Note_Error(createResponse(true, 'Invalid credentials', []), 400)
            }

            if (!validatePassword(newPassword)) {
                throw new Note_Error(createResponse(true, 'The password must have 8+ chars, uppercase letters (A-Z), lowercase letters (a-z), digits (0-9)', []), 400)
            }

            const affectedRows = await User_model.changePassword(userFromDb.id, newPassword)

            return res.json(createResponse(false, 'Password succesfully updated', { rowsAffected: affectedRows }))
        } catch (err: any) {
            return next(err)
        }
    }
}

