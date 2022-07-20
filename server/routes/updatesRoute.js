import express from "express";
import { deleteResult, update, updateResult } from "../controller/updatesController.js";


const router = express.Router();


router.post("/updates",update);

router.get("/updatesResult",updateResult);

router.delete("/deleteResult",deleteResult);



export default router;