import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization){
        res.status(401);
        res.json({ message: "No authorization token found" });
        return;
    }
    const token = req.headers.authorization.split(" ")[1];
    console.log(process.env.TOKEN_SECRET_KEY);

    const payloadSchema = z.object({
        name: z.string(),
        avatarUrl: z.string().url(),
        sub: z.string()
    });

    try {
        const { name, avatarUrl, sub } = payloadSchema.parse(jwt.verify(token, process.env.TOKEN_SECRET_KEY ?? ""));
        console.log(name, avatarUrl, sub);
        req.user = { name, avatarUrl, sub };
    }catch(err){
        res.status(400);
        res.json({ error: err });
        return;
    }
    next();
};

export { verifyToken };