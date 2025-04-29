import express from "express";
import { userAuth } from "../middlewares/Auth.js";
import { validatedEditProfileData } from "../utils/validation.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import validator from 'validator';

const profileRouter=express.Router();

profileRouter.get("/profile/view",userAuth,async(req,res)=>{
      try{
        const user=req.user;
        res.send(user);
      }
      catch(err){
        res.status(400).send("error in fetching",err);
      }
});


profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
       if(!validatedEditProfileData(req)){
        throw new Error("invalid Edit Request");
       }
    //  const user=req.user;
    //     await User.findByIdAndUpdate(
    //     user._id,
    //     { $set: req.body },
    //     { new: true, runValidators: true }
    //   );
    //     res.send({ message: "User details updated successfully",});
    
    const loggedInUser=req.user;
    Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));

    await loggedInUser.save();
    res.send(`${loggedInUser.firstName} , your Profile Updated Successfuly`);



    }catch(err){
        res.status(400).send(err);
    }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = req.user;

        if (!currentPassword || !newPassword) {
            return res.status(400).send("Both current and new passwords are required.");
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).send("Current password is incorrect.");
        }

        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Please make password Strong!");
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.send("Password updated successfully.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong while updating the password.");
    }
});

export default profileRouter;
