import { prisma } from "../lib/prisma"; 
import { z } from "zod";
import { Request, Response } from "express";


const getAllMemories = async (req: Request, res: Response) => {
    const memories = await prisma.memory.findMany({
        orderBy: {
            createdAt: "asc"
        }
    });
    
    res.status(200);
    res.json({ memories: memories.map((memory) => {
        return {
            id: memory.id,
            cover: memory.coverUrl,
            excerpt: memory.content.substring(0, 115).concat("...")
        };
    }) });
}; 

const getSpecificMemory = async (req: Request, res: Response) => {
    const paramsSchema = z.object({
        id: z.string().uuid()
    });

    const { id } = paramsSchema.parse(req.params);

    const memory = await prisma.memory.findUniqueOrThrow({
        where: {
            id: id
        }
    });

    res.status(200);
    res.json({ memory: memory });
};

const createMemory = async (req: Request, res: Response) => {
    const bodySchema = z.object({
        coverUrl: z.string(),
        content: z.string(),
        isPublic: z.coerce.boolean().default(false)
    });

    const { coverUrl, content, isPublic } = bodySchema.parse(req.body);

    const memory = await prisma.memory.create({
        data: {
            content,
            coverUrl,
            isPublic,
            userId: "1d02b67f-e0ed-4d4d-aca6-a867a14443f4"
        }
    });

    res.status(201);
    res.json({ memory: memory });
};

const updateMemory = async (req: Request, res: Response) => {
    const paramsSchema = z.object({
        id: z.string().uuid()
    });
    const bodySchema = z.object({
        content: z.string(),
        coverUrl: z.string(),
        isPublic: z.coerce.boolean().default(false)
    });

    const { id } = paramsSchema.parse(req.params);
    const { content, coverUrl, isPublic } = bodySchema.parse(req.body);

    const memory = await prisma.memory.update({
        where: {
            id,
        },
        data: {
            content,
            coverUrl,
            isPublic
        }
    });

    res.status(200);
    res.json({ memory: memory });
};

const deleteMemory = async (req: Request, res: Response) => {
    const paramsSchema = z.object({
        id: z.string().uuid()
    });

    const { id } = paramsSchema.parse(req.params);

    await prisma.memory.delete({
        where: {
            id: id
        }
    });

    res.status(204);
    res.json();
};


export { getAllMemories, getSpecificMemory, createMemory, updateMemory, deleteMemory };