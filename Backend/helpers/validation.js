const { check } = require('express-validator');

exports.registerValidator = [
    check('name', 'Name is required').not().isEmpty(),

    check('email', 'Please enter a valid email').isEmail().normalizeEmail({
        gmail_remove_dots:true
    }),

    check('mobile', 'Mobile no. must contain exactly 10 digits and start with 6-9')
    .matches(/^[6-9]\d{9}$/),

    check('password', 'Password must be 6 charaters and contain at least one uppercase letter,one lowercase letter and one special character and one number')
    .isStrongPassword({
        minLength:6,
        minLowercase:1,
        minUppercase:1,
        minNumbers:1,
        minSymbols:1
    }),
    
    check('image').custom((value,{req}) =>{

        if (req.file.mimetype=== 'image/jpeg' || req.file.mimetype === 'image/png'){
           return true;
          }else{
           return false;
          }
    }).withMessage("Please upload an image jpeg,png")

 
];

exports.sendMailVerificationValidator =[
    check('email', 'Please enter a valid email').isEmail().normalizeEmail({
        gmail_remove_dots:true
    }),
];

exports.passwordResetValidator =[
    check('email', 'Please enter a valid email').isEmail().normalizeEmail({
        gmail_remove_dots:true
    }),
];

exports.loginValidator = [
    check('email', 'Please enter a valid email').isEmail().normalizeEmail({
        gmail_remove_dots:true
    }),
    check('password', 'Password is required').not().isEmpty(),
];


exports.updateProfileValidator = [
    check('name', 'Name is required').not().isEmpty(),

    check('mobile', 'Mobile no. must contain exactly 10 digits and start with 6-9')
    .matches(/^[6-9]\d{9}$/),

];


exports.otpMailValidator =[
    check('email', 'Please enter a valid email').isEmail().normalizeEmail({
        gmail_remove_dots:true
    }),
];

exports.verifyOtpValidator = [
    check('user_id', 'User Id is required').not().isEmpty(),
    check('otp', 'OTP is required').not().isEmpty()
];
