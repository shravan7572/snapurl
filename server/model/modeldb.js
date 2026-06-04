const mongoose=require("mongoose");
const { string } = require("zod");
const Schema=mongoose.Schema;

const UserData= new Schema({
    originalurl:{ type: String, required: true },
    shorturl:{ type: String, required: true },
    clicks:{ type: Number, default: 0 },
    createdon:{ type: Date, default: Date.now }
})

const logindata=new Schema({
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    email:{type:String,unquie:true},
    password:{type:String},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "loginmodel", required: true }
})

const loginmodel=mongoose.model("userlogindata",logindata)
const Userdatabasemodel=mongoose.model("UserData",UserData);

module.exports={Userdatabasemodel,loginmodel};
