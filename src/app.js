import express from "express";

const app=express();


app.use('/home',(req,res)=>{
     res.send("hello from serverer");
})

app.listen(3000,()=>{
    console.log("Server is running on 3000....")
});