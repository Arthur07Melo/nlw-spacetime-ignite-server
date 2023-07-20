import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import jwt from "jsonwebtoken";
import axios from "axios";


const register = async (req: Request, res: Response) => {
    const bodySchema = z.object({
        code: z.string(),
    });

    const { code } = bodySchema.parse(req.body);

    const accessTokenResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        null,
        {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code
            },
            headers: {
                Accept: "application/json"
            },
            withCredentials: true,
        }
    );

    const { access_token } = accessTokenResponse.data;
    
    const userResponse = await axios.get(
        "https://api.github.com/user",
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }
    );

    const userSchema = z.object({
        id: z.number(),
        login: z.string(),
        name: z.string(),
        avatar_url: z.string().url()
    });

    const userInfo = userSchema.parse(userResponse.data);

    let user = await prisma.user.findUnique({
        where: {
            githubId: userInfo.id
        }
    });

    let status = 200;

    if(!user) {
        user = await prisma.user.create({
            data: {
                githubId: userInfo.id,
                name: userInfo.name,
                login: userInfo.login,
                avatarUrl: userInfo.avatar_url
            }
        });
        status = 201;
    }

    const token = jwt.sign({
        name:user.name,
        avatarUrl:user.avatarUrl
    }, "spacetime", { subject: user.id, expiresIn:"7 days" });

    res.status(status);
    res.json({token: token});
};

export { register };