import bcrypt from "bcrypt";
import User from "../models/User.model.js";
import Doctor from "../models/Doctor.model.js";
import { convertToMinutes } from "../helpers/index.js";
import { CREATED, BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MESSAGE, OK, NOT_FOUND } from "../constants/index.js";

const isValidTime = (time) => {
    return time >= "10:00" && time <= "20:00";
};

const addDoctor = async (req, res) => {
    const { fullName, email, password, dateOfBirth, gender, phone, address, specialization, about, availability, imgUrl } = req.body;

    const { startTime, endTime, roomNo, days } = availability;

    if (!fullName || !email || !password || !specialization) {
        return res.status(BAD_REQUEST).json({ message: "Required fields are missing." });
    }

    if (!isValidTime(startTime) || !isValidTime(endTime)) {
        return res.status(BAD_REQUEST).json({ message: "Clinic timings are 10:00AM to 08:00PM Only." });
    }


    const startMinutes = convertToMinutes(startTime);
    const endMinutes = convertToMinutes(endTime);
    try {
        const conflict = await Doctor.findOne({
            "availability.days": { $in: days },
            "availability.roomNo": roomNo,
            "availability.startMinutes": { $lt: endMinutes },
            "availability.endMinutes": { $gt: startMinutes }
        }).populate("user", "fullName");

        if (conflict) {
            return res.status(BAD_REQUEST).json({
                message: `Room ${roomNo} already booked by ${conflict.user?.fullName} at this time.`
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(CONFLICT).json({ message: "Email already in use!" });

        const hashPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            fullName,
            email,
            password: hashPassword,
            role: "doctor"
        });

        const doctor = await Doctor.create({
            dateOfBirth,
            gender,
            phone,
            address,
            specialization,
            about,
            availability,
            imgUrl,
            status: "available",
            user: user._id
        });

        return res.status(CREATED).json({
            message: "Doctor added successfully!",
            doctor
        });

    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "Internal server error."
        });
    }
};

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find()
            .select("specialization imgUrl status")
            .populate("user", "fullName email");
        res.status(OK).json(doctors);
    } catch (err) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: INTERNAL_SERVER_ERROR_MESSAGE, err });
    }
}

const getDoctorById = async (req, res) => {
    const { id } = req.params;

    try {
        const doctor = await Doctor.findById(id)
            .select("specialization availability imgUrl about")
            .populate("user", "fullName email");

        if (!doctor) return res.status(NOT_FOUND).json({ message: "Doctor not found." });

        res.status(OK).json(doctor);

    } catch (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR).json({ message: INTERNAL_SERVER_ERROR_MESSAGE, err });
    }
}

export { addDoctor, getAllDoctors, getDoctorById };