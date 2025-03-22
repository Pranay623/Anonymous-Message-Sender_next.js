import mongoose, {Schema,Document} from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;

}


const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required:true,
        default: Date.now
    }
})


export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifycode: string;
    verifycodeeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]

}

const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email"] //use for regex validation we can use directly here
    },
    
    password:{
        type: String,
        required:[true,"password is required"]
    },
    verifycode:{
        type: String,
        required:[true,"verify code is required"]
    },
    verifycodeeExpiry:{
        type: Date,
        required:[true,"verify code expiry is required"]
    },
    isVerified:{
        type: Boolean,
        required: [true, "isVerified is required"],
        default: false
    },
    isAcceptingMessage:{
        type: Boolean,
        required: [true, "isAcceptingMessage is required"],
        default: false
    },
    messages: [MessageSchema] // can be array of string but we have custom data type so we are using it here
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema);

export default UserModel;