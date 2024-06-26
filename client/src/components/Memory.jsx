import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import {
  faThumbsUp as faThumbsUpSolid,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../api/axiosInstance";
import moment from "moment";
import { Navigate, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export default function Memory(props) {
  const [liked, setLiked] = useState(false);
  const [post, setPost] = useState(props);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState(false);
  const navigate=useNavigate();

  const style1 = {
    color: "blue",
  };
  useEffect(()=>{
    function isLiked(){//function to test if the user already like the post or not
      const index=props.likes.findIndex((id)=>id==props.userId);
      if(index!=-1){
        setLiked(true);
      }
    }
    isLiked();
    if(props.message.length<=130){
      setDescription(props.message);
    }else{
      const messageLimited=props.message.substring(0,130);
      const lastSpaceIndex=messageLimited.lastIndexOf(" ");//to remove the uncompleted words
      setDescription(props.message.substring(0,lastSpaceIndex)+"...");
    }
  },[]);
  async function likeMemory() {
      try {
        setIsLoading(true);
        const response=await axiosInstance.patch("/posts/"+props.id+"/likePost");
        if(response.data?.message!="unauthenticated"){
          setPost(response.data);
          setLiked(!liked);
        }else{
          navigate("/auth")
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error.message)
      }     
  }
  async function deleteMemory() {
    try {
      setIsLoading(true);
      const response=await axiosInstance.delete("/posts/"+props.id);
      if(response.data?.message=="unauthenticated"){
        navigate("/auth")
      }else{
        window.location.reload();
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
    }   
  }
  function viewDetail() {
    navigate("/posts/"+props.id);
  }
  return (
    <div className="memoryCard">
      <div className="imageContainer" onClick={viewDetail}>
        <div className="details">
          <p className="author">{props.name ? props.name : "Hichem Boulacheb"}</p>
          <p className="time">{moment(props.createdAt).fromNow()}</p>
        </div>

        <img src={props.img} alt="memory" className="memoryImage" />
      </div>
      <div className="memoryDetails">
        <p className="hashtag">{post.tags.map((tag) => `#${tag} `)}</p>
        <h1 className="memoryTitle">{post.title}</h1>
        <p className="memoryDescription">{description}</p>
        <div className="memoryLikes">
          <div className="likes">
            <FontAwesomeIcon
              icon={liked ? faThumbsUpSolid : faThumbsUp}
              className="memoryLikeIcon"
              onClick={likeMemory}
              style={liked && style1}
            />
            <p>{post.likes.length} Like</p>
            {isLoading && <ClipLoader color="blue" size={20} />}
          </div>
          {props.creatorId==props.userId && 
          <FontAwesomeIcon
            icon={faTrash}
            className="memoryDeleteIcon"
            onClick={deleteMemory} />
            }
        </div>
      </div>
    </div>
  );
}
