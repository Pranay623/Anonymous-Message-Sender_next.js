import dbconnect from "@/lib/Dbconnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/sendverificationemail";

export async function POST(request: Request){
    await dbconnect();

    try{
        const {username, email, password} =await request.json();
        const existingUserVerificationByUSername= await UserModel.findOne({username,isVerified:true})
        const verifycode = Math.floor(100000 + Math.random() * 900000).toString();
        if(existingUserVerificationByUSername){
            return Response.json({
                success: false,
                message: 'Username already exists'
            },{status: 400});
        }

       const ExistingUSerByEmail =  await UserModel.findOne({email})
       if(ExistingUSerByEmail){
        if(ExistingUSerByEmail.isVerified){
            return Response.json({
                success: false,
                message: 'Email already exists'
            },{status: 400});
        }

        else{
            const hashedpassword =await bcrypt.hash(password,10)
            ExistingUSerByEmail.password = hashedpassword;
            ExistingUSerByEmail.verifycode = verifycode;
            ExistingUSerByEmail.verifycodeeExpiry = new Date(Date.now() + 3600000);
            await ExistingUSerByEmail.save();

        }
       }
       else{
        const hashedpassword =await bcrypt.hash(password,10)
        const expirydate = new Date();
        expirydate.setHours(expirydate.getHours()+1);
        const newUser =new UserModel({
            username,
                email,
                password:hashedpassword,
                verifycode,
                verifycodeeExpiry: expirydate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
        })
        await newUser.save();
       }
       //send verification email
       const emailresponse =await sendVerificationEmail(email,username,verifycode);
       if(!emailresponse.success){
           return Response.json({
               success: false,
               message: 'User registratiin failed'
           },{status:500});}


           return Response.json({
            success: true,
            message: 'User registratiin succesfully verify your email'
        },{status:200});
           

    }catch(error){
        console.error("error registering user",error);
        return Response.json({
            success: false,
            message: 'Failed to register user'
        },
    {
        status: 500
    })
    }
}