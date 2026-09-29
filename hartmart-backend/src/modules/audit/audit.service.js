import AuditRepository from "./audit.repository.js";
import logger from "../../shared/utils/logger.js";

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
    const auditLog = await AuditRepository.create({
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
    logger.info("Audit event recorded", { auditLogId: auditLog.id, userId, vendorId, action, resource, resourceId });
    return auditLog;
  }
}

export default AuditService;
