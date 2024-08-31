require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
require('./db/conn');
const staticPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials')
const Login = require('./models/login');
const Register = require('./models/register');
const { register } = require("module");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const { type } = require("os");
const port = process.env.PORT || 3000;

app.set("view engine", "hbs");
app.set('views', viewsPath);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

hbs.registerPartials(partialsPath);

app.get("/", (req, res)=>{
    res.render("index");
})

app.get("/login", (req, res)=>{
    res.render("login");
})

app.get("/register", (req, res)=>{
    res.render("register");
})



app.post("/register", async(req, res)=>{
    try{
       const registeredStudent = new Register({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        birthday: req.body.dob,
        gender: req.body.gender,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        branch: req.body.branch
       })

    
       const registered = await registeredStudent.save();
       res.status(201).redirect('/login?status=success');
    }catch(err){
        res.status(400).send(err)
    }
})

console.log(process.env.SECRET_KEY);
app.post('/login', async(req, res)=>{
    try{
        console.log("Login request received:", req.body);
        const user = await Register.findOne({email: req.body.email});
        const password = req.body.password
        if(!user){
            res.status(400).send("Invalid Login details");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            console.log("Password mismatch");
            res.status(400).send("Invalid Login details");
        }
        const token = await user.generateAuthToken();
        console.log("Generated token:", token);
        res.redirect('/')
        
        }catch(err){
            console.log(err.message());
            res.status(500).send("Server error");
        }
})

app.use(express.static(staticPath));
app.listen(port);




// const token = await jwt.sign({_id: }, "mynameiszuber")

// const verified = await jwt.verify(token, "mynameiszuber")
// tokens: [{
//     token: {
//         type: String,
//         required: true
//     }
// }]

// this.tokens = this.tokens.concat({token});