import dbconnect from "@/lib/Dbconnect";
import UserModel from "@/model/User";

export async function POST(request: Request){
    await dbconnect();

    try{
        const{username, code} = await request.json();
        const decodedusername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedusername})

        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{status: 404})
        }

        const iscodeValid = user.verifycode ===  code
        const iscodeNotExpired = new Date() < new Date(user.verifycodeeExpiry)
        if(iscodeValid && iscodeNotExpired){
            await user.save();
            return Response.json({
                success: true,
                message: "User verified successfully"
            },{status: 200})
        }
        else if(!iscodeNotExpired){
            return Response.json({
                success: false,
                message: "verification code is expired please signup again"
            },{status: 400})
        }else{
                return Response.json({
                    success: false,
                    message: "Invalid verification code"
                },{status: 400})
            }
        }  
catch(error){
        console.error("Error verifying user",error)
        return Response.json({
            success: false,
            message: "Error verifying user"
        },{status: 500})
    }
}