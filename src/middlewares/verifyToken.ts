import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization){
        res.status(401);
        res.json({ message: "No authorization token found" });
        return next();
    }
    const token = req.headers.authorization.split(" ")[1];
    console.log(process.env.TOKEN_SECRET_KEY);

    const payloadSchema = z.object({
        name: z.string(),
        avatarUrl: z.string().url()
    });

    try {
        const { name, avatarUrl } = payloadSchema.parse(jwt.verify(token, process.env.TOKEN_SECRET_KEY ?? ""));
        req.user = { name, avatarUrl };
    }catch(err){
        res.status(400);
        res.json({ error: err });
    }
    next();
};

export { verifyToken };