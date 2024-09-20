import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

export const signup = async (req,res)=> {
    try {
        const {name,username,email,password}=req.body;
        if(!name || !username || !email || !password){
            return res.status(400).json({
                message : "All fields are required"
            })
        }
        const existingUserEmail=await User.findOne({email});
        if(existingUserEmail){
            return res.status(400).json({
                message : "Email already exists"
            })
            
        }
        const existingUserName=await User.findOne({ username });
        if(existingUserName){
            return res.status(400).json({       
                message : "Username already exists"
            })
        }
        if(password.length<6){
            return res.status(400).json({   
                message : "Password must be at least 6 characters"
            })
        }
        // hash password
        const salt =await bcrypt.genSalt(10);
        const hashedPassword =await bcrypt.hash(password,salt);
        const user= new User({
            name,
            username,
            email,
            password: hashedPassword
        })
        await user.save();
        const token =jwt.sign({ userId:user._id },process.env.JWT_SECRET,{
            expiresIn:"3d"
            
        })
        res.cookie("jwt_linkindin",token, {
            httpOnly:true, //prevent xss attack prevent users to access cookie using javascript
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite:"strict", // prevent  csrf attack
            secure: process.env.NODE_ENV === "production", // prvent main-in-the middle attack
        });
        res.status(201).json({ message: "User created successfully"});
        const profileUrl=process.env.CLIENT_URL+"/profile/"+user.username;

        // send welcome email
        try {
             await sendWelcomeEmail(user.email,user.name,profileUrl);

        } catch (error) {
            console.error("Error in sending welcome email:", {
                message: error.message, // Log the error message
                stack: error.stack,     // Log the stack trace for debugging
                email: user.email,      // Log the email you tried to send to
              });
        }
            
       

        
    } catch (error) {
        console.log("Error in signup",error.message);
        res.status(500).json({ message: "Internal server error"});
    }
   
}
export const login = async (req,res)=> {
    try {
        const {username,password}=req.body;
        // check if the user exist 
        const user=await User.findOne({username});
        if(!user){
            return res.status(400).json({
                message : "Invalid credentials"
            })
        }
        //check password
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                message : "Invalid credentials"
            })
        }
        // create and send token
        const token =jwt.sign({ userId:user._id },process.env.JWT_SECRET,{
            expiresIn:"3d"
        });
        res.cookie("jwt_linkindin",token, {
            httpOnly:true, //prevent xss attack prevent users to access cookie using javascript
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite:"strict", // prevent  csrf attack
            secure: process.env.NODE_ENV === "production", // prvent men-in-the middle attack
        });
        res.status(200).json({ message: "User logged in successfully"});
        }
     catch (error) {  
        console.log("Error in login",error);
        res.status(500).json({ message: "Internal server error"});

    }
   
}
export const logout = (req,res)=> {
   res.clearCookie("jwt_linkindin");
   res.json({message:"Logged out successfully"});
}
export const getCurrentUser=async(req,res)=>{
    
    try {
      res.json(req.user);
    } catch (error) {
        console.log("Error in getCurrentUser",error.message);
        res.status(500).json({ message: "Internal server error"});
    }
}