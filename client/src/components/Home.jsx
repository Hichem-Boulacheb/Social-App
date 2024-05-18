import React,{useState} from "react";
import Memories from "./Memories";
import Form from "./Form";

export default function Home() {
  const[posts,setPosts]=useState([]);
  return (
    <div className="homeContainer">
      <Memories posts={posts} setPosts={setPosts} />
      <Form  setPosts={setPosts} />
    </div>
  );
}
