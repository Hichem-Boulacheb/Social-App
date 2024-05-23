import React,{useState} from "react";
import Memories from "./Memories";
import Form from "./Form";

export default function Home() {
  const[posts,setPosts]=useState([]);
  const[isLoading,setIsLoading]=useState(false);
  function loading(state){
    setIsLoading(state);
  }
  return (
    <div className="homeContainer">
      <Memories posts={posts} setPosts={setPosts} isLoading={isLoading} loading={loading}  />
      <Form  setPosts={setPosts} isLoading={isLoading} loading={loading} />
    </div>
  );
}
