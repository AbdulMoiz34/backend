import jwt from "jsonwebtoken";
import { ENV } from "../constants/index.js";

const generateToken = (id) => {
    return jwt.sign({ id }, ENV.JWT_SECRET);
}

const convertToMinutes = (timeString) => {
    const [h, m] = timeString.split(":").map(Number);
    return h * 60 + m;
}

export { generateToken, convertToMinutes };