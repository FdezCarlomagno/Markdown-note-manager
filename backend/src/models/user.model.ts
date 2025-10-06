import { pool } from "../db/connect";
import { User } from "../types/models";
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export class User_model {


    public static async getUserByEmail(email: User['email']): Promise<User | null> {
        const query = 'SELECT * FROM user WHERE email = ?'
        const [rows] = await pool.query(query, [email])
        console.log(rows)
        const users = rows as User[]

        return users.length > 0 ? users[0] : null
    }


    public static async getUserById(id: User['id']): Promise<User | null> {
        const query = 'SELECT * FROM user WHERE id = ?'
        const [rows] = await pool.query(query, [id])
        const users = rows as User[]

        return users.length === 1 ? users[0] : null
    }


    public static async createAccount(
        username: string,
        email: string,
        password: string
    ) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpires = new Date(Date.now() + 3600000); // 1 hour expiration

        const query = `
    INSERT INTO user(
        username, 
        email, 
        password, 
        email_verified,
        verification_code,
        code_expires
    ) VALUES(?, ?, ?, FALSE, ?, ?)
`;

        const [result] = await pool.query(query, [
            username,
            email,
            hashedPassword,
            verificationCode,
            codeExpires.toISOString().slice(0, 19).replace('T', ' ')
        ]);


        return {
            userId: (result as any).insertId,
            verificationCode
        };
    }
    public static async findByVerificationToken(verificationToken: string): Promise<User | null> {
        const query = `
                SELECT * 
                FROM user
                WHERE verification_token = ? 
                AND verification_expires > UTC_TIMESTAMP()
                LIMIT 1
            `;

        const [rows] = await pool.query(query, [verificationToken]);
        const users = rows as User[];

        return users[0] || null;
    }

    public static async verifyCode(email: string, code: string): Promise<boolean> {
        const query = `
            SELECT * FROM user 
            WHERE email = ? 
            AND verification_code = ? 
            AND code_expires > UTC_TIMESTAMP()
            AND email_verified = FALSE
        `;

        const [rows] = await pool.query(query, [email, code]);
        const users = rows as User[];

        if (users.length === 0) return false;

        // Mark email as verified
        await this.markEmailVerified(users[0].id);
        return true;
    }

    public static async markEmailVerified(userId: number): Promise<void> {
        const query = `
            UPDATE user 
            SET email_verified = TRUE,
                verification_code = NULL,
                code_expires = NULL 
            WHERE id = ?
        `;
        await pool.query(query, [userId]);
    }


    public static async updateVerificationCode(user_id: User['id'], verification_code: User['verification_code'], code_expires: User['code_expires']) {
        const query = "UPDATE user SET verification_code = ?, code_expires = ? WHERE id = ?"
        const [result] = await pool.query(query, [verification_code, code_expires, user_id])

        return (result as any).affectedRows;
    }


    public static async deleteProfile(id: User['id']): Promise<number> {
        const query = 'DELETE FROM user WHERE id = ?'
        const [result] = await pool.query(query, [id])

        return (result as any).affectedRows
    }


    public static async updateTokenVersion(id: User['id']): Promise<number> {
        const query = 'UPDATE user SET tokenVersion = tokenVersion + 1 WHERE id = ?'
        const [result] = await pool.query(query, [id])

        return (result as any).affectedRows
    }


    public static async changeUsername(id: User['id'], username: User['username']): Promise<number> {
        const query = 'UPDATE user SET username = ? WHERE id = ?'
        const [result] = await pool.query(query, [username, id])

        return (result as any).affectedRows
    }


    public static async changePassword(id: User['id'], password: User['password']): Promise<number> {
        const hashedPassword = await bcrypt.hash(password, 10)
        const query = 'UPDATE user SET password = ? WHERE id = ?'
        const [result] = await pool.query(query, [hashedPassword, id])

        return (result as any).affectedRows
    }
}