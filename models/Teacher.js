const mongoose = require('mongoose');
const { Schema } = mongoose;
const TeacherSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true,
        unique: true
    },
    seatingBlock: {
        type: String,
        required: true
    },
    seatingFloor: {
        type: Number,
        required: true
    },
    seatingRoom: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now

    }
});
const Teacher = mongoose.model('teacher', TeacherSchema)
module.exports = Teacher
