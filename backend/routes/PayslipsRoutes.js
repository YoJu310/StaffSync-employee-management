import { Router } from "express";
import { protect, protectAdmin } from "../middleware/Auth.js";
import { createPayslip, getPayslipById, getPayslips } from "../controllers/PayslipController.js";

const payslipRouter = Router();

payslipRouter.post("/", protect, protectAdmin, createPayslip)
payslipRouter.get("/", protect, getPayslips)
payslipRouter.get("/:id", protect, getPayslipById)

export default payslipRouter;