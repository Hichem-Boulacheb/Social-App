import React, { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode";

export default function NavBar(props){
    const navigate=useNavigate();
    const [user,setUser]=useState(JSON.parse(localStorage.getItem("profile")));
    function logout(){
        localStorage.removeItem("profile");
        window.location.reload();
    }
    useEffect(()=>{
        const token=user?.token;
        if(token){
            const decodedToken=jwtDecode(token);
            if(decodedToken.exp*1000<new Date().getTime()) logout()// to check if the token expired and logout the user if the case
        }
    },[])
    return (
        <ul className="navBar">
            <div className="logo" onClick={()=>navigate("/")}>
                <h1><span id="firstLetter">M</span>EMORIES</h1>
                <img src="/images/memories.png" alt="logo" id="logoImage" />
            </div>
            <div className="account">
            {props.loggedIn ? <>
                <img src={props.image ? props?.image : "./images/defaultImage.png"} alt="account" className="accountImage" />
                <p>{props?.username}</p>
                <button className="btn" id="red" onClick={logout}>LOGOUT</button>
            </> : <button className="btn" id="blue" onClick={()=>navigate("/auth")}>SIGN IN</button> }
                
            </div> 
            
        </ul>
    )
}