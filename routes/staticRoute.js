import express from 'express';
import authbycookie from '../middleware/authbycookie.js';

const app= express.Router();

app.get('/', function(req, res) {
    return res.render('welcome');
});

app.get('/login', function(req,res) {
    return res.render('login');
});

app.get('/signup', function(req,res) {
    return res.render('signup', {error: null});
});

// app.get('/dashboard', authbycookie,function(req,res) {
//     return res.render('dashboard',{username:"rishab"});
// });

export default app;