import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    console.log("Request body:", req.body);
    // const { username, email, password } = (req.body.Username,req.body.Email,req.body.Password);
    const username= req.body.Username;
    const email= req.body.Email;
    const password= req.body.Password;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        // Check if password is not empty
        if (!password.trim()) {
            return next(errorHandler(400, 'Password cannot be empty'));
        }

        console.log("Username:", username);
        console.log("Email:", email);

        const hashedPassword = bcryptjs.hashSync(password, 10);
        console.log("Hashed Password:", hashedPassword); // For debugging

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.json('Signup Successful');
    } catch (error) {
        next(error);
    }
};

export const signin= async(req, res, next) => {
    const email= req.body.Email || req.body.email;
    const password= req.body.Password || req.body.password;
    if(!email || !password || email.trim() === '' || password.trim() ===''){
        return next(errorHandler(400, 'All fields are required'));
    }
    try {
        const validUser = await User.findOne({email});
        if(!validUser){
          return next(errorHandler(404, 'User not found'));
        }

        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword){
           return next(errorHandler(400, 'Invalid password'));
        }
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);

        const {password: pass, ...rest}= validUser._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true}).json(rest);
        
    } catch (error) {
        next(error);
    }
}