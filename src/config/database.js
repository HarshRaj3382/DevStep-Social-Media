// src/config/database.js
import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(
    // "mongodb+srv://harshjpur41:WhQ2hlPdTwZMQNu9@cluster0.qwj0z8j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    "mongodb://localhost:27017/StepDev"
  );
};

export default connectDB;




//mongodb://localhost:27017/
