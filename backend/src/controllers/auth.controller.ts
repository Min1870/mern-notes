import bcrypt from "bcryptjs";
import { Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model";



interface CreateAccountRequestBody {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const createAccount: RequestHandler = async (req, res) => {
  const { fullName, email, password, confirmPassword } =
    req.body as CreateAccountRequestBody;

  if (!fullName) {
    res.status(400).json({ error: true, message: "FullName is required" });
    return;
  }

  if (!email) {
    res.status(400).json({ error: true, message: "Email is required" });
    return;
  }

  if (!password) {
    res.status(400).json({ error: true, message: "Password is required" });
    return;
  }

  if (!confirmPassword) {
    res
      .status(400)
      .json({ error: true, message: "Confirm Password is required" });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ error: true, message: "Password do not match" });
  }

  try {
    const isUser = await userModel.findOne({ email });

    if (isUser) {
      res.status(409).json({ error: true, message: "User already exists" });
      return;
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({
      fullName,
      email,
      password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign(
      { user },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15d",
      }
    );

    res.status(201).json({
      success: true,
      user,
      accessToken,
      message: "Account created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

interface LoginAccountRequestBody {
  email: string;
  password: string;
}

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body as LoginAccountRequestBody;

  if (!email) {
    res.status(400).json({ error: true, message: "Email is required" });
    return;
  }

  if (!password) {
    res.status(400).json({ error: true, message: "Password is required" });
    return;
  }
  try {
    const userInfo = await userModel.findOne({ email });

    if (!userInfo) {
      res
        .status(400)
        .json({ error: true, message: "Invalid email or password" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, userInfo.password);

    if (!isPasswordCorrect) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    const user = { user: userInfo };
    const accessToken = jwt.sign(
      user,
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15d",
      }
    );
    res.status(200).json({
      success: true,
      email,
      accessToken,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};


