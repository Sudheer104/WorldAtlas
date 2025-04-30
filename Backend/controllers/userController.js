const User = require('../models/userModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { validationResult } = require('express-validator')

const { sendmail } = require('../helpers/mailer'); //This is used fer send mail

const jwt = require('jsonwebtoken');

const userRegister = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        };

        const { name, email, mobile, password } = req.body;

        const isExist = await User.findOne({ email }); //email:email  or email both are same,email:email both are same that why use only email 

        if (isExist) {
            return res.status(404).json({
                success: false,
                msg: "Email already exist"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const imagePath = req.file ? 'images/' + req.file.filename : null;
        const user = new User({
            name,
            email,
            mobile,
            password: hashPassword,
            image: imagePath
        });

        const userData = await user.save();

        const msg = '<p> hii Sudheer ,' + name + ',Please <a href="http://127.0.0.1:5000/mail-verification?id=' + userData._id + '">Verify</a> Your mail .</p>';
        sendmail(email, 'Mail verification', msg)
            .then(() => {
                console.log("Mail send successfully")
            }).catch(err => {
                console.log(err);
            });


        return res.status(200).json({
            success: true,
            msg: 'Register successfully',
            user: userData
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}


// ---------------------------------------------------------------------------------------------------------

const mailVerification = async (req, res) => {
    try {
        if (req.query.id == undefined || !mongoose.Types.ObjectId.isValid(req.query.id)) {
            return res.render('mail-verification', { message: 'Invalid user ID' });
        }

        const userData = await User.findOne({ _id: req.query.id }); // Added 'await' to fix async issue

        if (userData) {
            if (userData.is_verified == 1) { // Fixed incorrect verification check
                return res.render('mail-verification', { message: 'Your mail has already been verified' });
            }

            await User.findByIdAndUpdate({ _id: req.query.id }, {
                $set: { is_verified: 1 }
            });

            return res.render('mail-verification', { message: 'Mail has been verified successfully' });

        } else {
            return res.render('mail-verification', { message: 'User not found' });
        }

    } catch (error) {
        // console.log(error.message);
        return res.render('404');
    }
};


// ---------------------------------------------------------------------------------------------------------

const sendMailVerification = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) { //Means error are found
            return res.status(400).json({
                success: false,
                msg: 'errors',
                errors: errors.array()
            });
        }

        const { email } = req.body; //Request.body se email nikala hai

        const userData = await User.findOne({ email: email });//email:email or email both are same because key and values are same

        if (!userData) {
            return res.status(400).json({
                success: false,
                msg: "Email doesn't exist!"
            })
        }
        if (userData.is_verified == 1) {
            return res.status(400).json({
                success: false,
                msg: userData.email + " Email is already verified!"
            });
        }


        const msg = '<p> hii Sudheer ,' + userData.name + ',Please <a href="http://127.0.0.1:5000/mail-verification?id=' + userData._id + '">Verify</a> Your mail .</p>';
        sendmail(userData.email, 'Mail verification', msg)

        return res.status(200).json({
            success: true,
            msg: "Verification link sent to your mail, please check"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}


// ---------------------------------------------------------------------------------------------------------

const randomstring = require('randomstring');
const PasswordReset = require('../models/passwordReset');

const forgetPassword = async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) { //Means error are found
            return res.status(400).json({
                success: false,
                msg: 'errors',
                errors: errors.array()
            });
        }

        const { email } = req.body; //Request.body se email nikala hai

        const userData = await User.findOne({ email: email });//email:email or email both are same because key and values are same

        if (!userData) {  //User data ke anker email nahi mila hai
            return res.status(400).json({
                success: false,
                msg: "Email doesn't exist!"
            })
        }

        //Ab jab data mil gaya hai means email correct thi
        const randomString = randomstring.generate();
        const msg = '<p>Hii,' + userData.name + ',Please click <a href="http://localhost:5000/reset-password?token=' + randomString + '">here</a> to Reset your password!</p>';
        await PasswordReset.deleteMany({ user_id: userData._id });
        const passwordReset = new PasswordReset({
            user_id: userData._id,
            token: randomString
        });
        await passwordReset.save();

        //Now email send karege
        sendmail(userData.email, 'Reset Password', msg) //Already define in upper side
        return res.status(201).json({
            success: true,
            msg: 'Reset password link send to your mail, please check'
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }

};


const resetPassword = async (req, res) => {
    try {

        if (req.query.token == undefined) {
            return res.render('404');
        }

        const resetData = await PasswordReset.findOne({ token: req.query.token });

        if (!resetData) {
            return res.render('404');
        }

        return res.render('reset-password', { resetData: resetData });


    } catch (error) {
        return res.render('404');
    }
};


// ---------------------------------------------------------------------------------------------------------

const updatePassword = async (req, res) => {
    try {

        const { user_id, password, c_password } = req.body;

        const resetData = await PasswordReset.findOne({ user_id: user_id });

        if (password != c_password) {
            return res.render('reset-password', { resetData: resetData, error: "Confirm Password Not  Matching!" });
        }

        const hashPassword = await bcrypt.hash(c_password, 10);

        await User.findByIdAndUpdate({ _id: user_id }, {
            $set: {
                password: hashPassword
            }
        });

        await PasswordReset.deleteOne({ user_id: user_id });

        return res.redirect('/reset-success');

    } catch (error) {
        return res.render('404');
    }
};

const resetSuccess = async (req, res) => {
    try {
        return res.render('reset-success');

    } catch (error) {
        return res.render('404');
    }
}


// ---------------------------------------------------------------------------------------------------------

const generateAccessToken = async (user) => {
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
    return token;
}
const generateRefreshToken = async (user) => {
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
    return token;
}

const loginUser = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'errors',
                errors: errors.array()
            })
        }

        const { email, password } = req.body;
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(401).json({
                success: false,
                msg: 'Email and Password is Incorrect!'
            });
        }

        //Email is exist by password is incorrect then use bcrypt for password check
        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                msg: 'Email and Password is Incorrect!'
            });
        }

        if (userData.is_verified == 0) {
            return res.status(401).json({
                success: false,
                msg: 'Please verified your account'
            });
        }

        const accessToken = await generateAccessToken({ user: userData });
        const refreshToken = await generateRefreshToken({ user: userData });

        return res.status(200).json({
            success: true,
            msg: 'Login Successfully',
            user: userData,
            accessToken: accessToken,
            refreshToken: refreshToken,
            tokenType: 'Bearer'
        });


    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

// ---------------------------------------------------------------------------------------------------------

const userProfile = async (req, res) => {
    try {
        const userData = req.user.user;
        return res.status(200).json({
            success: true,
            msg: 'User Profile Data',
            data: userData
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

//--------------------------------------------------------------------------------------------------
const path = require('path');
const { deleteFile } = require('../helpers/deletefile');
const { log } = require('console');
const blacklist = require('../models/blacklist');


const updateProfile = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Error',
                errors: errors.array()
            })
        }

        const { name, mobile } = req.body;

        const data = {
            name: name,
            mobile: mobile
        }

        const user_id = req.user.user._id;

        if (req.file !== undefined) { //means file hai
            data.image = 'images/' + req.file.filename;

             const oldUser = await User.findOne({ _id: user_id });

            // const oldFilePath = path.join(__dirname, '../public/' + oldUser.image); or
            if (oldUser?.image) {
                const oldFilePath = path.join(__dirname, '../public/', oldUser.image);
                deleteFile(oldFilePath);
            }

            //  deleteFile(oldFilePath);
        }

        const userData = await User.findByIdAndUpdate({ _id: user_id }, {
            $set: data
        }, { new: true });   //{new:true} this means it gives the new updated data 

        return res.status(200).json({
            success: true,
            msg: 'User updated successfully',
            user: userData
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}



//------------------------------------------------------------------------------------

const refreshToken = async (req, res) => {
    try {

        const userId = req.user.user._id;

        const userData = await User.findOne({ _id: userId });

        const accessToken = await generateAccessToken({ user: userData });
        const refreshToken = await generateRefreshToken({ user: userData });


        return res.status(200).json({
            success: true,
            msg: 'Token Refresh',
            // user:userData,
            accessToken: accessToken,
            refreshToken: refreshToken
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

//------------------------------------------------------------------------------------
const Blacklist = require('../models/blacklist')

const logout = async (req, res) => {
    try {

        const token = req.body.token || req.query.token || req.headers["authorization"];

        const bearer = token.split(' ');
        const bearerToken = bearer[1];//Because at 0 index present Bearer and 1st index at token(like->ahbsjwududbjfeiwuh238yjuyf%&&cheih)

        const newBlacklist = new Blacklist({
            token:bearerToken
        });

        await newBlacklist.save();

        res.setHeader('Clear-Site-Data','"cookies","storage"');
        return res.status(200).json({
            success: true,
            msg: 'You are logged out'
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

//------------------------------------------------------------------------------------

const generateRandum4Digit = async()=>{
   return Math.floor(1000 + Math.random() * 9000);
}

const Otp = require('../models/otp');
const {oneMinuteExpiry, threeMinuteExpiry} = require('../helpers/otpValidate'); 

const sendOtp = async(req,res)=>{
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) { //Means error are found
            return res.status(400).json({
                success: false,
                msg: 'errors',
                errors: errors.array()
            });
        }

        const { email } = req.body; //Request.body se email nikala hai

        const userData = await User.findOne({ email: email });//email:email or email both are same because key and values are same

        if (!userData) {
            return res.status(400).json({
                success: false,
                msg: "Email doesn't exist!"
            })
        }
        if (userData.is_verified == 1) {
            return res.status(400).json({
                success: false,
                msg: userData.email + " Email is already verified!"
            });
        }

        const g_Otp = await generateRandum4Digit(); //here g is generateotp

        const oldOtpData = await Otp.findOne({user_id:userData._id});
        if(oldOtpData){
        
            const sendNextOtp = await oneMinuteExpiry(oldOtpData.timestamp);
            if(!sendNextOtp){
                return res.status(400).json({
                    success: false,
                    msg: 'Please try after sometime!'
                });  
            }
        }

        const cDate = new Date();

        await Otp.findOneAndUpdate(
            {user_id:userData._id},
            {otp:g_Otp, timestamp:new Date(cDate.getTime())},
            {upsert:true, new:true, setDefaultsOnInsert:true}
        );



        const msg = '<p> hii ,<b>' + userData.name + '</b>, <br/> <h3>'+g_Otp+'</h4> </p>';
        sendmail(userData.email, 'OTP Verification', msg)

        return res.status(200).json({
            success: true,
            msg: "OTP has been send in you email, please check"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

//------------------------------------------------------------------------------------
// const {threeMinuteExpiry} =  require('../helpers/otpValidate');

const verifyOtp = async(req,res)=>{
    try {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) { //Means error are found
            return res.status(400).json({
                success: false,
                msg: 'errors',
                errors: errors.array()
            });
        }

        const {user_id, otp} = req.body;

        const otpData = await Otp.findOne({
            user_id:user_id,
            otp:otp
        })

        if(!otpData){
            return res.status(400).json({
                success: false,
                msg: 'You entered wrong otp'
            })   
        }

         const isOtpExpired = await threeMinuteExpiry(otpData.timestamp);

         if(isOtpExpired){
            return res.status(400).json({
                success: false,
                msg: 'You OTP has expired'
            })     
         }

         User.findByIdAndUpdate({_id:user_id},{
            $set:{
                is_verified:1
            }
         })

         return res.status(200).json({
            success: true,
            msg: 'Account Verified Successfully'
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

module.exports = {
    userRegister,
    mailVerification,
    sendMailVerification,
    forgetPassword,
    resetPassword,
    updatePassword,
    resetSuccess,
    loginUser,
    userProfile,
    updateProfile,
    refreshToken,
    logout,
    sendOtp,
    verifyOtp
}; 