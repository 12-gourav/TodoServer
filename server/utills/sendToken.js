export const sendToken = (res,user,statusCode,message) =>{

    const token = user.getJWTToken();
    const userData = {
        _id:user._id,
        name:user.name,
        email:user.email,
        avatar:user.avatar,
        tasks:user.tasks,
        verified:user.verified,
        client:user.client,
        work:user.work,
        createdAt:user.createdAt
    }

    res.status(statusCode).cookie("token",token,{
        httpOnly:true,
        expires:new Date(Date.now()+process.env.JWT_EXPIRE*24*60*60*1000),
    }).json({success:true,message,user:userData});
}