const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken'); 

const studentRegisterSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
        },
    lastName:{
        type: String,
        required: true
        },
    birthday:{
        type: Date,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
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
    phone:{
        type: Number,
        unique: true,
        validate: {
            validator: function(v){
                return /\d{10}/.test(v)
            },
            message: props=>`${props.value} is not a valid phone number!`
        }
    },
    password:{
        type: String,
        required: true
    }, 
    branch:{
        type: String,
        required: true
    }
})

studentRegisterSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY, { expiresIn: '1h' });
        console.log("Token generated:", token);
        return token;
    } catch (err) {
        console.error('Error generating token:', err);
        throw new Error('Token generation failed');
    }
}

studentRegisterSchema.pre("save", async function(next){;
    if (this.isModified("password")){
        // console.log(`The current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        // console.log(`The current password is ${this.password}`);
        next();
    }
})

const Register = new mongoose.model('studentRegister', studentRegisterSchema);

module.exports = Register;

// schema.methods on an individual document.
// schema.instances on whole model itself.