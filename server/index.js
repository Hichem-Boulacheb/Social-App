import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import dotenv from "dotenv";
dotenv.config()

const app=express();
const port=5000;

app.use(bodyParser.json({limit:"30mb",extended:true}));//en raison de securité pour eviter les attaques Dos
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));//pour lire le corps des requetes
app.use(cors());//pour répondre à des requetes provenant d'autre domaine de celui du serveur d'origine

app.use("/posts",postRoutes);
app.use("/users",userRoutes);

mongoose.connect(process.env.DB_URL).then(console.log("mongodb is fine")).catch((err)=>console.log(err))

app.listen(port,()=>{
    console.log("server is running on port "+port)
})
