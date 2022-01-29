const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/employeeRoutes');
require('dotenv').config();
require('./db')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use('/api/employee', employeeRoutes)


app.get('/', (req, res) => {
    res.send("test")
})

const PORT = process.env.PORT || 3000
app.listen(process.env.PORT, (req, res) => {
    console.log(`Database connection established on ${PORT}`)
})
