import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import { validateSignupData } from "../utils/validation.js";

const authrouter=express.Router(); //same call as const authRouter=express.ROuter so we did the same

authrouter.post("/signup",async(req,res)=>{
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

authrouter.post("/login", async (req, res) => {
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


// module.exports=authrouter
export default authrouter;
