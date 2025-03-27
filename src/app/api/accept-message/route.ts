import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbconnect from "@/lib/Dbconnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request){
    await dbconnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user){
        return  Response.json({
            success: false,
            message: "You need to be signed in to update the user status for accept messages"
        },{status: 500});
    }

    const userId = user._id;
    const {acceptmessages} = await request.json();

    try{
       const updateuser = await UserModel.findByIdAndUpdate(userId,{
            isAcceptingMessage: acceptmessages
        },
    {new: true});

    if(!updateuser){
        return  Response.json({
            success: false,
            message: "Failed to update the user status for accept messages"
        },{status: 401});
    }
    return  Response.json({
        success: true,
        message: "User status for accept messages updated successfully"
    },{status: 200});

    }catch(error){
        console.log("failed to update the user status for acceot messages", error); 
        return  Response.json({
            success: false,
            message: "Failed to update the user status for accept messages"
        },{status: 500});
    }
}

export async function GET(request: Request){
    await dbconnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    try{if(!session || !session.user){
        return  Response.json({
            success: false,
            message: "You need to be signed in to update the user status for accept messages"
        },{status: 500});
    }

    const userId = user._id;
    const founduser =await UserModel.findById(userId)
    if(!founduser){
        return Response.json({
            success: false,
            message: "user not found"

        },{status: 404})

    }
    return Response.json({
        success: true,
        isAcceptingMessages: founduser.isAcceptingMessage,
        

    },{status: 404})
    }
    catch(error){
        console.log("failed to update the status to accept messages")
        return Response.json({
            success:false,
            Message:"error in getting message accepted"
        },{status:500})
    }
}