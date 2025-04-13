// import mongoose from "mongoose";



// const userSchema=new mongoose.Schema({
//     firstName:{
//         type:String,
//         required:true,
//         minLength:4,
//         maxLength:50,
//     },
//     lastName:{
//         type:String
//     },
//     emailId:{
//         type:String,
//         unique:true,
//         lowercase:true,
//         trim:true,
//     },
//     password:{
//         type:String
//     },
//     age:{
//         type:Number,
//         min:18
//     },
//     gender:{
//         type:String,
//         validate(value){
//             if(!["male" ,"female","others"].includes(value)){
//                 throw new Error("Gender Not valid!");
//             }
//         },
//     },
//     photoUrl:{
//         type:String,
//         default:""
//     },
//     about:{
//         type:String,
//         default:"this is default about us the user!!"
//     },
//     skills:{
//         type:[String],
//     },
// },{
//     timestamps:true
// });

// userSchema.methods.getJWT=async function (){

// const user=this;

//     const token=await jwt.sign({_id:user_id},"3382",{
//         expiresIn:"7d",
//     });
//     return token;
// }


// // const User=mongoose.model("User",userSchema);

// // export default User;

// module.exports=mongoose.model("User",userSchema);


import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import validator from "validator"; // Fixed validator import
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender not valid!");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "this is default about us the user!!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Method to generate JWT
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "3382", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword=async function (passwordInputByUser){
    const user=this;
    const passwordHash=user.password;
    const isPasswordValid=await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );
    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);
export default User;