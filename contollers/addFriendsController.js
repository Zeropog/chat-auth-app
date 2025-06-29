import userschema from '../models/users.js';

class addFriendsController {
    static async addFriends(req, res){
        const {friendusername}= req.body;
        const myusername= req.user?.username;
        if(!myusername || !friendusername) return res.status(400).send('Invalid friend request');
        try {
            const friend= await userschema.findOne({username: friendusername});
            if(!friend) return res.status(400).send("user not found");

            //  Add friend to both users (if not already present) 
             await userschema.updateOne(
                {username: myusername},
                {$addToSet: {friends: friendusername}}
            );
            await userschema.updateOne(
                {username: friendusername},
                {$addToSet: {friends: myusername}}
            );

            return res.status(200).send('added sucessfully');
        } catch (error) {
            console.error(error);
            res.status(404).send('Something went bad. Please try again later');
        }
    }

};

export default addFriendsController;