import { Router } from "express";
import { getAllDoctors, getDoctorById } from "../controllers/doctor.controller.js";

const router = Router();

router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);

export default router;