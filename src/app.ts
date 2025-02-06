import express from "express";
import dotenv from "dotenv";
import { MainRouter } from "./routes/mainRoute";
import { connectMongoose } from "./db-config/db.config";
dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(express.json());

app.use("/api/v1", MainRouter.register());

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, async () => {
        await connectMongoose()
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
