const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "HemantakaFirefist"
var fetchUser = require('../middleware/fetchUser') 

// Create a user using: POST "api/auth/createuser" : Doesn;t rqequire authentication
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



// Login a registered user : POST /api/auth/login :Login required
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




// Get loggedin user details: POST /api/auth/fetchuser. Login required 
router.post('/fetchUser',fetchUser,async(req, res)=>{
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


module.exports = router