import mongoose from "mongoose";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        select:false,
        minlength:[8,"minimum length of password should be 8"],

    },
    avatar:{
public_id:String,
url:String,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    tasks:[{
        title:"String",
        description:"String",
        createdAt:Date,
        completed:Boolean,
    }],
    client:[{
        title:"String",
        description:"String",
        createdAt:Date,
        completed:Boolean,
    }],
    work:[{
        title:"String",
        description:"String",
        createdAt:Date,
        completed:Boolean,
    }],
    verified:{
        type:Boolean,
        default:false
    },
    otp:Number,
    otp_expiary:Date,
    resetPasswordOtp:Number,
    resetPasswordOtpExpiary:Date,
});


userSchema.pre("save",async function(next){
if(!this.isModified("password")){
    return next();
}

const salt = await bcrypt.genSalt(10);
const hashPassword = await bcrypt.hash(this.password,salt);
this.password = hashPassword;
next();
})


userSchema.methods.getJWTToken = function(){
return JWT.sign({_id:this._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRE*24*60*60*1000,
})
}
userSchema.methods.comparePassword = async function(password){
   return await bcrypt.compare(password,this.password);
}
// delete user after a specefic time if otp expire before verify
userSchema.index({otp_expiary:1},{expireAfterSeconds:0});






























export const User = mongoose.model("User",userSchema);