const app=require('./app.js');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const port=8000;
const server=app.listen(port,()=>{
    console.log(`listing to port ${port}`);
}); 
dotenv.config({path:'./config.env'});
const DB=process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD);;
console.log(DB);

mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology: true 
}).then(con=>{
    console.log("DB connection successful");
})
