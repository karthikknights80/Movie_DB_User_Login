const { model } = require('mongoose');
const nodemailer= require('nodemailer');
const sendEmail=async (options)=>{
    const trasnporter=nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions={
        from :"karthik <karthik@gmail.com>",
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    await trasnporter.sendMail(mailOptions);
};

module.exports=sendEmail;