const jwt = require('jsonwebtoken')
const JWT_SECRET = "HemantakaFirefist"

const fetchUser = (req,res,next)=>{
    // Get user from jwt token and add id to request object
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({err:" Please authenticate using a valid token."})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        next()
    } catch (error) {
        res.send(401).send({err: "Please authenticate using a valid token"})
    }
}

module.exports = fetchUser