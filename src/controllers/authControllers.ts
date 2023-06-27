import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import axios from "axios";


const register = async (req: Request, res: Response) => {
    const bodySchema = z.object({
        code: z.string(),
    });

    console.log("entered register");
    console.log(req.body);

    const { code } = bodySchema.parse(req.body);

    console.log("BODY PARSED...");
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

    console.log("ACCESS TOKEN TAKEN");

    const { access_token } = accessTokenResponse.data;
    
    console.log("ACCESS TOKEN PARSED...");

    const userResponse = await axios.get(
        "https://api.github.com/user",
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }
    );

    console.log("User response got.");

    const userSchema = z.object({
        id: z.number(),
        login: z.string(),
        name: z.string(),
        avatar_url: z.string().url()
    });

    const userInfo = userSchema.parse(userResponse.data);

    console.log("userInfo parsed...");
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

    res.status(status);
    res.json({user: user});
};

export { register };