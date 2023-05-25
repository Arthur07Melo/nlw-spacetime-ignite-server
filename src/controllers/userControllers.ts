import { prisma } from "../lib/prisma";
import { Request, Response } from "express";


const getAllUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();

    res.status(200);
    res.json({ users: users });
};


export { getAllUsers };