declare namespace Express {
    export interface Request {
        user: Partial<{
            name: string,
            avatarUrl: string,
            sub: string
        }>
    }
}