const express=require('express');
const helmet=require('helmet');
const rateLimter=require('express-rate-limit');
const mongoSanitize=require('express-mongo-sanitize');
const moviesRoute=require('./routes/movieRoute');
const xss=require('xss-clean');
const hpp=require('hpp');
const cors=require('cors');

const app=express();
app.use(cors());
app.use(helmet());
const limiter=rateLimter({
    max:100,
    windowMs:60*60*1000,
    message:'to many requests from this IP address plz try after a hour'
});
//limiting number of requests from a IP address
app.use('/v1',limiter);
//Data sanitization aganist NoSql injection
app.use(mongoSanitize());
//Data Sanitization against cross-site-scripting
app.use(xss());
//preventing parameter pollution
app.use(hpp());





app.use(express.json());
app.use('/v1/moivesDB',moviesRoute);


module.exports=app;