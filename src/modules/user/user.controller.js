import UserService from "./user.service.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await UserService.getCurrentUser(req.user.id);

  return res.json({
    success: true,
    message: "Your profile was retrieved successfully.",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await UserService.updateProfile(req.user.id, req.body, req.file);

  return res.json({
    success: true,
    message: "Profile updated successfully",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    },
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.params.id);

  return res.status(200).json({
    success: true,
    message: "User retrieved successfully.",
    data: user,
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserService.getAllUsers(req.validatedQuery ?? req.query);

  return res.json({
    success: true,
    message: "Users retrieved successfully.",

    number: users.data.length,
    data: users.data,
    pagination: users.pagination,
  });
});

export { getCurrentUser, updateProfile, getUserById, getAllUsers };
