import { RequestHandler, Request } from "express";
import createHttpError from "http-errors";
import userModel from "../models/user.model";

interface UserPayload {
  _id: string;
}

interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const getUsers: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
) => {
  try {
    const user = req.user;
    if (!user) {
      throw createHttpError(401, "User not authenticated.");
    }
    const filteredUsers = await userModel
      .findOne({ _id: user._id })
      .select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    next(error);
  }
};
