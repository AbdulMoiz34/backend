import express from "express";
import helmet from "helmet";
import connectDB from "./src/config/db.js";
import routes from "./src/routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./src/constants/index.js";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.use(cors({
    origin: "https://frontend-teal-alpha-33.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use("/api", routes);

const PORT = ENV.PORT || 5000;

if (ENV.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log("server is running.");
    });
}

connectDB();
export default app;