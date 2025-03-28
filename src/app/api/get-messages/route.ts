import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbconnect from "@/lib/Dbconnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbconnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user){
        return  Response.json({
            success: false,
            message: "You need to be signed in to update the user status for accept messages"
        },{status: 500});
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try{
        const user = await UserModel.aggregate([
            {$match:{id:userId}},
            {$unwind: '$messages'},
            {$sort:{'messages.createdAt': -1}},
            {$group:{_id:'$_id', messages:{$push:'$messages'}}}
        ])

        if(!user || user.length === 0){
            return  Response.json({
                success: false,
                message: "User not found"
            },{status: 401});
        }
        return  Response.json({
            success: true,
            message: user[0].messages
        },{status: 200});
    }catch(error){
        console.log("unexpected error occured ",error);
        return Response.json({
            success: false,
            message: "Failed to send the message"
        },{status: 500});
    }
    
}