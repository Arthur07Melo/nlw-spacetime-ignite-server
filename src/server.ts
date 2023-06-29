import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { expressjwt } from "express-jwt";

import user from "./routes/user";
import memory from "./routes/memory";
import register from "./routes/auth";

const app = express();

app.use(cors({
    origin: ["http://localhost:3000"]
}));

app.use(express.json());
app.use(helmet());

app.use("/", register);
app.use(expressjwt({ secret: process.env.TOKEN_SECRET_KEY ?? "", algorithms: ["HS256"] }));
app.use("/user", user);
app.use("/memories", memory);


app.listen(5000, () => {
    console.log("Server running on port 5000\nLink: http://localhost:5000");
});