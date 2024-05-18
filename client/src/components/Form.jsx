import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import FileBase from "react-file-base64";
import { useNavigate,useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons"


export default function Form(props) {
  const navigate=useNavigate();

  const [search, setSearch] = useState({
    Memories: "",
    Tags: "",
  });
  const [memory, setMemory] = useState({
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
  });
  const [tags,setTags]=useState([]);
  
  function handleChangeSearch(event) {
    setSearch({ ...search, [event.target.name]: event.target.value });
  }
  function addTag(event){
    if(event.key==="Enter" && search.Tags){
      event.preventDefault();
      setTags([...tags,search.Tags]);
      setSearch({...search,Tags:""});
    }
  }
  function deleteTag(indexToRemove){
    setTags(tags.filter((tag,index)=>index!=indexToRemove))
  }
  async function searchMemory(event) {
    event.preventDefault();
    if(search.Memories.trim() || tags.length!=0){
      try {
        navigate(`/posts/search?searchQuery=${search.Memories || ""}&tags=${tags.join(",")}`);
        const response=await axiosInstance.get(`/posts/search?searchQuery=${search.Memories || "none"}&tags=${tags.join(",")}`);
        setSearch({
          Memories: "",
          Tags: "",
        });
        setTags([]);
        props.setPosts(response.data)
      } catch (error) {
        console.log(error.message);
      }
    }else{
      window.location.reload();
    }
  }
  function handleChangeMemory(event) {
    setMemory({ ...memory, [event.target.name]: event.target.value });
  }
  async function handleSubmit(event) {
    event.preventDefault();
    const name=JSON.parse(localStorage.getItem("profile"))?.userName;
    if(name){
      try {
        await axiosInstance.post ("/posts",{...memory,name:name})
      } catch (error) {
        console.log(error.message);
      }
      window.location.reload();
    }else{
      navigate("/auth")
    }
  }
  function clearAll(event) {
    event.preventDefault();
    setMemory({
      title: "",
      message: "",
      tags: "",
      selectedFile: "",
    });
  }
  return (
    <div className="formContainer">
      <div>
        <form onSubmit={searchMemory} method="POST" className="form">
          <input
            type="text"
            name="Memories"
            placeholder="Search Memories"
            onChange={handleChangeSearch}
            value={search.Memories}
          />
          <div className="tagInputContainer">
            <ul id="tags">
              {tags.map((tag,index)=>{
                return(
                  <li key={index}>
                    <span>{tag}</span>
                    <FontAwesomeIcon icon={faXmark} className="xmarkIcon" onClick={()=>deleteTag(index)} />
                  </li>
                )
              })}
            </ul>
            {
              tags.length<3 && (
                <input
                  id="tagInput"
                  type="text"
                  name="Tags"
                  placeholder="Search Tags"
                  onChange={handleChangeSearch}
                  value={search.Tags}
                  onKeyDown={addTag}
                />
              )
            }
          </div>
          <button type="submit" className="formButton" onClick={searchMemory}>
            SEARCH
          </button>
        </form>
      </div>
      <div>
        <form method="POST" className="form">
          <p id="title">Creating a Memory</p>
          <input
            type="text"
            name="title"
            placeholder="Title"
            onChange={handleChangeMemory}
            value={memory.title}
          />
          <input
            id="messageInput"
            type="text"
            name="message"
            placeholder="Message"
            onChange={handleChangeMemory}
            value={memory.message}
          />
          <input
            type="Tags"
            name="tags"
            placeholder="Tags (seperated with comma ,)"
            onChange={(event) => {
              setMemory({
                ...memory,
                [event.target.name]: event.target.value.split(","),
              });
            }}
            value={memory.tags}
          />
          <div className="fileContainer">
            <FileBase
              type="file"
              multiple={false}
              onDone={({ base64 }) =>
                setMemory({ ...memory, selectedFile: base64 })
              }
            />
          </div>
          <button
            type="submit"
            id="submitButton"
            className="formButton"
            onClick={handleSubmit}
          >
            SUBMIT
          </button>
          <button onClick={clearAll} id="clearButton">
            CLEAR
          </button>
        </form>
      </div>
    </div>
  );
}
