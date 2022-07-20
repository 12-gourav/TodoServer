import express from "express";
import { config } from "dotenv";
import connection from "./config/connection.js";
import User from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import cors from "cors";
import Updates from "./routes/updatesRoute.js";

config({
    path:"./server/config/config.env",
})

const app = express();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
});
app.use(cors()); // using localhost3000
//database
connection();


const port = process.env.PORT || 5000;


// using terms
app.use(fileUpload({
    limits:{fileSize:50 * 1024 * 1024},
    useTempFiles:true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1",User);

app.use("/api/v1",Updates);







app.get("/",(req,res)=>{
    res.send("server is running Everything is OK Bro");
})





app.listen(port,()=>{
    console.log(`server is listning on ${port}`);
});






