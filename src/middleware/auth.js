const Register = require('../models/register');
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {

        res.set('Cache-Control', 'no-store');
        // Retrieve token from cookies
        const token = req.cookies.jwt;
        // console.log("Token from cookies:", token);

        if (!token) {
            return res.redirect('/login?message=Please login to continue');
        }

        // Verify the token
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log("Verified user:", verifyUser);

        // Fetch user from the database
        const user = await Register.findOne({ _id: verifyUser._id },{_id:0});
        console.log("User from database:", user);

        if (!user) {
            return res.redirect('/login?message=Please login to continue');
        }

        // Attach user and token to request object

        req.user = user;
        req.token = token;

        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Authentication error:", error);
        res.redirect('/login?message=Please login to continue');
    }
}

module.exports = auth;
