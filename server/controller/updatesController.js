import { Updates } from "../models/updates.js";



export const update = async (req,res)=>{
try {
    const {title,description} = req.body;
    const date = new Date();
    var date2 = date.getDate() + 10; // adding 10 days for expiary data
    date.setDate(date2);

 
     
const data = await Updates.create({title,description});
data.otpExpiary = date;
   await  data.save();

    res.status(201).json({message:"Data insertSuccessfully",data});


} catch (error) {
console.log(error);
    res.status(500).json({message:error});
    
}
 
}
export const updateResult = async (req,res)=>{
    try {
        const data = await Updates.find();
    
        res.status(201).json({message:"Data fetch Successfully",data});
    
    
    } catch (error) {
    
        res.status(500).json({message:error.message});
        
    }
     
    }


    export const deleteResult = async (req,res)=>{
        try {
            const {id} = req.params;

       const data = await Updates.deleteOne({id});
        
            res.status(201).json({message:"Data Delete Successfully"});
        
        
        } catch (error) {
        console.log(error);
            res.status(500).json({message:error.message});
            
        }
         
        }