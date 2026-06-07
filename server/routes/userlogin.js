const express=require("express");
const {z}=require("zod");
const bcrypt=require("bcrypt");
const {loginmodel}=require("../model/modeldb")
const jwt=require("jsonwebtoken");
const JWT_SECRET=process.env.JWT_SECRET
const user_auth=require("../middleware/userauth")

const loginroute=express.Router();

loginroute.post("/sign-up",async function (req,res){
    
        const zodvalidation=z.object({
            firstname:z.string().min(5,{message:"first name must contain atleast 5 charcter"}).max(15,{message:"firstname cannot exceed 15 characters"}),
            lastname: z.string().min(5,{message:"last name must contain atleast 5 charcter"}).max(15,{message:"firstname cannot exceed 15 characters"}),
            email:    z.string().email({message:"invaild email"}).min(5,{message:"email must contain 5 or more charcter"}),
            password: z.string().min(1,{messgae:"password is required"})
        })

        const parsedzod=zodvalidation.safeParse(req.body);
        if(!parsedzod.success){
           return res.json({
                message:"something went wrong!"
                })
        }
    const {firstname,lastname,email,password}=req.body;

    const existinemail=await loginmodel.findOne({email:email})

        if(existinemail){
            res.status(400).json({
                message:"email already exist"
            })
        }
        
    const hashedpassword=await bcrypt.hash(password,8);
    
    try{
    await loginmodel.create({
        firstname:firstname,
        lastname:lastname,
        email:email,
        password:hashedpassword
    })

    res.json({
       message:"sign-up successfully!"
    })
 }catch(e){
        res.status(404).json({
            message:"message cant reach!"
        })
    }  
     
})

loginroute.post("/sign-in",async function(req,res){
    const email=req.body.email;
    const password=req.body.password;

    const finduserdb=await loginmodel.findOne({email:email});

        if(!finduserdb){
            return res.status(404).json({
            message:"user not found"
        })
    }
        const comparepassword=await bcrypt.compare(password,finduserdb.password)

        if(!comparepassword) return res.status(401).json({ message: "Wrong password" })
     
            const token=jwt.sign(
            {  id:finduserdb._id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )
        

        res.json({
            token,
            message:"sign-in successfully!"
        })
  
       
    
})

loginroute.get("/data",user_auth,function(req,res){
    res.json({
        message:"middleware work successfully!"
    })
})


module.exports=loginroute