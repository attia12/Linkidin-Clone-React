import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protectedRoute = async (req, res, next) => {
   
    try {
        const token = req.cookies["jwt_linkindin"];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized -Invalid token" });
        }
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {  
            return res.status(401).json({ message: "User not found" });
        }
        req.user=user;
        next();
    } catch (error) {
            console.log("Error in protected route",error.message);
            res.status(500).json({ message: "Internal server error" });
    }
}
