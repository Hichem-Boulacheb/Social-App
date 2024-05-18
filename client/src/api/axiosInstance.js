import axios from "axios";

/*const axiosInstance=axios.create({baseURL:"https://social-app-fvqn.vercel.app"})*/
const axiosInstance=axios.create({baseURL:"http://localhost:5000"})

axiosInstance.interceptors.request.use((req)=>{
    if(localStorage.getItem("profile")){
        req.headers.Authorization="Bearer "+JSON.parse(localStorage.getItem("profile")).token;//to store the token in the header of each request to let the user do thing need an authentication 
    }
    return req;
})

export default axiosInstance;
