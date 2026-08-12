import { DEPARTMENTS } from "../constants/departments.js";
import Attendance from "../models/Attendance.js"
import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";
import Payslip from "../models/Payslip.js";

const getAttendanceDayStart = (date = new Date()) => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });

    const parts = formatter.formatToParts(date);
    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;

    return new Date(`${year}-${month}-${day}T00:00:00+05:30`);
};

// Get dashboard for employee and admin
// GET /api/dashboard
export const getDashboard = async (req, res) => {
    try {
        const session = req.session;
        if(session.role === "ADMIN") {
            const todayStart = getAttendanceDayStart();
            const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

            const [totalEmployees, todayAttendance, pendingLeaves] = await Promise.all([
                Employee.countDocuments({isDeleted: { $ne: true }}),
                Attendance.countDocuments({
                    date: {
                        $gte: todayStart,
                        $lt: todayEnd
                    }
                }),
                LeaveApplication.countDocuments({ status: "PENDING" })
            ])

            return res.json({
                role: "ADMIN",
                totalEmployees,
                totalDepartments: DEPARTMENTS.length,
                todayAttendance,
                pendingLeaves
            })
        } else {
            const employee = await Employee.findOne({
                userId: session.userId,
            }).lean();
            if(!employee) return res.status(404).json({ error: "Employee not found!" });

            const today = new Date();
            const [currentMonthAttendance, pendingLeaves, latestpayslip] = await Promise.all([
                Attendance.countDocuments({
                    employeeId: employee._id,
                    date: {
                        $gte: new Date(today.getFullYear(), today.getMonth(), 1),
                        $lt: new Date(today.getFullYear(), today.getMonth() + 1, 1),
                    }
                }),
                LeaveApplication.countDocuments({
                    employeeId: employee._id,
                    status: "PENDING",
                }),
                Payslip.findOne({ employeeId: employee._id }).sort({ createdAt: -1 }).lean(),
            ])

            return res.json({
                role: "EMPLOYEE",
                employee: {...employee, id: employee._id.toString()},
                currentMonthAttendance,
                pendingLeaves,
                latestPayslip: latestpayslip ? {...latestpayslip, id: latestpayslip._id.toString()} : null
            })
        }
    } catch (error) {
        console.error("Dashboard Error: ", error)
        return res.status(500).json({ error: "Failed!" });
    }
}