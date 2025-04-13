
import express from "express";
import connectDB from "./config/database.js"; // don't forget the `.js` extension in ESM
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());  
app.use(cookieParser());

//import routes
import  authRouter  from "./Routes/auth.js";
import profileRouter from "./Routes/profileRouter.js";
import requestRouter from "./Routes/request.js";

//now use these route
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);


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
