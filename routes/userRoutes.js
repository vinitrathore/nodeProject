import express from "express"
import { loginController, registerController, userLogout } from "../controller/usercontroller.js";
import { userLoginM, userRegisterM } from "../middleware/userM.js";

const userRouter = express.Router();

userRouter.post("/register",userRegisterM,registerController)
userRouter.post("/login",userLoginM);
userRouter.post("/logout",userLogout);

export default userRouter;