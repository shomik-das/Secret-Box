import {resend} from '@/lib/resend';
import {emailTemplate} from '../../emails/emailTemplate';
import {apiResponse} from '@/types/apiResponse';

const sendEmail = async (
    email: string,
    username: string,
    otp: string
): Promise<apiResponse> =>{
    try{
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verify your email | Secret Box',
            react: emailTemplate({ username: username, otp: otp }),
        });
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