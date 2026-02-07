 import jwt from "jsonwebtoken"


 const generateToken =  (userId)=>{
    return  jwt.sign({id:userId},"secret")
   
 }
 export default generateToken