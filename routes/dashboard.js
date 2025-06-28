import express from 'express';

const app= express.Router();

app.get('/', function(req, res) {
    res.render('dashboard', {
        username: req.user.username
    });
});

export default app;
