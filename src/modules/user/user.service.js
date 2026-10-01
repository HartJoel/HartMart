import UserRepository from "./user.repository.js";
import AppError from "../../shared/utils/AppError.js";
import { uploadAvatarToCloudinary } from "../../shared/utils/uploadToCloudinary.js";
import logger from "../../shared/utils/logger.js";
import { cacheTtl, getOrSetCache, invalidateCache } from "../../shared/utils/cache.js";

class UserService {
  static async getCurrentUser(userId) {
    const user = await getOrSetCache("users.profile", [userId], cacheTtl.userProfile, async () => {
      const record = await UserRepository.findById(userId);
      if (!record) return null;
      const { password, ...safeRecord } = record;
      return safeRecord;
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    logger.info("Current user retrieved", { userId });

    return user;
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
      await invalidateCache("users.profile");
      await invalidateCache("users.detail");
      logger.info("User profile updated", { userId, nameChanged: Boolean(name), avatarChanged: Boolean(file) });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(id) {
    const user = await getOrSetCache("users.detail", [id], cacheTtl.userProfile, async () => {
      const record = await UserRepository.findById(id);
      if (!record) return null;
      const { password, ...safeRecord } = record;
      return safeRecord;
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    logger.info("User retrieved", { userId: id });

    return user;
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
    logger.info("Users listed", { resultCount: formattedUsers.length });

    return {
      data: formattedUsers,
      pagination: result.pagination,
    };
  }
}

export default UserService;
