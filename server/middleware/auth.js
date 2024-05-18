import jwt,{decode} from "jsonwebtoken";

const auth =async(req,res,next)=>{
    try {
        const token=req.headers.authorization?.split(" ")[1];//to get the token from the headers
        const isCustomAuth= token?.length<500;//to distingue between custom token and google token
        let decodedData;
        if(token && isCustomAuth){// if it's our custom token
            decodedData=jwt.verify(token,process.env.SECRET);//test is the secret that we code with the token when sigin or signup
            req.userId=decodedData?.id;
        }else{// if it's a google token
            decodedData=jwt.decode(token);
            req.userId=decodedData?.sub;
        }
        next()
    } catch (error) {
        console.log(error);
    }
}
export default auth;