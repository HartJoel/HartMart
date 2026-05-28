import UserRepository from "../repositories/user.repository.js";

class UserService {
  static async getCurrentUser(userId) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const { password, ...safeUser } = user;

    return safeUser;
  }

  static async updateProfile(userId, data) {
    try {
      const { name, avatar } = data;

      const user = await UserRepository.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      const updatedUser = await UserRepository.updateUser(userId, name, avatar);

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
