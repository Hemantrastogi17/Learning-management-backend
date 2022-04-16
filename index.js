const connectToMongo = require('./db')
const express = require('express')
const app = express()
const port = 5000

app.use(express.json())

// Routes available
app.use('/api/auth',require('./routes/auth.js'))
app.use('/api/subjects',require('./routes/subjects.js'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

connectToMongo()