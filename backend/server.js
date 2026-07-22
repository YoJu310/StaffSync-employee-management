import dns from "node:dns";             
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import "dotenv/config";
 
import connectDB from "./config/db.js";
 

const app = express()
const PORT = process.env.PORT || 4000;

//Middleware
app.use(cors())
app.use(express.json())

//Routes
app.get("/", (req, res) => res.send("StaffSync Server is Running!!"))


await connectDB()
app.listen(PORT, () => console.log(`Server running on  http://localhost:${PORT}`))