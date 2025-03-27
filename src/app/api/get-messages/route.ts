import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbconnect from "@/lib/Dbconnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

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

    const userId = user._id;
    
}