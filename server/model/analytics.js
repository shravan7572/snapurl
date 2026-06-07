const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const analyticsdatabase=new Schema({
urlId     : {type: String, required:true}, 
shorturl  : {type: String, required:true},   
browser   : {type: String, default :"unknown"},
os        : {type: String, default :"Unknown"},
device    : {type: String, default: "Desktop"},
clickedAt :{type: Date, default :Date.now}
})

const analyticsmodel=mongoose.model("analyticsmodel",analyticsdatabase)

module.exports={analyticsmodel};
