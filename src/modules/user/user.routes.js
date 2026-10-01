import express from "express";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import {
  getCurrentUser,
  updateProfile,
  getAllUsers,
  getUserById,
} from "./user.controller.js";
import { upload } from "../../shared/middleware/upload.js";
import { validateRequest } from "../../shared/middleware/validate.request.js";
import { updateProfileSchema } from "./user.validator.js";
import { validateIdParam } from "../../shared/middleware/validate.id-param.js";
import { userListQuerySchema } from "../../shared/validators/list-query.validator.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", getCurrentUser);
router.get("/", validateRequest(userListQuerySchema, "query"), getAllUsers);
router.patch("/me", upload.single("avatar"), validateRequest(updateProfileSchema), updateProfile);
router.get("/:id", validateIdParam("id"), getUserById);

export default router;
