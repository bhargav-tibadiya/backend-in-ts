// Packages

// Model
import User from "../models/user.model";

// Utils & Config
import logger from "../services/logger";
import { responseCreator } from "../utils/helpers";

// Types & Constant
import { LoginUserRequest, RegisterUserRequest, ServerResponse } from "../types/controllers";
import { MTUser } from "../types/models";
import { STATUS } from "../utils/constants/status";
import { MESSAGES } from "../utils/constants/message";


export const loginUser = async (req: LoginUserRequest, res: ServerResponse) => {
  const { email, password } = req.body;

  try {
    const isPayloadValid = (!email || !password)
    if (!isPayloadValid) {
      logger.warn(`${MESSAGES.MISSING_REQUIRED_FIELDS}: ${email}`);
      const response = responseCreator(STATUS.BAD_REQUEST, MESSAGES.MISSING_REQUIRED_FIELDS, false)
      return res.status(STATUS.BAD_REQUEST).json(response);
    }

    const selectedUser = await User.findOne({ email }) as MTUser;
    if (!selectedUser) {
      logger.warn(`${MESSAGES.USER_NOT_FOUND}: ${email}`);
      const response = responseCreator(STATUS.CONFLICT, MESSAGES.USER_NOT_FOUND, false)
      return res.status(STATUS.CONFLICT).json(response);
    }

    const isPasswordValid = selectedUser.matchPassword(password);
    if (!isPasswordValid) {
      logger.warn(`Invalid password attempt for email: ${email}`);
      const response = responseCreator(STATUS.UNAUTHORIZED, MESSAGES.PASSWORD_MISMATCH, false)
      return res.status(STATUS.UNAUTHORIZED).json(response);
    }

    logger.info(`User logged in successfully: ${email}`);
    const response = responseCreator(STATUS.OK, MESSAGES.USER_AUTHENTICATED, true, selectedUser)
    return res.status(STATUS.OK).json(response);

  } catch (error: any) {
    logger.error(`Error in loginUser: ${error.message}`);
    const response = responseCreator(STATUS.INTERNAL_SERVER_ERROR, MESSAGES.INTERNAL_SERVER_ERROR, false)
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(response);
  }
};

export const registerUser = async (req: RegisterUserRequest, res: ServerResponse) => {
  const { name, email, password, mobile, gender, age } = req.body;

  try {
    const isPayloadValid = (!name || !email || !password || !mobile || !gender || !age)
    if (!isPayloadValid) {
      logger.warn(`${MESSAGES.MISSING_REQUIRED_FIELDS}: ${email}`);
      const response = responseCreator(STATUS.BAD_REQUEST, MESSAGES.MISSING_REQUIRED_FIELDS, false)
      return res.status(STATUS.BAD_REQUEST).json(response);
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      logger.warn(`${MESSAGES.USER_ALREADY_EXISTS}: ${email}`);
      const response = responseCreator(STATUS.CONFLICT, MESSAGES.USER_ALREADY_EXISTS, false)
      return res.status(STATUS.CONFLICT).json(response);
    }

    const payload = { name, email, password, mobile, gender, age }
    const newUser = await User.create(payload);
    logger.info(`New user created: ${email}`);
    const response = responseCreator(STATUS.CREATED, MESSAGES.USER_AUTHENTICATED, true, newUser)
    return res.status(STATUS.CREATED).json(response);

  } catch (error: any) {
    logger.error(`Error in loginUser: ${error.message}`);
    const response = responseCreator(STATUS.INTERNAL_SERVER_ERROR, MESSAGES.INTERNAL_SERVER_ERROR, false)
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(response);
  }
};