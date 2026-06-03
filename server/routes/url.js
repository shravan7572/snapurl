const express=require("express");
const { nanoid } = require("nanoid")
const Userdatabasemodel=require("../model/modeldb")

const urlroutes=express.Router();

urlroutes.post("/shorten",async (req,res)=>{
    const originalurl=req.body.originalurl;

    try{
      const shortenurl=nanoid(7);
      await Userdatabasemodel.create({
        originalurl:originalurl,
        shorturl:shortenurl
      })

      res.json({
         originalurl:originalurl,
        shorturl:`${process.env.BASE_URL}/${shortenurl}`
      })
    }catch(e){
      res.status(500).json({message:"something went wrong"})
    }
})

module.exports= urlroutes
