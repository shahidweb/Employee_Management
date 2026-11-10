import mongoose, { Schema } from "mongoose";



const projectCounterSchema = new Schema({
    _id: { type: String, required: true },
    sequence: { type: Number, default: 0 }
})

export const ProjectCounter = mongoose.model("ProjectCounter", projectCounterSchema)