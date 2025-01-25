// Packages
import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Utils & Config
import { connect } from "./config/db";

// Routes
import AuthRoutes from "./routes/auth.routes"

// Constant
import { ROUTES } from "./utils/constants/routes";

// Setup Environment
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// DB Connection
connect()

// Middleware
app.use(express.json());
app.use(cookieParser())


// Routes
app.use(ROUTES.AUTH.BASE, AuthRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the TypeScript Node.js backend!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
