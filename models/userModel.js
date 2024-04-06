const mongoose=require('mongoose');
const crypto=require('crypto');
const bcrypt=require('bcryptjs');
const validator=require('validator');
const { ChangeStream } = require('mongodb');
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter the name']
    },
    email:{
        type:String,
        required:[true,'please enter the email address'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'please enter a valid email']
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'please enter the password'],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        requrired:[true,'please confirm the password'],
        validate:{
            validator:function (el){
                return el===this.password;
            },
            message:'this doesnt match with the password'
        }
    },
    passwordChangedAt:{type:Date},
    passwordRestToken:String,
    resetTokenExpires:Date
});
userSchema.pre('save',async function(next){
    if(!this.isModified('password'))return next();

    this.password=await bcrypt.hash(this.password,12);
    this.passwordConfirm=undefined;
})
userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
    const x=await  bcrypt.compare(candidatePassword,userPassword);
    console.log(x);

    return x;
}
userSchema.methods.changePasswordAfter=async function(jwttimestamp)
{
    // console.log('where are here');
    // console.log(`timestamps: ${this.passwordChangedAt}  ${jwttimestamp}`);
    if(this.passwordChangedAt)
    {
        const changedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
        console.log(`timestamps: ${changedTimestamp}  ${jwttimestamp}`);
        return jwttimestamp<changedTimestamp;
    }
    return false;
}
userSchema.methods.createResetToken=function(){
    const token=crypto.randomBytes(32).toString('hex');
    this.passwordRestToken=crypto.createHash('sha256').update(token).digest('hex');
    this.resetTokenExpires=Date.now() +10*60*1000;
    return this.passwordRestToken;
}
const User=mongoose.model('user_parc',userSchema);
module.exports=User;