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

  static async getAllUsers() {
    const users = await UserRepository.findAll();

    return users.map(({ password, ...user }) => user);
  }
}

export default UserService;
