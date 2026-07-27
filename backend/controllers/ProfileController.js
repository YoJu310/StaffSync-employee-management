import Employee from "../models/Employee.js";
import User from "../models/User.js";


// Get Profile
// GET /api/profile
export const getProfile = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({userId: session.userId})

        if(employee) {
            return res.json(employee)
        }

        const user = await User.findById(session.userId).lean();
        const username = user?.email?.split("@")[0] || "Admin";
        const formattedName = username ? username.charAt(0).toUpperCase() + username.slice(1) : "Admin";
        return res.json({
            firstName: formattedName,
            lastName: "",
            email: session.email,
            bio: user?.bio || "",
        })
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch profile!" })
    }
}

// Update Profile
// POST /api/profile
export const updateProfile = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({userId: session.userId})

        if(employee) {
            if(employee.isDeleted) {
                return res.status(403).json({ error: "Your account is Deactivated. You cannot update your profile." })
            }
            await Employee.findByIdAndUpdate(employee._id, {
                bio: req.body.bio
            })
            return res.json({ success: true })
        }

        const user = await User.findById(session.userId)
        if(!user) {
            return res.status(404).json({ error: "User not found!!" });
        }
        await User.findByIdAndUpdate(user._id, { bio: req.body.bio })
        return res.json({ success: true })
    } catch (error) {
        return res.status(500).json({ error: "Failed to update profile!" });
    }
}