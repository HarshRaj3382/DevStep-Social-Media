import express from "express";
import { userAuth } from "../middlewares/Auth.js";

const profileRouter=express.Router();

profileRouter.get("/profile",userAuth,async(req,res)=>{
      try{
        const user=req.user;
        res.send(user);
      }
      catch(err){
        res.status(400).send("error in fetching",err);
      }
})

export default profileRouter;
