import React, { useState, useEffect } from "react";
import Memory from "./Memory";
import axiosInstance from "../api/axiosInstance";
import PaginationTab from "./PaginationTab";
import {useLocation,useNavigate} from "react-router-dom";
import {ClipLoader} from "react-spinners"


function useQuery(){
  return new URLSearchParams(useLocation().search)
}
export default function Memories(props) {
  const [userId,setUserId]=useState("");
  const query=useQuery();
  const [currentPage,setCurrentPage] = useState(query.get("page") || 1);
  const [numberOfPages,setNumberOfPages] = useState(0);
  const [isLoading,setIsLoading] = useState(false);
  const searchQuery=query.get("searchQuery");
  const tagsQuery=query.get("tags");
  const navigate=useNavigate();
  function changePage(page) {
    setCurrentPage(page);
  }
  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        if(searchQuery ||tagsQuery){
          const response=await axiosInstance.get(`/posts/search?searchQuery=${searchQuery || "none"}&tags=${tagsQuery}`);
          props.setPosts(response.data);
        }else{
          navigate("/posts?page="+currentPage)
          const response=await axiosInstance.get(`/posts?page=${currentPage}`);
          props.setPosts(response.data.postMessages); 
          setNumberOfPages(response.data.numberOfPages);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchPosts();
  }, [currentPage]);
  useEffect(()=>{
    function getUserId(){
      const user=JSON.parse(localStorage.getItem("profile"));
      if(user){
        setUserId(user.id)
      }
    }
    getUserId()
  },[userId])
  return (
    <div className="MemoriesWithTab">
      <div className="MemoriesContainer">
        {isLoading ? <ClipLoader color="blue" size="40"  /> :props.posts.map((post) => (
          <Memory
            key={post._id}
            id={post._id}
            userId={userId}
            creatorId={post?.creatorId}
            name={post.name}
            img={post.selectedFile}
            tags={post.tags}
            title={post.title}
            message={post.message}
            likes={post.likes}
            createdAt={post.createdAt}
          />
        ))}
      </div>
      {!searchQuery && !tagsQuery && numberOfPages>1 && !isLoading && <PaginationTab currentPage={currentPage} changePage={changePage} numberOfPages={numberOfPages} />}
      
    </div>
  );
}
