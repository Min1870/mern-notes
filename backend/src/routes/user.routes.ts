import express from "express";
import { getUsers } from "../controllers/user.controller";
import { authenticateToken } from "../utils";

const router = express.Router();

router.get("/", authenticateToken, getUsers);

export default router;
