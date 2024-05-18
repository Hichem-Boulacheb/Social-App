import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    title:String,
    message:String,
    name:String,
    creatorId:String,
    tags:[String],
    selectedFile:String,
    likes:{
        type:[String],
        default:[],
    },
    createdAt:{
        type:Date,
        default: new Date(),
    }
});
const PostMessage=mongoose.model("postMessage",postSchema);

export default PostMessage;