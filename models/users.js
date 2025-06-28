import mongoose from 'mongoose';

const userSchema= new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    passcode: {
        type: String,
        required:true,
    },
    email: {
        type:String,
        unique: true,
        required: true
    },
    friends: {
        type:[String],
        default:[]
    },
},
    {timestamps: true}
);

const Users = mongoose.model('userSchema', userSchema);

export default Users;
