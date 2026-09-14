import { healthCheck } from "./health.controller.js";
import express from "express";

const router = express.Router();

router.get("/health", healthCheck);

export default router;
