import express from "express";
import { isAdmin, isSameAdmin } from "../middleware/adminGetM.js";
import { alluser, deleteUser } from "../controller/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/getuser",isAdmin,alluser)

adminRouter.delete("/delete",isAdmin,isSameAdmin,deleteUser)

export default adminRouter;
