import dns from "node:dns";             
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import "dotenv/config";
import multer from "multer";
import connectDB from "./config/db.js";
import authRouter from "./routes/AuthRoutes.js";
import employeesRouter from "./routes/EmployeeRoutes.js";
import profileRouter from "./routes/ProfileRoutes.js";
import attendanceRouter from "./routes/AttendanceRoutes.js";
import payslipRouter from "./routes/PayslipsRoutes.js";

import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"

const app = express()
const PORT = process.env.PORT || 4000;

//Middleware
app.use(cors())
app.use(express.json())
app.use(multer().none())

//Routes
app.get("/", (req, res) => res.send("StaffSync Server is Running!!"))
app.use("/api/auth", authRouter)
app.use("/api/employees", employeesRouter)
app.use("/api/profile", profileRouter)
app.use("/api/attendance", attendanceRouter)
app.use("/api/payslips", payslipRouter)
await connectDB()
app.use("/api/inngest", serve({ client: inngest, functions, signingKey: process.env.INNGEST_SIGNING_KEY }));
app.listen(PORT, () => console.log(`Server running on  http://localhost:${PORT}`))