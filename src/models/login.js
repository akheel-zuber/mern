const mongoose = require("mongoose");
const validator = require('validator');


const studentLoginSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Enter a valid Email");
            }
        }
    },
    password:{
        type: String,
        required: true,
        unique: true
    }
})



const Login = new mongoose.model('studentLogin', studentLoginSchema);

module.exports = Login;


