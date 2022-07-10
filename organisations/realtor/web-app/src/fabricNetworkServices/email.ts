import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const PASSWORD = process.env.EMAIL_PASSWORD
const EMAIL = process.env.EMAIL

const sender = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL, // use your email if gmail
        pass: PASSWORD // place your password in the env file field of EMAIL_PASSWORD
    }
});
async function sendMail (email: string, message: string): Promise<void>{
    const mailDetails = {
        from: EMAIL,
        to: email,
        subject: 'Test mail',
        text: message
    };
    sender.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
}
 
export { sendMail }