import jwt from 'jsonwebtoken'
import { IUser } from '../interfaces'

class Token {
    constructor(private key: string) {
    }

    async generate(payload: Partial<IUser>, expiresIn: string): Promise<string> {
        return jwt.sign(payload, this.key, { expiresIn: expiresIn })
    }

    async verify(token: string) {
        const decoded = <jwt.JwtPayload>jwt.decode(token);
        if (!decoded) return 'invalid'
        if (new Date(<number>decoded?.exp * 1000) <= new Date()) return 'expired'
        
        try{
            return jwt.verify(token, this.key)
        } catch(e) {
            return 'invalid'
        }
    }
}

export default new Token(<string>process.env.JWT_SECRET_KEY)