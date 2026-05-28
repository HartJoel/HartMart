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

  static async getUserById(id) {
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
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
