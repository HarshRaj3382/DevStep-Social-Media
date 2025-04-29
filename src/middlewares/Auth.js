import jwt from 'jsonwebtoken'
import User from '../models/user.js';

export const userAuth=async(req,res,next)=>{
    try{
        //read the token from the req validate the token and find the user
    const {token}=req.cookies;
    if(!token){
        return res.status(401).send("you are not logged in,please login");
    }
    const decoddedObj=await jwt.verify(token,"3382");

    const {_id}=decoddedObj

    const user=await User.findById(_id);
    if(!user){
        throw new Error("User Not Found");
    }
    req.user=user;
    next();
    }catch(err){
        res.status(400).send("ERROR :"+err.message);
    }
 };



