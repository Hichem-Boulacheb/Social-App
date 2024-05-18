import PostMessage from "../models/postMessage.js";


export const getPosts=async (req,res)=>{
    const {page}=req.query;
    try {
        const LIMIT=6;
        const lastIndexPost=Number(page)*LIMIT;
        const firstIndexPost=lastIndexPost-LIMIT;
        const total=await PostMessage.countDocuments({});
        const postMessages=await PostMessage.find().sort({_id:-1}).limit(LIMIT).skip(firstIndexPost);
        res.status(200).json({postMessages:postMessages,currentPage:Number(page),numberOfPages:Math.ceil(total/LIMIT)});
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}

export const getPostsBySearch=async(req,res)=>{
    const {searchQuery,tags}=req.query;
    try {
        const title=new RegExp(searchQuery,"i");
        const posts=await PostMessage.find({$or:[{title},{tags:{$in:tags.split(",")}}]});
        // if(searchQuery && tags){
        //     const posts=await PostMessage.find({$and:[{title},{tags:{$in:tags.split(",")}}]});
        // }else{
        //     const posts=await PostMessage.find({$or:[{title},{tags:{$in:tags.split(",")}}]});
        // }
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}

export const getPost=async(req,res)=>{
    try {
        const postMessage=await PostMessage.findOne({_id:req.params.id});
        res.status(200).json(postMessage);
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}

export const createPost=async(req,res)=>{
    try {
        const post =req.body;
        const newPost=new PostMessage({...post,creatorId:req.userId,createdAt:new Date()});
        await newPost.save();
        res.status(201).send(newPost);
    } catch (error) {
        res.status(409).json({message:error.message});
    }
}

export const updatePost=async(req,res)=>{
        try {
            const oldPost=await PostMessage.findOne({_id:req.params.id});
            const updatedPost={
                title:req.body.title || oldPost.title ,
                message:req.body.message || oldPost.message,
                creator:req.body.creator || oldPost.creator,
                tags:req.body.tags || oldPost.tags,
                selectedFile:req.body.selectedFile || oldPost.selectedFile,
            };
            const response =await PostMessage.findByIdAndUpdate({_id:req.params.id},updatedPost,{new:true});//you must pass an object(updatedPost) instead of a new PostMessage(document) , and to return the postUpdated pass {new:true}
            res.status(201).json(response);
        } catch (error) {
            res.status(409).json({message:error.messge});
        }
}

export const deletePost=async (req,res)=>{
    try {
        if(!req.userId) return res.json({message:"unauthenticated"})
        await PostMessage.deleteOne({_id:req.params.id});
        res.status(201).json({message:"Post deleted succesfullly"});//return a message not only the status code
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}

export const likePost=async(req,res)=>{
    try {
        const {id}=req.params;
        if(!req.userId) return res.json({message:"unauthenticated"});
        const postMessage=await PostMessage.findOne({_id:req.params.id});
        const index=postMessage.likes.findIndex((id)=>id===String(req.userId))
        if(index==-1){
            postMessage.likes.push(String(req.userId))
        }else{
            postMessage.likes=postMessage.likes.filter((id)=>id != String(req.userId))
        }
        const postLiked=await PostMessage.findByIdAndUpdate({_id:req.params.id},postMessage,{new:true});
        res.json(postLiked);
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}

