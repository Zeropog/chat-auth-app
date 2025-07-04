import userschema from '../models/users.js';

class addFriendsController {
    static async addFriends(req, res){
        const {friendusername}= req.body;
        const myusername= req.user?.username;
        if(!myusername) return res.status(404).send('Bad request');
        if(!friendusername) return res.redirect(`/dashboard?error=Please%20provide%20a%20friend%20name`).send('Please provide us the friend name');
        try {
            const friend= await userschema.findOne({username: friendusername});
            if(!friend) return res.status(400).send("user not found");

            //  Add friend to both users (if not already present) 

            const duplicate= await userschema.findOne({username: myusername});
            if(duplicate.friends.includes(friendusername)) {
                return res.send(`${friendusername} already is your friend`);
            }
             await userschema.updateOne(
                {username: myusername},
                {$addToSet: {friends: friendusername}} //If given the friend will be added to the array or not 
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