//const { log } = require('console');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// desc Register a new user
// route POST /api/users/register   
// access Public

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;


    // Validate user input
    if (!username || !email || !password) {
        res.status(400);
        throw new Error('Please fill in all fields');
    }

   const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
     console.log("Hashed Password", hashedPassword);

     const user = await User.create({
        username,
        email,
        password: hashedPassword,   
     });

     console.log(`User created: ${user}`);

     if(user){
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
        });
     }
     else {
        res.status(400);
        throw new Error('Invalid user data');
        }
});

// desc Login a user
// route POST /api/users/login  
// access Public
const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    // Validate user input
    if (!email || !password) {  
        res.status(400);
        throw new Error('Please fill in all fields');
    }

    const user = await User.findOne({ email });
    // compare password with hashed password
    if(user && (await bcrypt.compare(password, user.password))) {
       const accessToken = jwt.sign({
        user: {
            username: user.username,
            email: user.email,
            id: user.id
        },
       }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'}
       );
            
       res.status(200).json({accessToken});
    }
    else {
        res.status(401);
        throw new Error('Email or password is incorrect');
    }   
});

// desc Get user profile
// route GET /api/users/profile     
// access Private
const getUserProfile = asyncHandler(async (req, res) => {
    res.json(req.user);
}   );


module.exports = {
    registerUser,  loginUser, getUserProfile
};