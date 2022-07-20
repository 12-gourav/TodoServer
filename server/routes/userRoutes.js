import  express  from "express";
import { addClient, addTask, addWork, forgetpassword, getAllUser, getMyProfile, login, logout, register, removeClient, removeTask, removework, resetpassword, updateClient, updateMyPassword, updateMyProfile, updateTask, updateWork, verify } from "../controller/userController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();


router.route("/register").post(register);
router.route("/verify").post(isAuthenticated,verify)
router.route("/login").post(login);
router.route("/logout").get(logout);

//tasks
router.route("/newtask").post(isAuthenticated,addTask);
router.route("/task/:taskId").delete(isAuthenticated,removeTask);
router.route("/task/:taskId").put(isAuthenticated,updateTask);

//clients
router.route("/newclient").post(isAuthenticated,addClient);
router.route("/client/:clientId").delete(isAuthenticated,removeClient);
router.route("/client/:clientId").put(isAuthenticated,updateClient);
//works
router.route("/newwork").post(isAuthenticated,addWork);
router.route("/work/:clientId").delete(isAuthenticated,removework);
router.route("/work/:clientId").put(isAuthenticated,updateWork);
router.route("/me").get(isAuthenticated,getMyProfile);

router.route("/updateprofile").put(isAuthenticated,updateMyProfile);
router.route("/updatepassword").put(isAuthenticated,updateMyPassword);

router.route("/forgetpassword").post(forgetpassword);
router.route("/resetpassword").put(resetpassword);
 
/// admin routes

router.route("/allUser").get(getAllUser);





export default router;
