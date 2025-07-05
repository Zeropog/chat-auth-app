import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required:true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    room: {
        type: String,
        required: true
    }
});

const messageschema= mongoose.model('privateMessages', messageSchema);

export default messageschema;