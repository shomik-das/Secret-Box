import {Resend} from "resend";
import { renderAsync } from "@react-email/render";
import EmailTemplate from '../../emails/EmailTemplate';
import {apiResponse} from '@/types/apiResponse';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to: string, username: string, otp: string): Promise<apiResponse> =>{
    try{
        const html = await renderAsync(EmailTemplate({ username, otp }));``
        const response = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to,
            subject: 'Verify your email | Secret Box',
            html,
        });
        console.log("Resend response:", response);
        return {
            success: true,
            message: 'Email sent successfully',
        }
    }
    catch(err){
        console.error('Error sending email:', err);
        return {
            success: false,
            message: 'Error sending email',
        }
    }
}

export default sendEmail;