import userschema from '../models/users.js';
import messageschema from '../models/messagestore.js';
import redisclient from '../config/redisclient.js';

class privateRoomController{
    static async loadPrivateRoom(req, res){
        const myusername= req.user?.username;
        const {friendname}= req.params;
        
        try {
            const usercheck= await userschema.findOne({username: myusername});
            if(!usercheck) return res.send('Please log in scammer'); //Trying to use the routes from the term

            if(!usercheck.friends.includes(friendname)) return res.send('Not in your friend list: Acess Denied'); // To check if the person is friend or the one who is requesting a private room chat
            const friendcheck= await userschema.findOne({username:friendname}) // To check if the friend name exist in the DB
            if(!friendcheck) return res.send('user does not exist');

            const roomname=[myusername, friendname].sort().join('-');
    
            let messages=[];
            const redisMessage= await redisclient.lrange(roomname,0,-1);
            if(redisMessage.length > 0){
                messages= redisMessage.map(msg => JSON.parse(msg));
            }
            else{
                messages= await messageschema.find({room: roomname}).sort({timestamp:1});
                //Caching in the redis after taking from the DB
                 if (messages.length > 0) {
                    const toCache = messages.map(msg => JSON.stringify(msg));
                    await redisclient.rpush(roomname, ...toCache);
                    await redisclient.ltrim(roomname, -100, -1); //LRU Eviction to store last 100 messages
                }
            }

            res.render('privatechats', {
                username: myusername,
                friend: friendname,
                messages
            });
        } catch (e) {
            console.log(e);
            res.status(500).send('Something went wrong');
        }
    }
}
export default privateRoomController