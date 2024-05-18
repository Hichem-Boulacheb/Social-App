import React,{ useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock,faEye,faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {GoogleLogin} from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Auth(){
    const [signup,setSignup]=useState(false);
    const [formData,setFormData]=useState({EmailAdress:"",Password:""});
    const [showPassword,setShowPassword]=useState(false);
    const navigate=useNavigate();

    async function loginWithGoogle(response){
        const decoded=jwtDecode(response.credential);
        const res=await axiosInstance.post("/users/signinWithGoogle",{
            EmailAdress:decoded.email
        })
        if(res.status==200){
            const user={
                token:response.credential,
                userName:`${decoded.given_name} ${decoded.family_name}`,
                image:decoded.picture || res.data.image,
                email:decoded.email,
                id:decoded.sub
            }
            localStorage.setItem("profile",JSON.stringify({...user}))
            navigate("/")
        }
        window.location.reload()
    } 
    async function signupWithGoogle(response){
        const decoded=jwtDecode(response.credential);
        const res=await axiosInstance.post("/users/signupWithGoogle",{
            userName:`${decoded.given_name} ${decoded.family_name}`,
            EmailAdress:decoded.email,
            sub:decoded.sub,
            image:decoded.picture
        })
        if(res.status==200){
            const newUser={
                token:response.credential,
                userName:`${decoded.given_name} ${decoded.family_name}`,
                image:decoded.picture,
                email:decoded.email,
                id:decoded.sub
            }
           localStorage.setItem("profile",JSON.stringify({...newUser}))
           navigate("/")
        }
       window.location.reload();
    }

    function switchMode(){
        setSignup(!signup);
        setFormData({EmailAdress:"",Password:""});
        setShowPassword(false);
    }
    function handleChange(e){
        setFormData({...formData,[e.target.name]:e.target.value});
    }
    async function handleSubmit(e){
        e.preventDefault();
        if(signup){
            try {
                const result=await axiosInstance.post("/users/signup",formData);
                console.log(result.data)
                if(result){
                    localStorage.setItem("profile",JSON.stringify({...result.data}))
                    navigate("/")
                    window.location.reload();
                }else{
                    window.location.reload();
                }
            } catch (error) {
                console.log(error)
            }
        }else{
            try {
                const result=await axiosInstance.post("/users/signin",formData)
                if(result){
                    localStorage.setItem("profile",JSON.stringify({...result.data}))
                    navigate("/")
                    window.location.reload();
                }else{
                    window.location.reload();
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
    return(
        <div className="authFormContainer">
            <form method="POST" className="authForm">
                <div className="authTitle" >
                    <div id="lockIconContainer">
                        <FontAwesomeIcon id="lockIcon" icon={faLock} />
                    </div>
                    {signup ? <h2>Sign up</h2> : <h2>Sign in</h2>}
                </div>
                {signup && <div className="NameInput">
                <input type="text" name="FirstName" placeholder="First Name*" onChange={handleChange} />
                <input type="text" name="LastName" placeholder="Last Name*" onChange={handleChange} />
                </div> }
                <input type="text" name="EmailAdress" placeholder="Email Address*" onChange={handleChange} value={formData.EmailAdress} />
                <div className="input_with_icon">
                  <input type={showPassword ? "text" : "password"} name="Password" placeholder="Password*" onChange={handleChange} value={formData.Password} />
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="eyeIcon" onClick={()=>setShowPassword(!showPassword)}  />
                </div>
                {signup && <input type="password" name="RepeatPassword" placeholder="Repeat Password*" onChange={handleChange} />}
                {signup ? <button className="formButton" onClick={handleSubmit}>SIGN UP</button> : <button className="formButton" onClick={handleSubmit}>Sign in</button>}
                {signup ? <GoogleLogin onSuccess={(response)=>signupWithGoogle(response)} onError={(err)=>console.log(err.message)} /> : <GoogleLogin onSuccess={(response)=>loginWithGoogle(response)} onError={(err)=>console.log(err.message)} />}
                {signup ? <p className="switch">Already have an account? <span className="switchButton" onClick={switchMode}>Sign in</span> </p> : <p className="switch">Create an account <span className="switchButton" onClick={switchMode}>Sign up</span> </p> }
            </form>
        </div>
    )
}