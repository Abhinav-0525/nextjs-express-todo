let express = require('express')
let adminApp = express.Router()

adminApp.get('/login',(req, res)=>{
    res.send('Login here')
})

module.exports =  adminApp;