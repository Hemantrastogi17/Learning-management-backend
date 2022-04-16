const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Teacher = require('../models/Teacher');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "HemantakaFirefist"
const fetchUser = require('../middleware/fetchUser'); 
const fetchTeacher = require('../middleware/fetchTeacher');

//  Create a teacher account using: POST "api/auth/teacher" : Doesn't rqequire authentication
router.post('/teacher',[
  body('name','Name must contain atleast 3 characters').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be contain 8 characters').isLength({ min: 8 })  
],async(req,res)=>{
  let ipV4 = req.connection.remoteAddress.replace(/^.*:/, '');
  if(( ipV4 === 'localhost' ||  ipV4 === '127.0.0.1')){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
      const salt = await bcrypt.genSalt(10)
      const secPass = await bcrypt.hash(req.body.password,salt)
      let teacher = await Teacher.findOne({email: req.body.email})
      if(teacher){
        return res.status(400).json({err:"Sorry a user with this email already exists"})
      }
      teacher =await Teacher.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        role: 'teacher'
      })
      const data = {
        teacher: {
          id: teacher.id
        }
      }
      const jwtToken = jwt.sign(data,JWT_SECRET)
      res.json({jwtToken})
      
    }
    catch(err){
      console.log(err.message)
      res.status(500).send("Some error occured!")
    }
  }
  else{
    res.status(403).json({err: "Forbidden"})
  }
  
})

// Create a user using: POST "api/auth/createuser" : Doesn't rqequire authentication
router.post('/signup',[
    body('name','Name must contain atleast 3 characters').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be contain 8 characters').isLength({ min: 8 })
],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{
      const salt = await bcrypt.genSalt(10)
      const secPass = await bcrypt.hash(req.body.password,salt)
      let user = await User.findOne({email: req.body.email})
      if(user){
        return res.status(400).json({err:"Sorry a user with this email already exists"})
      }
      user =await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        role: 'student'
      })
      const data = {
        user: {
          id: user.id
        }
      }
      const jwtToken = jwt.sign(data,JWT_SECRET)
      res.json({jwtToken})
      
    }
    catch(err){
      console.log(err.message)
      res.status(500).send("Some error occured!")
    }
    
})



// Login a registered student : POST /api/auth/login :Login required
router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','Password cannot be blank').exists()
],async (req,res) =>{

  const {email,password} = req.body
  try {
    let user = await User.findOne({email})
    if(!user){
      return res.status(400).json({err: 'Incorrect credentials'})
    }
    let passwordCompare = await bcrypt.compare(password,user.password)
    if(!passwordCompare){
      return res.status(400).json({err: 'Incorrect credentials'})
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const jwtToken = jwt.sign(data,JWT_SECRET)
    res.json({jwtToken})

  } catch (error) {
    console.log(error.message)
      res.status(500).send("Some error occured!")
  }

  // If there are errors return bad request and the errors
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
})


// Login a registered teacher : POST /api/auth/teacher-login :Login required
router.post('/teacher-login',[
  body('email','Enter a valid email').isEmail(),
  body('password','Password cannot be blank').exists()
],async (req,res) =>{
  const {email,password} = req.body
  try {
    let teacher = await Teacher.findOne({email})
    if(!teacher){
      return res.status(400).json({err: 'Incorrect credentials'})
    }
    let passwordCompare = await bcrypt.compare(password,teacher.password)
    if(!passwordCompare){
      return res.status(400).json({err: 'Incorrect credentials'})
    }
    const data = {
      teacher: {
        id: teacher.id
      }
    }
    const jwtToken = jwt.sign(data,JWT_SECRET)
    res.json({jwtToken})

  } catch (error) {
    console.log(error.message)
      res.status(500).send("Some error occured!")
  }

  // If there are errors return bad request and the errors
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
})


// Get loggedin student details: GET /api/auth/fetchuser. Login required 
router.get('/fetchUser',fetchUser,async(req, res)=>{
  try {
    userId = req.user.id
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.log(error.message)
      res.status(500).send("Some error occured!")
  }
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
})

// Get loggedin teacher details: GET /api/auth/fetch-teacher. Login required 
router.get('/fetch-teacher',fetchTeacher,async(req, res)=>{
  try {
    teacherId = req.teacher.id
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

module.exports = router