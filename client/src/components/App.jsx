import React,{useEffect,useState} from "react";
import NavBar from "./NavBar";
import "../App.css";
import Home from "./Home";
import {Route,Routes,Navigate} from "react-router-dom";
import Auth from "./Auth";
import PostDetails from "./PostDetails";

export default function App(){
    const [user,setUser]=useState(JSON.parse(localStorage.getItem("profile")));
    useEffect(()=> {
        setUser(JSON.parse(localStorage.getItem("profile")));
    },[])
    //get the user if you need it
    return(
        <>
            {user ? <NavBar image={user.image} username={user.userName} loggedIn={true} /> : <NavBar loggedIn={false} />}
            <Routes>
                <Route path="/posts" element={<Home />} />
                <Route path="/posts/search" element={<Home />} />
                <Route path="/posts/:id" element={<PostDetails />} />
                <Route path="/" element={<Navigate to="/posts" />} />
                <Route path="/auth" element={user ? <Navigate to="/posts" /> : <Auth />} />
            </Routes>
        </>
       
    )
}