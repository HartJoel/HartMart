import { prisma } from "../config/db.js";

class UserRepository {
  static async findById(id) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async updateUser(id, name, avatar) {
    return prisma.user.update({
      where: { id },
      data: {
        name: name,
        avatar: avatar,
      },
    });
  }

  static async upadateRole(userId){
    return prisma.user.update({
      where: {id: userId},
      data:{
        role: "VENDOR"
      }
    })
  }

  static async findAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}

export default UserRepository;
