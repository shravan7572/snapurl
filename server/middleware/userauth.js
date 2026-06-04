const jwt=require("jsonwebtoken");
const JWT_SECRET=process.env.JWT_SECRET;

function user_auth(req,res,next){
    const token = req.headers.token;

    if(!token){
       return res.json({
            message:"token not provided !"
        })
    }

    try{
        const user_check=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=user_check.id;
        next();
    }catch(e){
        res.json("invaild token")
    }
}
module.exports=user_auth