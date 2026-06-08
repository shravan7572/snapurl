const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const UserData= new Schema({
    isActive:{type:Boolean,default:true},
     userId: { type: String  , required: true },
    originalurl:{ type: String, required: true },
    shorturl:{ type: String, required: true },
    clicks:{ type: Number, default: 0 },
     qrCode:   { type: String, default: null },
    createdon:{ type: Date, default: Date.now }
})

const logindata=new Schema({
    firstname:{type:String,required:true},
    lastname:{type:String},
    email:{type:String,unique:true},
    password:{type:String},
     googleId:  { type: String }       
    
})

const loginmodel=mongoose.model("userlogindata",logindata)
const Userdatabasemodel=mongoose.model("UserData",UserData);

module.exports={Userdatabasemodel,loginmodel};
