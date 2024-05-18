import express from "express";
import { getPosts,getPostsBySearch,createPost,getPost,updatePost,deletePost,likePost } from "../controllers/posts.js";
import auth from "../middleware/auth.js";

const router=express.Router();

router.get("/",getPosts);
router.get("/search",getPostsBySearch);
router.post("/",auth,createPost);
router.get("/:id",getPost);
router.patch("/:id",auth,updatePost);
router.delete("/:id",auth,deletePost);
router.patch("/:id/likePost",auth,likePost)

export default router;