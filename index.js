import express from 'express';
import path from 'path';
import staticroutes from './routes/staticRoute.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import getauth from './routes/userauth.js';
import getdashboardroute from './routes/dashboard.js';
import authbycookie from './middleware/authbycookie.js';
import cookieParser from 'cookie-parser';
import {Server} from 'socket.io';
import http from 'http';

dotenv.config();


const app=express();
const server= http.createServer(app);
const io= new Server(server);
const port=4000;

app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));


app.use('/welcome', staticroutes);
app.use('/auth', getauth);
app.use('/dashboard', authbycookie,getdashboardroute);

io.on('connection', function(socket) {
    console.log("New user is connected to the server", socket.id);

    socket.on('chat-message', function(data){
        io.emit('chat-message', data);
    });
    socket.on('disconnect', function(){
        console.log("User is disconnected", socket.id);
    });
});

mongoose.connect(process.env.MONGODB_URL)
.then(function () {
    console.log('Database is connected.');
    server.listen(port, function() {
    console.log('server connected');
    });
});
