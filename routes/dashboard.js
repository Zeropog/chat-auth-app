import express from 'express';
import addFriendsController from '../contollers/addFriendsController.js';
import userschema from '../models/users.js';
import privatechatController from '../contollers/privatechatController.js';

const app= express.Router();

app.get('/', async function(req, res) {
    try {
        const user= await userschema.findOne({username: req.user.username});
        const friends= user?.friends || [];

        res.render('dashboard', {
            username: user.username,
            friends,
        });

    } catch (error) { 
        console.log(error);
        res.status(500).send("error loading the page");
    }
});
app.post('/add-friend', addFriendsController.addFriends);

app.get('/private/:friendname', privatechatController.loadPrivateRoom);


export default app;
