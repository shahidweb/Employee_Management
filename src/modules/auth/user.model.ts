import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "admin" | "hr" | "employee";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["admin", "hr", "employee"], default: "employee" },
    isActive: { type: Boolean, default: true }
},{
    timestamps: true,
})

export const User = mongoose.model<IUser>("User", userSchema);