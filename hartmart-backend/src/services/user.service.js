import UserRepository from "../repositories/user.repository.js";
import AppError from "../utils/AppError.js";
import { uploadAvatarToCloudinary } from "../utils/uploadToCloudinary.js";

class UserService {
  static async getCurrentUser(userId) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { password, ...safeUser } = user;

    return safeUser;
  }

  static async updateProfile(userId, data, file) {
    try {
      const { name } = data;

      const user = await UserRepository.findById(userId);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      let avatarData = user.avatar;

      if (file) {
        const uploadedImage = await uploadAvatarToCloudinary(file.buffer);

        avatarData = {
          url: uploadedImage.secure_url,
          publicId: uploadedImage.public_id,
        };
      }

      const updatedUser = await UserRepository.updateUser(
        userId,
        name,
        avatarData,
      );

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(id) {
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { password, ...result } = user;

    return result;
  }

  static async getAllUsers(query) {
    const result = await UserRepository.findAll(query);

    const users = result.data ?? result;

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      emailVerified: user.emailVerified,
      status: user.status,
    }));

    return {
      data: formattedUsers,
      pagination: result.pagination,
    };
  }
}

export default UserService;
