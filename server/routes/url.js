const express=require("express");
const { nanoid } = require("nanoid")
const Userdatabasemodel=require("../model/modeldb")
const user_auth=require("../middleware/userauth")

const urlroutes=express.Router();

urlroutes.post("/shorten",user_auth,async (req,res)=>{
    const originalurl=req.body.originalurl;

    try{
      const shortenurl=nanoid(7);
      await Userdatabasemodel.create({
        originalurl:originalurl,
        shorturl:shortenurl
      })

      res.json({
         originalurl:originalurl,
        shorturl:`${process.env.BASE_URL}/${shortenurl}`,
        userId:req.userId
      })
    }catch(e){
      res.status(500).json({message:"something went wrong"})
    }
})

urlroutes.get("/urls", user_auth,async (req,res)=>{
    try{

      const getallurls=await Userdatabasemodel.find({userId:req.userId});

      res.json({
       getallurls
      })

    }catch(e){
      res.json({
        message:"something went wrong!unable to fetch data."
      })
    }
})  

urlroutes.get("/:shorturl", async (req, res) => {
    try {
        // 1. get shortCode from req.params
      const shorturl=req.params.shorturl;
        // 2. findOne in MongoDB matching that shortCode

        const findthererender=await Userdatabasemodel.findOne({shorturl:shorturl})

        // 3. if not found → res.status(404
        if(!findthererender){
         return res.status(404).json({
            message:"there's no shorturl."
          })
        }
        // 4. clicks + 1 → save
        findthererender.clicks +=1
        await findthererender.save()

        // 5. res.redirect to originalUrl
        res.redirect(findthererender.originalurl)

    } catch(e) { 
      res.json({
        message:"unable to redirect to  link"
      })
     }
})

module.exports= urlroutes
