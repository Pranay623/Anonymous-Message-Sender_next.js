import dbconnect from "@/lib/Dbconnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username :usernameValidation
})

export async function GET(request: Request){
    await dbconnect();
     
    try{
        const {searchParams} = new URL(request.url);
        const queryParam={
            username: searchParams.get('username')
        }
        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result)
        if(!result.success){
            const usernameerrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameerrors?.length>0?usernameerrors.join(','):'Invalid query parameter',
            },{status:400})
        }

        const {username}= result.data;
        const existinguser = await UserModel.findOne({username, isVerified:true})
        if(existinguser){
            return Response.json({
                success: false,
                message: 'username is taken',
            },{status:400})
        }
        return Response.json({
            success: true,
            message: 'username is unique',
        },{status:200})
    }
    catch(error){
        console.error("Error checking username",error)
        return Response.json({
            success: false,
            message: "Error checking username"
        },{status: 500})
    }
}