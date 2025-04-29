// import express from "express";
// import { userAuth } from "../middlewares/Auth.js";
// // import connectionRequestModel from "../models/connectionRequest"

// const connectionRequestModel=require("../models/connectionRequest.js")


// const requestRouter=express.Router();

// requestRouter.post(
//   "/request/send/interested/:toUserId",
//   userAuth,
//   async(req,res)=>{
//   try{
//     const fromUserId=req.user._id;   //user who send the req
//     const toUserId=req.params.toUserId;
//     const status=req.params.toUserId;

//     const connectionRequest=new connectionRequestModel({
//         fromUserId,
//         toUserId,
//         status,
//     });


//   }catch(err){
//     console.log("EROOR");
//   }
// })

// export default requestRouter;



import express from "express";
import { userAuth } from "../middlewares/Auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id; // user who sends the request
      const toUserId = req.params.toUserId;
      const status = "interested"; // Set status to "interested" by default

      const allowedStatus=["ignored","interested"];
      if(!allowedStatus){
        return res.status(400).send("Invalid status type");
      }

      

      //if if reciever is exits or not
      const okUser=await User.findById(toUserId);
      if(!okUser){
        return res.status(404).send("User not found");
      }


      // if there is an existing ConnectionRequestion it sholuid must check from the both side 
      const existingConnectionRequest= await ConnectionRequest.findOne({
        $or:[
          {fromUserId,toUserId}, 
          {fromUserId:toUserId,toUserId:fromUserId},
        ]
      })

      //if already exists
      if(existingConnectionRequest){
        return res.status(400).send("Connection Request Already Exits");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

     const data= await connectionRequest.save();
      res.send({
         message:req.user.firstName+"  "+status+" "+okUser.firstName,
         data });
      
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Error sending connection request" });
    }
  }
);


requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async(req,res)=>{
  try{
    const {status,requestId}=req.params;
    const loggedInUser=req.user;


    //validation
    const allowedStatus=["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({
        message:"status not allowed!"
      })
    }

    const connectionRequest=await ConnectionRequest.findOne({
      _id:requestId,
      toUserId:loggedInUser._id,
      status:"interested",
    });

    if(!connectionRequest){
      return res
      .status(404)
      .json({message:"Connection reuesdt not found"});
    };

    //all the things are right so now we can change the condition for the status
    connectionRequest.status=status;
    const data=await connectionRequest.save();
    res.json({message:"Connection request "+status ,data});


  }catch(err){
      res.status(400).send("ERROR: ",err.message);
  }

  }
)

export default requestRouter;

