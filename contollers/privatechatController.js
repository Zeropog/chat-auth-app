import userschema from '../models/users.js';

class privateRoomController{
    static async loadPrivateRoom(req, res){
        const myusername= req.user?.username;
        const {friendname}= req.params;
        
        try {
            const usercheck= await userschema.findOne({username: myusername});
            if(!usercheck) return res.send('Please log in scammer');

            if(!usercheck.friends.includes(friendname)) return res.send('Not in your friend list: Acess Denied');
            const friendcheck= await userschema.findOne({username:friendname})
            if(!friendcheck) return res.send('user does not exist');


            res.render('privatechats', {
                username: myusername,
                friend: friendname
            });
        } catch (e) {
            console.log(e);
            res.status(500).send('Something went wrong');
        }
    }
}
export default privateRoomController