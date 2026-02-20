import { createTransport } from "nodemailer"
import dotenv from "dotenv"
dotenv.config()


const transporter = createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

const sendMail = async(to,otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: to,
        subject: "OTP for password reset",
        text: `Your OTP for password reset is ${otp}. It is valid for 5 minutes.`
    })
}

export default sendMail;