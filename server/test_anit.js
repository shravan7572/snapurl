const mongoose = require("mongoose");
const MONGO_URI = "mongodb+srv://shravan3107:Izgu7fLqL4QoS38n@cluster0.mridsq3.mongodb.net/snapURl";

async function checkDb() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully.");
    const UserData = mongoose.connection.db.collection("userdatas");
    
    // Find documents containing 'anit' or 'localhost' or '5001'
    const docs = await UserData.find({
      $or: [
        { shorturl: /anit/i },
        { shorturl: /localhost/i },
        { shorturl: /5001/i }
      ]
    }).toArray();
    
    console.log("Found documents:");
    console.log(JSON.stringify(docs, null, 2));
    
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

checkDb();
