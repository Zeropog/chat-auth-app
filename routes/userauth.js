import express from 'express';
import authcontroller from '../contollers/handleuserauth.js';

const app=express.Router();

app.post('/login', authcontroller.Login);
app.post('/signup', authcontroller.Signup);
app.post('/logout', authcontroller.Logout);

export default app;