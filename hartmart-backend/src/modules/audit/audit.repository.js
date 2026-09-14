import { prisma } from "../../config/db.js";

class AuditRepository {
  static async create(data) {
    return prisma.auditLog.create({
      data,
    });
  }
}

export default AuditRepository;
