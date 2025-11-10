import mongoose from "mongoose";

const { ObjectId, String, Date } = mongoose.Schema.Types;

const AppointmentSchema = new mongoose.Schema({
    patient: {
        type: ObjectId,
        ref: "User"
    },
    doctor: {
        type: ObjectId,
        ref: "Doctor"
    },
    status: String,
    date: Date,
    patientDisease: String,
    prescription: String
})

export default mongoose.model("Appointment", AppointmentSchema);