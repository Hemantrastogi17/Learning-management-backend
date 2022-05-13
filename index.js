const connectToMongo = require('./db')
const express = require('express')
const app = express()
const port = 5000
var cors = require('cors')

app.use(express.json())
app.use(cors())

// Routes available
app.use('/api/auth',require('./routes/auth.js'))
app.use('/api/subjects',require('./routes/subjects.js'))
app.use('/api/faculty',require('./routes/faculty.js'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

connectToMongo()