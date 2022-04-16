const jwt = require('jsonwebtoken')
const JWT_SECRET = "HemantakaFirefist"

const fetchTeacher = (req,res,next)=>{
    // Get user from jwt token and add id to request object
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({err:" Please authenticate using a valid token."})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.teacher = data.teacher
        next()
    } catch (error) {
        res.send(401).send({err: "Please authenticate using a valid token"})
    }
}

module.exports = fetchTeacher