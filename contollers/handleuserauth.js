import userschema from '../models/users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';
import dotenv from 'dotenv';
import auth from '../services/authcookie.js';

dotenv.config();

class authController{
    static async Login(req, res) {
        const {email, passcode}= req.body;
        if(!email || !passcode) return res.render('login',{error: "PLease enter the valid email/passcode"});
        
        try {
            const userdetails= await userschema.findOne({email});
            if(!userdetails) return res.render('login', {error: "Please enter the valid email address"});

            const matchedpasscode= await bcrypt.compare(passcode, userdetails.passcode);
            if(!matchedpasscode) return res.render('login', {error: "please enter the correct credentials for verification"});

            // Generating the sessionId and sending the uid to the user as a response.
            const sessionId= uuidv4();
            auth.setUserCookie(sessionId, userdetails);
            res.cookie('uid', sessionId);  
        
            const payload= {
            id: userdetails.id,
            name: userdetails.username,
            email: userdetails.email
            }
            //console.log(payload);

            const token=jwt.sign(payload, process.env.secret_key, {expiresIn: "10m"});
        

            res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
            });

            return res.redirect('/dashboard');

        } catch (error) {
            
        }
    } 

    static async Signup(req, res){

        const saltrounds=10;
        const {email, username, passcode} = req.body;
        if(!username || !passcode || !email) return res.render('signup', {error: "Please enter the required fields"});

        const emailregex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailregex.test(email)) return res.render('signup', {error: "Please enter a valid email"});

        const existingemail= await userschema.findOne({email})
        if(existingemail) return res.render('signup', {error: "The email is already registered, please use another email"});

        if(passcode.length<6) return res.render('signup', {error: "passcode length should be greater than 6 characters"});

        try {
            const hashedpasscode= await bcrypt.hash(passcode, saltrounds);
            const userdetails= await userschema.create( {
            username,
            passcode: hashedpasscode,
            email
        });

            const sessionId= uuidv4();
            auth.setUserCookie(sessionId, userdetails);
            res.cookie('uid', sessionId);

            const token=jwt.sign({userId: userdetails._id}, process.env.secret_key, {expiresIn: "10m"});

            res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        });

        return res.status(200).redirect('/dashboard');

    } catch (error) {
        console.log(error);
        res.status(500).send('Bad request. Please try again later');
    }
    }

    static async Logout(req, res) {

        res.clearCookie("token");
        res.clearCookie("uid");
        req.session?.destroy(); // Distroys the express- sessions
        res.redirect('/home/logout');
    }
}

export default authController;