import AdminRepository from "../repositories/admin.repository.js";

class AuditService {
  static async log({
    userId,
    action,
    resource,
    resourceId,
    description,
    metadata,
    ipAddress,
    userAgent,
  }) {
    return AdminRepository.createAuditLog({
      userId,
      action,
      resource,
      resourceId,
      description,
      metadata,
      ipAddress,
      userAgent,
    });
  }
}

export default AuditService;
