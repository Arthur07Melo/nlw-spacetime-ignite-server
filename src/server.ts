import express from "express";
import cors from "cors";
import helmet from "helmet";

import user from "./routes/user";
import memory from "./routes/memory";

const app = express();

app.use(cors());
app.use(helmet());

app.use("/user", user);
app.use("/memories", memory);


app.listen(5000, () => {
    console.log("Server running on port 5000\nLink: http://localhost:5000");
});