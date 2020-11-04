const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        required: true
    },
    recipient: {
        type: Schema.Types.ObjectId,
        required: true
    },
    iv: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;