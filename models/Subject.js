const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubjectSchema = new Schema({
    students:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user',
        validate: v => Array.isArray(v) && v.length > 0
    },
    subjectName :{
        type:String,
        required: true,
    },
    courseName : {
        type: String,
        required: true
    },
    subjectCode: {
        type: String,
        unique: true,
        required: true,
    },
    subjectFaculty:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
        required : true
    }
})
const Subject = mongoose.model('subject',SubjectSchema)
module.exports = Subject