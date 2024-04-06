const express=require('express');
const User=require('./../models/userModel');
const router=express.Router();
const temp=require('./../temp');
const getMoives=async (req,res,next)=>{
    const users=await User.find();
    res.status(200).json({
        msg:"sucess",
        users
    })
    next();
}
const getUser=async (req,res,next)=>{
    const users=await User.findById(req.params.id);
    res.status(200).json({
        msg:"sucess",
        users
    })
    next();
}
const updateUser=async (req,res,next)=>{
    const id=req.params.id;
    let user=await User.findById(id);
    if(!id)
    {
        throw new Error('this user does not exists');
    }
    user= await User.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true
    });
    res.status(200).json({
        status:'successfully updated',
        user
    })
}
const deleteUser=async (req,res,next)=>{
    const id=req.params.id;
    let user=await User.findById(id);
    if(!id)
    {
        throw new Error('this user does not exists');
    }
    user= await User.findByIdAndDelete(id);
    res.status(204).json({
        status:'successfully updated'
    })
}
router.route('/').get(temp.protect,getMoives)
router.route('/:id').get(getUser).patch(updateUser).delete(temp.protect,temp.accessTo('admin'),deleteUser);
router.route('/signUp').post(temp.signUp);
router.route('/login').post(temp.login);
router.route('/forgotPassword').post(temp.forgotPassword);
router.route('/resetPassword/:token').patch(temp.resetPassword);
router.route('/updatePassowrd').patch(temp.updatePassword);
module.exports=router;