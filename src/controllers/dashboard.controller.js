import { INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MESSAGE, OK } from "../constants/index.js";
import Doctor from "../models/Doctor.model.js";
import User from "../models/User.model.js";
import Appointment from "../models/Appointment.model.js";

export const getDashboardSlats = async (req, res) => {
    try {
        const totalDoctors = await Doctor.countDocuments();
        const totalAppointments = await Appointment.countDocuments();
        const totalPatients = await User.find({ role: "patient" }).countDocuments();

        const latestAppointments = await Appointment.find()
            .sort({ date: -1 })
            .limit(5)
            .populate("doctor", "fullName specialization");

        res.status(OK).json({
            totalDoctors,
            totalAppointments,
            totalPatients,
            latestAppointments
        });
    } catch (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
}