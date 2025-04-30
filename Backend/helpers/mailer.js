//This file help all about mail like mail verification etc. and sending mail

const nodemailer = require("nodemailer");

// //setup of nodemailse
// const transporter = nodemailer.createTransport({
//     host:process.env.SMTP_HOST,
//     port:process.env.SMTP_PORT,
//     secure:false,
//     requireTLS:true,
//     auth:{
//         user:process.env.SMTP_MAIL,
//         pass:process.env.SMTP_PASSWORD,

//     }
// });

// //Now make a method to send a email

// const sendmail = async(email, subject, content)=>{
// try {
//     let mailOption = {
//     from:process.env.SMTP_MAIL,
//     to: email,
//     subject: subject,
//     html:content
//     }
    
//     // let info = await transporter.sendMail(mailOption);
//     //     console.log("Mail sent successfully:", info.messageId);
//     transporter.sendMail(mailOption,(error,info)=>{
//         if(error){
//             console.log(error);
//         }
//         console.log("Mail send",info.messageId);
//     });

// } catch (error) {
//     console.log(error.message);
// }

// }


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    }
});

const sendmail = async (email, subject, content) => {
    try {
        let mailOption = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: subject,
            html: content
        };

        transporter.sendMail(mailOption, (error, info) => {
            if (error) {
                console.log("Mail sending error:", error.message);
            } else {
                console.log("Mail sent:", info.messageId);
            }
        });

    } catch (error) {
        console.log("Mail sending error:", error.message);
    }
};

 module.exports = { sendmail }
