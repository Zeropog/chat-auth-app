import messageschema from '../models/messagestore.js';
import redisclient from '../config/redisclient.js';

class messageController{
    static async saveMessageToDB({from, to, message, room}) {
        try {
            await messageschema.create({from, to, message, room});
        } catch (error) {
            console.log(error);
        }
    }

    static async saveMessageToCache({from, to, message, room}){
        const messageData= JSON.stringify({
            from,
            to,
            message,
            timestamp: Date.now()
        });

        try {

            await redisclient.rpush(room, messageData);
            
        } catch (error) {
            console.log('redis error ->s',error);
        }
    }
}


export default messageController;