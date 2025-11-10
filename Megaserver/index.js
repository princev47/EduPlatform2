import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { connectDb } from './config/database.js';
import { connectCloud } from './config/cloudinary.js';
import userRoutes from "./routes/userRoutes.js";
// import courseRoutes from "./routes/courseRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS middleware — put this BEFORE routes and before anything else that handles requests
import cors from "cors";

app.use(
  cors({
    origin: "*", // ✅ Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // optional but recommended
    optionsSuccessStatus: 200,
  })
);


app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

// ✅ Initialize connections
connectCloud();
connectDb();

// ✅ Routes
app.use("/api/v1/user", userRoutes);
// app.use("/api/v1/course", courseRoutes);
// app.use("/api/v1/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Mega Server 🚀",
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
