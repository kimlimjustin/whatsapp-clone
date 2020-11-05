const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    member: {
        type: Array,
    },
    admin: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
})

const Group = mongoose.model("Group", GroupSchema);
module.exports = Group