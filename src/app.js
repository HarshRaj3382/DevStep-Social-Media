
import express from "express";
import connectDB from "./config/database.js"; // don't forget the `.js` extension in ESM
import User from "./models/user.js";
import { validateSignupData } from "./utils/validation.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";


import {userAuth} from "./middlewares/Auth.js";

const app = express();

app.use(express.json());  
app.use(cookieParser());

app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
  const user=req.user;
  //sending a connection Request
  res.send(user.firstName + "sent the connection request");
})

app.get("/profile",userAuth,async(req,res)=>{
      try{
        const user=req.user;
        res.send(user);
      }
      catch(err){
        res.status(400).send("error in fetching",err);
      }
})


app.post("/signup",async(req,res)=>{
  try{
    const {firstName,lastName,emailId,password} =req.body;
// step-1  validation of data
  validateSignupData(req);

// encrpypt the Password
    const passwordHash =await bcrypt.hash(password,10);

// creating a new instance of the the User model
  const user=new User({
    firstName:firstName,
    lastName:lastName,
    emailId:emailId,
    password:passwordHash
  });
  await user.save();
  res.send("User Added Successfully");
  }catch(err){
    res.status(400).send("ERROR :"+ err.message);
  }
})


app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      throw new Error("EmailId and password are required");
    }

    const user = await User.findOne({ emailId:emailId })
    if (!user) {
      throw new Error("Invalid Credential");
    }

    

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // create jwt token

      const token=await user.getJWT();
      

      res.cookie("token",token,{
        expires:new Date(Date.now()+8*360000),
      });
      res.send("Login Successful!!!");
    } else {
      throw new Error("Invalid Credentials");
    }

  } catch (err) {
    console.error("Login error:", err);
    res.status(400).send("Error in login: " + err.message);
  }
});

app.get("/getData/:id",async(req,res)=>{
        const {id}=req.params;
        try{
         const user= await User.find({})
           res.send(user);
        }catch(err){
            console.log("Somethign happen whilke fetching");
        }
        
})

app.delete("/delete",async(req,res)=>{
        const userId=req.body.userId;
        try{
         const response= await User.findByIdAndDelete({_id:userId})
         console.log("user deleted Succesfuly");
         res.send(response)
        }catch(err){
            console.log("Khelo Hobe",err);
        }
      
})

app.patch("/update/:userId",async(req,res)=>{
        
        const userId=req.params?.userId;
        const data=req.body;

      


        try{
          const ALLOWED_UPDATES=[
            "photoUrl","about","gender","age","skills"
          ]
  
          const isUpdateAllowed=Object.keys(data).every((k)=>
            ALLOWED_UPDATES.includes(k)
          );
  
          if(!isUpdateAllowed){
            throw new Error("update Not Allowed");
          }

          if(data?.skills.length > 10){
            throw new Error("Skiils reached its maximunm ")
          }

            await User.findByIdAndUpdate({
              _id:userId},{
                emailId:email
              }
            )
            console.log("user Updated")
            res.send("user updated successfully");
        }catch(err){
          console.log("errror")
        }
})

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on 3000....");
    });
  })
  .catch((err) => {
    console.log("Error in DB Connection", err);
  });
