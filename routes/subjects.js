const express = require('express')
const fetchUser = require("../middleware/fetchUser");
const Subject = require('../models/Subject');
const { body, validationResult } = require('express-validator');
const fetchTeacher = require('../middleware/fetchTeacher');
const { NotBeforeError } = require('jsonwebtoken');
const router = express.Router()

// Route 1 : GET all the subjects of a student using: GET "/api/subjects/getallsubjects". Login required
router.get('/getallsubjects', fetchUser, async (req, res) => {
    try {
        const subjects = await Subject.find({ students : {$in: req.user.id}})
        console.log(req.user.id)
        res.json(subjects)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }

})

// Route 2 : Add a new subject using: POST "/api/subjects/addsubject". Login required
router.post('/addsubject', fetchTeacher, [
    body('subjectCode', 'Enter a valid email').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { subjectName, courseName, subjectCode, subjectFaculty } = req.body;
        // If there are errors return bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const subject = new Subject({
            subjectName, courseName, subjectCode, subjectFaculty: req.teacher.id, students: ['62591c192ff1f84a013d2d6b','62598d2d757a2d44378aa4aa']
        })
        const newSubject = await subject.save()
        res.json(newSubject)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }

})

// Route 3: Update the subject : PUT "/api/subjects/updatesubject". Login required
router.put('/updatesubject/:id',fetchTeacher,async(req,res)=>{
    const { subjectName, subjectCode } = req.body;
    try {


        // Create a new subject
        const newSubject = {}
        if (subjectName) {
            newSubject.subjectName = subjectName
        }
        if (subjectCode) {
            newSubject.subjectCode = subjectCode
        }
        

        // FInd the subject to be updated and update it
        let subject = await Subject.findById(req.params.id)
        if (!subject) {
            res.status(404).send("Not found")
        }
        if (subject.subjectFaculty.toString() !== req.teacher.id) {
            return res.status(401).send("Not Allowed")
        }

        subject = await Subject.findByIdAndUpdate(req.params.id, { $set: newSubject }, { new: true })
        res.json(subject)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
     
}) 

// Route 4: Delete a subject : DELETE "/api/subjects/deletesubject". Login required
router.delete('/deletesubject/:id',fetchTeacher,async(req,res)=>{
    try {        
        // FInd the subject to be deleted and delete it
        let subject = await Subject.findById(req.params.id)
        if (!subject) {
            res.status(404).send("Not found")
        }
        // Allow deletion only if the faculty owns this subject
        if (subject.subjectFaculty.toString() !== req.teacher.id) {
            return res.status(401).send("Not Allowed")
        }

        subject = await Subject.findByIdAndDelete(req.params.id)
        res.json({"Success":"Subject has been deleted",subject:subject})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
     
}) 
module.exports = router