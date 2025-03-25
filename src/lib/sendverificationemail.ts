import { resend } from "@/lib/resend";
import VerificationEmail  from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username: string,
    verifycode: string
):Promise<ApiResponse>{
    try{
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({username,otp:verifycode}),
          });
        return{success:true, message:'Successfully sent verification email'}
    }catch(emailError){
        console.error("error sending verification email",emailError);
        return{success:false, message:'Failed to sent verification email'}
    }
}