const mongoose = require("mongoose");

try{
    mongoose.connect(process.env.MONGO);
}catch(err){
    console.log(err);
}
