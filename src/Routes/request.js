import express from "express";
import { userAuth } from "../middlewares/Auth.js";

const requestRouter=express.Router();

requestRouter.post("/sendConnectionRequest",userAuth,async(req,res)=>{
  const user=req.user;
  //sending a connection Request
  res.send(user.firstName + "sent the connection request");
})

export default requestRouter;
