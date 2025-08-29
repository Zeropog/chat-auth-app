import express from 'express';
import path from 'path';
import staticroutes from './routes/staticRoute.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import getauth from './routes/userauth.js';
import getdashboardroute from './routes/dashboard.js';
import authbycookie from './middleware/authbycookie.js';
import sockethandler from './sockets/messagesocketHandler.js';
import redisclient from './config/redisclient.js';

import cookieParser from 'cookie-parser';
import {Server} from 'socket.io';
import http from 'http';
import messageschema from './models/messagestore.js';

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
app.use('/dashboard', authbycookie, getdashboardroute);

io.on('connection', function(socket) {
    sockethandler(io, socket);
});

mongoose.connect(process.env.MONGODB_URL)
.then(async function() {

    console.log('Database is connected.');
    //await messageschema.deleteMany({});
    //await redisclient.flushall();
    //console.log("The messages are deleted succesfully");

    server.listen(port, function() {
    console.log('server connected');
    });
});
