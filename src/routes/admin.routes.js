import { Router } from "express";
import { addDoctor } from "../controllers/doctor.controller.js";
import { getDashboardSlats } from "../controllers/dashboard.controller.js";

const router = Router();

router.post("/add-doctor", addDoctor);
router.get("/dashboard", getDashboardSlats);
// router.get("/doctors", getDoctorsSlats);

export default router;