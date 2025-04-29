import express from "express";
import { userAuth } from "../middlewares/Auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
const userRouter=express.Router();
import User from "../models/user.js";
const USER_SAFE_DATA="firstName lastName photoUrl age gender about skills";

//get all the pending connection request for the loggedin user
userRouter.get("/user/requests/recieved",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;


        const connectionRequest=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested",
        }).populate("fromUserId",["firstName","lastName"]);


        res.json({
            message:"Data fetched succesfully",
            data:connectionRequest,
        })
    }catch(err){
        res.send("ERROR :",err);
    }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;

        //try to find conn req which is accepted
        const connectionRequest=await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"},
            ],
        })
        .populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA);

        const data=connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
               return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json(data)
    }catch(err){
        res.send("ERROR")
    }
})


userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;

        const page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit) || 10;
        limit=limit > 50 ? 50 : limit;
        const skip=(page-1)*limit;

        //find all the connection request (send + recieved)
        const connectionRequest=await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUserFromFeed=new Set();
        connectionRequest.forEach(req=>{
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        })
        
        const users=await User.find({
            $and:[
            {_id:{$nin:Array.from(hideUserFromFeed)}},
            {_id:{$ne:loggedInUser._id}},
            ]
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);


         
        res.json({data:users});
    }catch(err){
        res.status(400).send("ERROR :",err);
    }
})


export default userRouter;