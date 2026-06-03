const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const UserData= new Schema({
    originalurl:{ type: String, required: true },
    shorturl:{ type: String, required: true },
    clicks:{ type: Number, default: 0 },
    createdon:{ type: Date, default: Date.now }
})

const Userdatabasemodel=mongoose.model("UserData",UserData);

module.exports=Userdatabasemodel
