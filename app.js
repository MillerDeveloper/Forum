const express = require('express')
const keys = require('./config/keys')
const passport = require('passport')
const cors = require('cors')
const mongoose = require('mongoose')
const companyRoute = require('./routes/company')
const commentRoute = require('./routes/comment')
const searchRoute = require('./routes/search')
const authRoute = require('./routes/auth') 
const userRoute = require('./routes/user') 
const fileRoute = require('./routes/file') 
const analyticsRoute = require('./routes/analytics')
const verificationRoute = require('./routes/verification')
const fileUpload = require('express-fileupload')
const path = require("path")
const helmet = require("helmet")
const requestIp = require('request-ip')
const compression = require('compression')

const app = express() 

app.set('trust proxy', true) 
 
app.use(helmet({
    contentSecurityPolicy: false,
})) 

app.use(compression({level: 9}))
app.use(requestIp.mw())
app.use(require('morgan')('dev'))
app.use(require('cors')())  
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(cors({ credentials: true, origin: ['http://localhost:80', 'http://localhost:4200', 'http://localhost:4000', 'http://localhost:4201'] }))
express.static(path.join(__dirname, "./uploads"))
express.static(path.join(__dirname, "./config", 'files')) 

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    tempFileDir: 'uploads'
}))

require('./middleware/passport')(passport)

mongoose.connect(keys.mongoURI, {
     useNewUrlParser: true, 
     useUnifiedTopology: true, 
     useCreateIndex: true,
 })
     .then(() => console.log('MongoDB connected'))
     .catch((error) => console.error(error))

// Routes

app.use('/api/companies', companyRoute)
app.use('/api/comments', commentRoute)  
app.use('/api/search', searchRoute)  
app.use('/api/auth', authRoute)  
app.use('/api/user', userRoute)  
app.use('/api/file', fileRoute)  
app.use('/api/verification', verificationRoute)  
app.use('/api/analytics', analyticsRoute)  


module.exports = app 