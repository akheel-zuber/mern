const mongoose = require("mongoose");

try{
    mongoose.connect("mongodb://localhost:27017/Registration");
}catch(err){
    console.log(err);
}
