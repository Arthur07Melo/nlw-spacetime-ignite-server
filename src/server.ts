import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";

import user from "./routes/user";
import memory from "./routes/memory";
import register from "./routes/auth";
import { verifyToken } from "./middlewares/verifyToken";

const app = express();

app.use(cors({
    origin: ["http://localhost:3000"]
}));

app.use(express.json());
app.use(helmet());

app.use("/", register);
app.use(verifyToken);
app.use("/user", user);
app.use("/memories", memory);


app.listen(5000, () => {
    console.log("Server running on port 5000\nLink: http://localhost:5000");
});