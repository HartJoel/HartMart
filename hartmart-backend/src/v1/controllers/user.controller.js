import AddressService from "../../services/address.service.js";
import UserService from "../../services/user.service.js";

const getCurrentUser = async (req, res) => {
  try {
    const user = await UserService.getCurrentUser(req.user.id);

    return res.json({
      success: true,
      message: "Current User info",
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
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await UserService.updateProfile(req.user.id, req.body);

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
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);

    return res.status(201).json({
      success: true,
      message: "User Details ",
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();

    return res.json({
      success: true,
      message: "All Users",
      number: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const createAddress = async (req, res) => {
  try {
    const address = await AddressService.addAddress(req.user.id, req.body);

    res.status(201).json({
      status: "success",
      message: "Add new address to profile",
      data: address,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export {
  getCurrentUser,
  updateProfile,
  getUserById,
  getAllUsers,
  createAddress,
};
