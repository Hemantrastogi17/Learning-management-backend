const express = require('express')
const router = express.Router()
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');

// Fetch Teacher Details to show in student view : GET /api/auth/fetch-teacherInfo/:id
router.get('/fetch-teacherInfo/:id',async(req,res)=>{
    try {
      teacherId = req.params.id
      const teacher = await Teacher.findById(teacherId).select("-password")
      res.send(teacher)
    } catch (error) {
      console.log(error.message)
        res.status(500).send("Some error occured!")
    }
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  })

// Fetch the seating spaces of all faculties
router.get('/getallfacultyseating',async (req, res) => {
    try {
        const teacher = await Teacher.find().select("-password");
        
        res.send(teacher)
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send("Some error occured!")
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
})

// Fetch faculty id for a particular subject
router.get(('/getfacultyid/:subject',async(req,res)=>{
    try{
        const id = await Subject.findOne(req.params.subject).
        console.log(id.subjectFacultyId)
        res.send(id)
    }
    catch(error){
        console.log(error.message)
        res.status(500).send("Some error occured!")
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
}))
module.exports = router