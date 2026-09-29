import AuditRepository from "./audit.repository.js";

class AuditService {
  static async log({
    userId,
    vendorId,
    action,
    resource,
    resourceId,
    description,
    metadata,
    ipAddress,
    userAgent,
  }) {
    return AuditRepository.create({
      userId,
      vendorId,
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
