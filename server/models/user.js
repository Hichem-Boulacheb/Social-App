import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    userName:String,
    email:String,
    password:String,
    image:String,
    sub:String,
})
const User=mongoose.model("users",userSchema);

export default User;