import bcrypt from "bcrypt";
import { generateToken } from "../helpers/index.js";
import User from "../models/User.model.js";
import { BAD_REQUEST, CONFLICT, CREATED, INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MESSAGE, OK, UNAUTHORIZED } from "../constants/index.js";

const signup = async (req, res) => {

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password)
        return res.status(BAD_REQUEST).json({ message: "All fields are required" });

    try {

        const existing = await User.findOne({ email });

        if (existing) return res.status(CONFLICT).json({ message: "Email exists" });

        const hash = await bcrypt.hash(password, 12);

        const user = await User.create({
            fullName,
            email,
            password: hash,
            role: "patient",
        });

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        return res.status(CREATED).json({
            message: "User registered successfully",
            user: { id: user._id, fullName, email, role: user.role }
        });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).send({ status: INTERNAL_SERVER_ERROR, message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(UNAUTHORIZED).json({ message: "Invalid credientials." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(UNAUTHORIZED).json({ message: "Invalid credientials." });

    const token = generateToken(user._id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    res.json({
        message: "Login successful",
        user: { id: user._id, fullName: user.fullName, email, role: user.role }
    });
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(OK).json({ message: "Logged out successfully!" });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Something went wrong!" });
    }
}

export { signup, login, logout };