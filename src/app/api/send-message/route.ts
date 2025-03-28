import dbconnect from "@/lib/Dbconnect";
import UserModel from "@/model/User";
import { MessageSchema } from "@/schemas/messageSchema";
import { Message } from "@/model/User";
import { AuthOptions } from "next-auth";

export async function POST(request:Request) {
    await dbconnect();

    const {username,content,acceptmessages} = await request.json();
    try{
        const user = await UserModel.find({username})
        if(!user){
            return  Response.json({
                success: false,
                message: "User not found"
            },{status: 404});
        }
        // is user accepting the messages  
    }
    catch(error){
        
    }
}