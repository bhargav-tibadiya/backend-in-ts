// Package
import express from "express";
const router = express.Router();

// Controller
import { loginUser, registerUser } from '../controllers/auth.controller'

// Types & Constants
import { ROUTES } from "../utils/constants/routes";


// --> Route for Signup
router.post(ROUTES.AUTH.SIGNUP, registerUser);

// --> Route for Login
router.post(ROUTES.AUTH.LOGIN, loginUser);


export default router