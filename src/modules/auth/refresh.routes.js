import express from "express";
import { refreshToken } from "./refresh.controller.js";

const router = express.Router();

router.post("/refresh", refreshToken);

export default router;
