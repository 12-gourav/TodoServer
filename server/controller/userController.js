
import {User} from "../models/users.js";
import { sendMails } from "../utills/sendMail.js";
import { sendToken } from "../utills/sendToken.js";
import cloudinary from "cloudinary";
import fs from "fs";

export const register =  async(req,res) => {
try {

    const {name,email,password} = req.body;

    const avatar = req.files.avatar.tempFilePath;
    console.log(avatar);

    let user = await User.findOne({email});
    if(user)
    {
        return res.status(400).json({success:false,message:"User already Exists"});
    }
const otp = Math.floor(Math.random() * 1000000);
const mycloud = await cloudinary.v2.uploader.upload(avatar,{
    folder:"todoapp"
});
fs.rmSync("./tmp",{recursive:true});

user = await User.create({name
    ,email,
    password,
    avatar:{
    public_id:mycloud.public_id,url:mycloud.secure_url
},
otp
,otp_expiary:new Date(Date.now()+process.env.TIME*60*1000)
});
console.log(email);
await sendMails(email,"Verify your account",`Your OTP is ${otp}`);

sendToken(res,user,201,"OTP sent to your Account,Please Verify your account");




    
} catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message,avatar});
   
}
}

// verify routes

export const verify = async (req,res)=>{
    try {
        const otp = Number(req.body.otp);
        const user = await User.findById(req.user._id);

        if(user.otp !== otp || user.otp_expiary < Date.now()){
            return res.status(400).json({success:false,message:"Invalid OTP "});
        }
user.verified = true;
user.otp = null;
user.otp_expiary = null;
await user.save();

sendToken(res,user,200,"Account verified");



    } catch (error) {
         console.log(error);
    res.status(500).json({success:false,message:error.message});
    }

}

//login


export const login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email}).select("+password");

if(!email || !password){
    return res.status(400).json({success:false,message:"Plz fill all the fields"});
}


        if(!user){
return res.status(400).json({success:false,message:"User does not exists"});
        }

const isMatch = await user.comparePassword(password);
if(!isMatch){
    return res.status(400).json({success:false,message:"Invalid Credentials"});
}

        sendToken(res,user,200,"Login Successfull");
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});
    }
}



//logout


export const logout = async (req,res)=>{
    try {
       res.status(200).cookie("token",null,{
        expires:new Date(Date.now()),
       }).json({success:true,message:"Logout Successfully"});

        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});
    }
}

//// adding Tasks functionallity

export const addTask = async (req,res) =>{
    try {
const {title,description} = req.body;

const user = await User.findById(req.user._id);
user.tasks.push({title,description,completed:false,createdAt:new Date(Date.now())});

await user.save();
res.status(200).json({success:true,message:"Task added successfully"});
  
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});
    }
}

//// remove Tasks functionallity

export const removeTask = async (req,res) =>{
    try {
const {taskId} = req.params;

const user = await User.findById(req.user._id);
user.tasks = user.tasks.filter(task => task._id.toString() !== taskId.toString());

await user.save();

res.status(200).json({success:true,message:"Task removed successfully"});
  
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});
    }
}

//// Update Tasks functionallity

export const updateTask = async (req,res) =>{
    try {
        const {taskId} = req.params;

const user = await User.findById(req.user._id);

const task =  await user.tasks.find((task)=> task._id.toString() === taskId.toString());

task.completed = !task.completed;


await user.save();
res.status(200).json({success:true,message:"Task updated successfully"});
  
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});
    }
}

/// get my user profile

export const getMyProfile = async (req,res)=>{
    try {

        const user = await User.findById(req.user._id);
        console.log(user);
        sendToken(res,user,201,`welcome ${user.name}`);

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});
    }

    
}



// update my Profile

export const updateMyProfile = async (req,res)=>{
    try {

        const user = await User.findById(req.user._id);
        const {name} = req.body;
        const avatar = req.files.avatar.tempFilePath;

       console.log(avatar);

        if(name) user.name = name;
        if(avatar){
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
            
            const mycloud = await cloudinary.v2.uploader.upload(avatar,{
                folder:"todoapp"
            });
            fs.rmSync("./tmp",{recursive:true});
            user.avatar = {
                public_id:mycloud.public_id,
                url:mycloud.secure_url,
            }
        }
        await user.save();

       res.status(200).json({success:true,message:"Profile Update Successfully"});



    } catch (error) {
        
        console.log(error);
        res.status(500).json({success:false,message:error.message});
    }

    
}

// update password
export const updateMyPassword = async (req,res)=>{
try {
    const user = await User.findById(req.user._id).select("+password");

const {oldPassword,newPassword,confirmPassword} = req.body;

if(newPassword !== confirmPassword){
    return res.status(400).json({success:false,message:"newpassword and confirm password not same"});
}
const isMatch = await user.comparePassword(oldPassword);
if(!isMatch){
    return res.status(400).json({success:false,message:"Invalid old Password"});
}
user.password = newPassword;
await user.save();
res.status(200).json({success:true,message:"Password Update Successfully"});

    
} catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
}

}


//ForgetPassword

export const forgetpassword = async (req,res)=>{
   try {
    const {email} = req.body;
    if(!email){
        return res.status(400).json({success:false,message:"Invalid Email"});
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({success:false,message:"User Does not Exists"});
    }
    const otp = Math.floor(Math.random() * 1000000);
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiary = Date.now() + 10 * 60 * 1000; //1hr

    await user.save();

    await sendMails(email,"Request To Reset password",`Your OTP is ${otp}`);
    
    res.status(200).json({success:true,message:`OTP sent to ${email}`});

    
   } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
   }

}
//ResetPassword

export const resetpassword = async (req,res)=>{
    try {
     const {otp,newPassword} = req.body;
     if(!otp){
         return res.status(400).json({success:false,message:"plz enter Valid Otp"});
     }
     const user = await User.findOne({resetPasswordOtp:otp,resetPasswordOtpExpiary:{$gt:Date.now()}});

     if(!user){
         return res.status(400).json({success:false,message:"OTP has been Expired"});
     }
    
     user.resetPasswordOtp = null;
     user.resetPasswordOtpExpiary = null;//1hr
     user.password = newPassword;
 
     await user.save();
 
     
     
     res.status(200).json({success:true,message:"Password Update successfully"});
 
     
    } catch (error) {
     console.log(error);
     res.status(500).json({success:false,message:error.message});
    }
 
 }
 

 //// adding Client functionallity

export const addClient = async (req,res) =>{
    try {
const {title,description} = req.body;

const user = await User.findById(req.user._id);
user.client.push({title,description,completed:false,createdAt:new Date(Date.now())});

await user.save();
res.status(200).json({success:true,message:"Client added successfully"});
  
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});
    }
}

//// remove Tasks functionallity

export const removeClient = async (req,res) =>{
    try {
const {clientId} = req.params;

const user = await User.findById(req.user._id);
user.client = user.client.filter(client => client._id.toString() !== clientId.toString());

await user.save();

res.status(200).json({success:true,message:"Client removed successfully"});
  
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});
    }
}

//// Update Tasks functionallity

export const updateClient = async (req,res) =>{
    try {
        const {clientId} = req.params;

const user = await User.findById(req.user._id);
console.log(user);
const client =  await user.client.find((client)=> client._id.toString() === clientId.toString());
console.log(client);
client.completed = !client.completed;


await user.save();
res.status(200).json({success:true,message:"Task updated successfully"});
  
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});
    }
}


//// adding work functionallity

export const addWork = async (req,res) =>{
    try {
const {title,description} = req.body;

const user = await User.findById(req.user._id);
user.work.push({title,description,completed:false,createdAt:new Date(Date.now())});

await user.save();
res.status(200).json({success:true,message:"Work added successfully"});
  
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});
    }
}

//// remove Tasks functionallity

export const removework = async (req,res) =>{
    try {
const {clientId} = req.params;

const user = await User.findById(req.user._id);
user.work = user.work.filter(client => client._id.toString() !== clientId.toString());

await user.save();

res.status(200).json({success:true,message:"Work removed successfully"});
  
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});
    }
}

//// Update Tasks functionallity

export const updateWork = async (req,res) =>{
    try {
        const {clientId} = req.params;

const user = await User.findById(req.user._id);

const work =  await user.work.find((client)=> client._id.toString() === clientId.toString());

work.completed = !work.completed;


await user.save();
res.status(200).json({success:true,message:"Work updated successfully"});
  
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});
    }
}


/// admin roles are used

export const getAllUser = async ( req,res) =>{
try {
    
const data = await User.find({verified:true});

res.status(200).json({success:true,message:"user list",data});


} catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:"user List Not avaliable"});
}


}
