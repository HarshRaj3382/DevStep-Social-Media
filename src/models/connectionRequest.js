// import mongoose, { Types } from "mongoose";

// const connectionRequestSchema=new mongoose.Schema({

//     fromUserId:{
//         Type:mongoose.Schema.Types.ObjectId
//     },
//     toUserId:{
//         Type:mongoose.Schema.Types.ObjectId
//     },
//     status:{
//         type:String,
//         enum:{
//             values:["ignore","intrested","accepted","rejected"],
//             message:`{VALUE} is incorrect ,NOT SUPPORTED Value `
//         },
//     }
// },
// {timestamps:true}

// );

// const connectionRequestModel=new mongoose.model("ConnectionRequest",connectionRequestSchema);
// module.exports=connectionRequestModel;


import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  },
  status: {
    type: String,
    enum: {
      values: ["ignore", "interested", "accepted", "rejected"],
      message: `{VALUE} is not a supported value`,
    },
  },
}, { timestamps: true });


//mongodb will see all the optimization
connectionRequestSchema.index({fromUserId:1,toUserId:1})



connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;
    //check if the fromUserId is Same a stoUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
      throw new Error("Cannot send connection request to youself!");
    }
    next();
});


const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

export default ConnectionRequest;
