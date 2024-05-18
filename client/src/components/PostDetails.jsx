import React,{useEffect,useState} from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import moment from "moment";

export default function PostDetails(){
    const {id}=useParams();
    const [post,setPost]=useState();
    useEffect(()=>{
        async function getPostDetails(){
            try {
                const response=await axiosInstance.get("/posts/"+id);
                setPost(response.data);
            } catch (error) {
                console.log(error.message)
            }
        }
        getPostDetails();
    },[])
    return(
        <>
            {post &&
                <div className="memoryDetailContainer">
                    <div className="memoryDetailInfo">
                        <h1 className="title">{post.title}</h1>
                        <p className="tags">{post.tags.map((tag)=>`#${tag}`)}</p>
                        <p className="description">{post.message}</p>
                        <h3 className="creator">Created by:{post.name}</h3>
                        <p className="time">{moment(post.createdAt).fromNow()}</p>
                        <hr></hr>
                        <h3 className="feature">Realtime Chat - coming soon</h3>
                        <hr></hr>
                        <h3 className="feature">Comments - coming soon</h3>
                    </div>
                    <img src={post.selectedFile} alt="memoryImage" />
                </div> 
            } 
        </>
    )
}