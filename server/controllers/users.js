import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export async function signin(req,res){
    const {EmailAdress,Password}=req.body;
    try {
       const existingUser=await User.findOne({email:EmailAdress});
       if(!existingUser) return res.status(404).json({messsage:"User doesn't exist"});
       const isPasswordCorrect=await bcrypt.compare(Password,existingUser.password);
       if(!isPasswordCorrect) return res.status(400).json({message:"Incorrect password"});
       const token=jwt.sign({email:existingUser.email,id:existingUser._id},"test",{expiresIn:"1h"});
       res.status(200).json({id:existingUser._id,email:existingUser.email,userName:existingUser.userName,image:existingUser.image,token});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

export async function signup(req,res){
    const {FirstName,LastName,EmailAdress,Password,RepeatPassword}=req.body;
    try {
        const existingUser=await User.findOne({email:EmailAdress});
        if(existingUser)return res.status(400).json({message:"User already exists"});
        if(Password!=RepeatPassword) return res.status(400).json({message:"Passwords don't match "});
        const hashedPassword=await bcrypt.hash(Password,12);
        const newUser=new User({
            userName:`${LastName} ${FirstName}`,
            email:EmailAdress,
            password:hashedPassword,
            image:"",
        })
        const result=await newUser.save();
        const token=jwt.sign({email:result.email,id:result._id},"test",{expiresIn:"1h"});
        res.status(200).json({id:result._id,email:result.email,userName:result.userName,image:result.image,token});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
export async function signupWithGoogle(req,res){
    const {userName,EmailAdress,sub,image}=req.body;
    try {
        const existingUser=await User.findOne({email:EmailAdress});
        if(existingUser)return res.status(400).json({message:"User already exists"});
        const newUser=new User({
            sub:sub,
            userName:userName,
            email:EmailAdress,
            image:image,
        })
        const result=await newUser.save();
        res.status(200).json({id:result.sub,email:result.email,userName:result.userName,image:result.image})
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
export async function signinWithGoogle(req,res){
    const {EmailAdress}=req.body;
    try {
       const existingUser=await User.findOne({email:EmailAdress});
       if(!existingUser) return res.status(404).json({messsage:"User doesn't exist"});
       res.status(200).json({id:existingUser.sub,email:existingUser.email,userName:existingUser.userName,image:existingUser.image});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}