declare namespace Express {
    export interface Request {
        user: {
            _id: string;
            fullName: string;
            avatar: string;
            email: string;
            password: string;
            displayName: string;
            role: string;
            otp: object[]
            phoneNumber: string;
            track?: string;
            deleted: boolean
            isVerified: boolean
            permissions?: string[]
        }
        files: {
            fieldname: string;
            originalname: string;
            encoding: string;
            mimetype: string;
            destination: string;
            filename: string;
            path: string;
            size: number
        }[]
    }
}