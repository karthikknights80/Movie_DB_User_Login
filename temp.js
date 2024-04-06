const { model } = require('mongoose');
const {promisify} =require('util');
const User=require('./models/userModel');
const jwt=require('jsonwebtoken');
const { use } = require('./routes/movieRoute');
const sendEmail=require('./email');
const crypto=require('crypto');
const { chownSync } = require('fs');
const { BatchType } = require('mongodb');
const filter_fun=(obj,...arr)=>
{
    let filtered_obj;
    Object.keys(obj).forEach(el=>{
        if(arr.includes(el))filtered_obj[el]=obj[el];
    })
    return filtered_obj;
}
const createSendToken=(user,statusCode,res)=>{
    // console.log(res)
    const token=signtoken(user._id);
    const cookieOptions={
        expires:new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    res.cookie('jwt',token,cookieOptions);
    console.log(res)
    user.password=undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
          user
        }
      });
}
exports.signUp= async (req,res,next)=>{
    try{
        console.log(req.body);
       
    const newUser=await User.create(req.body);
        console.log(newUser);
        res.status(200).json({
            status:'success',
            newUser
        })
        next();
}catch(err)
{
    res.status(400).json({
        status:'failed',
        err
    })
}
}
const signtoken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}
exports.login=async (req,res,next)=>{

   try{ 
    console.log('kajsa: ');
    console.log(req.body);
            const {email,password}=req.body;
        if(!email | !password){
            
            throw new Error('please mention both email and password');
        }
       
            const user=await User.findOne({email:email}).select('+password');
            if(!user || ! await user.correctPassword(password,user.password))
            {
                throw new Error('incorrect email or password');
            }
            
           createSendToken(user,200,res);
}
    catch(error)
    {
        console.log(error);   
        res.status(500).json({
           error:`${error}`
        });
    }
// console.log("loging in");
}
exports.protect=async (req,res,next)=>{
    try{
        if(!req.headers.authorization  && ! req.headers.authorization.startswith('Bearer'))
        {
            throw new Error('u r not logged in');
        }
        //checking if the token is valid
        const token=req.headers.authorization.split(' ')[1];
      const decoded=await  promisify(jwt.verify)(token,process.env.JWT_SECRET);
      //checking if the user still exists
      const freshUser=await User.findById(decoded.id);
      if(!freshUser)
      {
        throw new Error('this user no longer exists');
      }
      //checking if the password is changed after the token has been issued
      if(!freshUser.changePasswordAfter(decoded.iat)){
        throw new Error('the password has been changed plz login again');
      }
      req.user=freshUser;
        next();
    }
    catch(error){
        res.status(500).json({
            error:`${error}`
         });
    }
}
exports.accessTo=(...roles)=>{
    return async (req,res,next)=>{
       try{
         const id=req.params.id;
        const user=await User.findById(req.user.id);
        if(!roles.includes(user.role))
        {
            throw new Error('your not authorized to delete');
        }
        next();
    }
    catch(err)
    {
        res.status(500).json({
            err:`${err}`
        })
    }
    }
}
exports.forgotPassword=async (req,res,next)=>{
    try{
       const user=await User.findOne({email:req.body.email});
       if(!user)throw new Error('user does not exists');
       const resetToken=user.createResetToken();
       user.save({validateBeforeSave:false})
       const resetURL=`${req.protocol}://${req.get('host')}/v1/movieDb/resetPassWord/${resetToken}`;
       const message=`Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

       console.log(sendEmail);
    //    await sendEmail({
    //     email:user.email,
    //     subject:'Your password reset token (valid for 10 min)',
    //     message
    //    })
       res.status(200).json({
        status:'success',
       msg:'token sent to email!',
       resetToken
       });
       

    }
    catch(err)
    {
        res.status(500).json({
            err:`${err}`
        })
    }
}
exports.resetPassword=async (req,res,next)=>{
   try{ const token=req.params.token;
    // const hasedToken=crypto
    // .createHash('sha256')
    // .update(token)
    // .digest('hex');
    // console.log(token);
    // console.log(hasedToken);
    const user=await User.findOne({passwordRestToken:token,
        resetTokenExpires:{$gt: Date.now()}})
    // console.log(hasedToken);
    if(!user)throw new Error('user does not exist');
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    user.passwordRestToken=undefined;
    user.resetTokenExpires=undefined;
    await user.save();
    const logintoken=signtoken(user._id);
    
            res.status(200).json({
                status:'success',
                logintoken
            })
   }
   catch(err)
   {
    res.status(500).json({
        err:`${err}`
    })
   }
}
exports.updatePassword=async(req,res,next)=>{
    try{const user=await User.findById(req.body.id).select('+password');
    if(!(await user.correctPassword(req.body.password,user.password)))
    throw new Error('credentials are invalid');
    user.password=req.body.password;
    user.password=req.body.passwordConfirm;
    await user.save();
    res.status(200).json({
        status:'success',
        'message':'password changed sucessFully'
    });}
    catch(err){
        res.status(500).json({
            err:`${err}`
        })
    }
}

exports.updateMe= async (req,res,next)=>{
    console.log('update api');
}