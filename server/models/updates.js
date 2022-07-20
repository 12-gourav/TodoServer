import mongoose from "mongoose";


const updatesSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    otpExpiary:Date,
});


updatesSchema.index({otpExpiary:1},{expireAfterSeconds:0});




export const Updates = mongoose.model("updates",updatesSchema);