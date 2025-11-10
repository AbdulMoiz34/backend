import mongoose from "mongoose";

const { String, ObjectId, Number, Boolean, Array } = mongoose.Schema.Types;

const DoctorSchema = new mongoose.Schema({
    dateOfBirth: String,
    gender: String,
    phone: String,
    address: String,
    specialization: String,
    about: String,
    imgUrl: String,
    appointments: [
        { type: ObjectId, ref: "Appointment" }
    ],
    availability: {
        days: {
            type: [String],
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            required: true
        },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        startMinutes: { type: Number, required: true },
        endMinutes: { type: Number, required: true },
        roomNo: { type: Number, required: true }
    },

    status: {
        type: String,
        enum: ["available", "unavailable"]
    },
    user: {
        type: ObjectId,
        ref: "User"
    }
});

export default mongoose.model("Doctor", DoctorSchema);