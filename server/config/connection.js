import mongoose from "mongoose";

const connection = async ()=>{
    try{

const {connection} = await mongoose.connect(process.env.DB); 

console.log("connection successfully");

    }catch(error){
console.log(error);
    }
}


export default connection;