const express=require("express");
const mongoose = require("mongoose")
const { nanoid } = require("nanoid")
const UAParser = require("ua-parser-js")
const {Userdatabasemodel}=require("../model/modeldb")
const user_auth=require("../middleware/userauth")
const {analyticsmodel}=require("../model/analytics")
const validurl=require("valid-url")
const QRCode=require("qrcode");

const urlroutes=express.Router();

urlroutes.post("/shorten",user_auth,async (req,res)=>{
    const originalurl=req.body.originalurl;
    const aliasurl=req.body.aliasurl;

    if(!validurl.isUri(originalurl)){
      return res.status(400).json({ message: "Invalid URL! Please enter a valid URL." })
    }

      const existingornot= await Userdatabasemodel.findOne({originalurl:originalurl,userId:req.userId});

        if(existingornot){
          return res.json({
            message:"You already shortened this URL!",
            shorturl:`${process.env.BASE_URL}/${existingornot.shorturl}`
          })
        }

    let shortenurl;
    let aliasmessage=null

    if(aliasurl){
      const existingurl=await Userdatabasemodel.findOne({shorturl:aliasurl});
        if(existingurl){
          shortenurl=nanoid(10);
          aliasmessage=`"${aliasurl} is already taken ! we can auto-generate for you."`
        }else{
          shortenurl=aliasurl
        }
    }else{
      shortenurl=nanoid(10);
    }

    try{
      await Userdatabasemodel.create({
        originalurl:originalurl,
        shorturl:shortenurl,
        userId:req.userId
      })

      const qrCode=await QRCode.toDataURL(`${process.env.BASE_URL}/${shortenurl}`)

      res.json({
         originalurl:originalurl,
        shorturl:`${process.env.BASE_URL}/${shortenurl}`,
        qrCode,
        message:aliasmessage,
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
         if(!findthererender.isActive){
          return res.json({
            message:"the link is disabled!"
          })
        }
        // 4. clicks + 1 → save
        findthererender.clicks +=1
        await findthererender.save()

        //analytics
        const parser=new UAParser(req.headers["user-agent"]);

        const browser =parser.getBrowser().name     ||"unknown";
        const os      = parser.getOS().name       || "Unknown"
        const device  = parser.getDevice().type   || "Desktop"

          // save analytics
          await analyticsmodel.create({
              urlId:     findthererender._id,
              shorturl:  findthererender.shorturl,
              browser,
              os,
              device
          })

      

        // 5. res.redirect to originalUrl
        res.redirect(findthererender.originalurl)

    } catch(e) { 
      res.json({
        message:"unable to redirect to  link"
      })
     }
})

urlroutes.delete("/urls/:id", user_auth, async (req, res) => {
    try {
      const id=req.params.id;
      const url=await Userdatabasemodel.findById(id);

        if(!url){
          return res.status(404).json({
            message:"url not found"
          })
        }

        if(url.userId!==req.userId){
          return res.status(403).json({ message: "Not authorized" })
        }

        await Userdatabasemodel.findByIdAndDelete(id);
        res.json({
          messgae:"url deleted successfully!"
        })
  } catch(e) {
        res.status(500).json({ message: "something went wrong" })
       }
})

urlroutes.patch("/:id/toggle", user_auth, async (req, res) => {
    try {
        const id = req.params.id
        const url = await Userdatabasemodel.findById(id)

        if(!url) return res.status(404).json({ message: "url not found" })

        if(url.userId !== req.userId) return res.status(403).json({ message: "Not authorized" })

        url.isActive = !url.isActive
        await url.save()

        res.json({
            message: `Link ${url.isActive ? "enabled" : "disabled"} successfully!`,
            isActive: url.isActive
        })
    } catch(e) {
        res.status(500).json({ message: "unable to toggle!" })
    }
})


urlroutes.get("/urls/:id/analytics", user_auth, async (req, res) => {
    try {
        const id = req.params.id
      const url=await Userdatabasemodel.findById(id);
      if(!url){return res.status(404).json({messgae:"url not found"})}

        if(url.userId !== req.userId) return res.status(403).json({ message: "Not authorized" })
      
        const findanalytics=await analyticsmodel.find({urlId:id}) 
          res.json({analytics:findanalytics})

    } catch(e) {
        res.status(500).json({ message: "something went wrong" })
    }
})


module.exports= urlroutes
