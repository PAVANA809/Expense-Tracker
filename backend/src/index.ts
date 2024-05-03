import express, {Request,Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';

import userRoutes from './routes/uses';
import authRoutes from './routes/auth';
import expenseRoutes from './routes/expenses';

import cookieParser from "cookie-parser";
import path from 'path';

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string, {
    dbName: "ET"
});

const app = express();
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "../../frontend/dist")))

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/expense", expenseRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
})