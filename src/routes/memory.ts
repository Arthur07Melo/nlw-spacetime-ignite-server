import express from "express";
import { getAllMemories, getSpecificMemory, createMemory, updateMemory, deleteMemory } from "../controllers/memoryControllers";

const router = express.Router();

router.get("/", getAllMemories);
router.get("/:id", getSpecificMemory);
router.post("/", createMemory);
router.put("/:id", updateMemory);
router.delete("/:id", deleteMemory);


export default router;