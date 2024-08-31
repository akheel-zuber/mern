require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const auth = require('./middleware/auth')
require('./db/conn');
const staticPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials')
const Login = require('./models/login');
const Register = require('./models/register');
const { register } = require("module");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { type } = require("os");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;

app.set("view engine", "hbs");
app.set('views', viewsPath);
app.use(express.json());
app.use(cookieParser());
// app.use(auth);  // Apply globally
app.use(express.urlencoded({extended: true}));




hbs.registerPartials(partialsPath);


app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');  //Not to load pages from cache
    next();
});



app.get("/", auth, (req, res)=>{
    if (req.user) {
        return res.render('index', { msg: `Happy to have you on board ${req.user.firstName}`, user:JSON.stringify(req.user) });
    }
    res.render('index', { msg: "Service Beyond Expectations" });
})

app.get("/login", (req, res) => {
    if (req.user) {
        // console.log("gggggggg")
        // Redirect to dashboard or other authenticated route.
        return res.redirect('/dashboard');
    }
    // Otherwise, render the login page.
    const message = req.query.message;
    res.render("login", { message });
});


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


app.post('/login', async(req, res)=>{
    try{
        // console.log("Login request received:", req.body);
        const user = await Register.findOne({email: req.body.email});
        const password = req.body.password
        if(!user){
            res.status(400).send("Invalid Login details");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            // console.log("Password mismatch");
            res.status(400).send("Invalid Login details");
        }
        const token = await user.generateAuthToken();
        // console.log("Generated token:", token);
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
            // secure: true
        })
        res.redirect('/dashboard')
        
        }catch(err){
            console.log(err.message);
            res.status(500).send("Server error");
        }
})

app.get('/dashboard', auth, (req, res)=>{
    res.render("dashboard", {user: req.user})
})

app.get("/logout", auth, async(req, res)=>{
    try{
        res.clearCookie("jwt");
        await req.user.save();
        res.render("login");
    }catch(err){
        res.status(401).send(err)
    }
})

app.use(express.static(staticPath));
app.listen(port);




// const token = await jwt.sign({_id: }, "mynameiszuber")

// const verified = await jwt.verify(token, "mynameiszuber")


