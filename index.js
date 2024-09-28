import express from "express";
import 'dotenv/config'
const port = process.env.PORT || "4000";
import userRouter from "./routes/userRoutes.js";
import multer from "multer";
import cors from "cors"
import cookieParser from "cookie-parser";
import con from "./utils/mysqlDb.js";
import adminRouter from "./routes/adminRouts.js";
const upload = multer()
const app = express();
app.use(express.json());
app.use(cors({
  credentials:true,
  origin:"http://localhost:5173",
}));
app.use((err,req,res,next)=>{
  if(err instanceof SyntaxError && err.status === 400 && 'body' in err){
    console.log("Invalid JSON recieved:",err.message);
    return res.status(400).json({error:'Invalid JSON format'})
  }
  next(err);
})
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use(cookieParser());

app.use("/API/user",upload.none(),userRouter)
app.use("/API/admin",upload.none(),adminRouter)

app.listen(port,()=>{
  console.log(`server is running on port ${port}`);
})