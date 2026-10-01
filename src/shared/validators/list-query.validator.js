import { z } from "zod";

const paginationFields = {
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
};

const validDate = z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date");
const queryBoolean = z.enum(["true", "false"]).transform((value) => value === "true");

export const productListQuerySchema = z.object({
  ...paginationFields,
  search: z.string().max(200).trim().optional(),
  sort: z.enum(["createdAt", "-createdAt", "name", "-name", "basePrice", "-basePrice", "status", "-status"]).optional(),
  categoryId: z.string().min(1).optional(),
  vendorId: z.string().min(1).optional(),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED", "INACTIVE"]).optional(),
  isApproved: queryBoolean.optional(),
  isPublished: queryBoolean.optional(),
  startDate: validDate.optional(),
  endDate: validDate.optional(),
});

export const userListQuerySchema = z.object({
  ...paginationFields,
  search: z.string().max(200).trim().optional(),
  sort: z.enum(["createdAt", "-createdAt", "name", "-name", "email", "-email", "status", "-status"]).optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "VENDOR", "CUSTOMER"]).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "BANNED", "PENDING"]).optional(),
  emailVerified: queryBoolean.optional(),
  startDate: validDate.optional(),
  endDate: validDate.optional(),
});

export const paymentListQuerySchema = z.object({
  ...paginationFields,
  sort: z.enum(["createdAt", "-createdAt", "amount", "-amount", "status", "-status"]).optional(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED", "REFUNDED"]).optional(),
  method: z.enum(["PAYSTACK"]).optional(),
  currency: z.string().length(3).toUpperCase().optional(),
  startDate: validDate.optional(),
  endDate: validDate.optional(),
});

export const auditLogQuerySchema = z.object({
  ...paginationFields,
  sort: z.enum(["createdAt", "-createdAt"]).optional(),
  action: z.enum(["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "APPROVE", "REJECT", "SUSPEND", "BAN", "VERIFY"]).optional(),
  resource: z.string().min(1).max(100).optional(),
  startDate: validDate.optional(),
  endDate: validDate.optional(),
});

export const adminReportQuerySchema = z.object({
  type: z.enum(["sales"]).optional(),
  period: z.enum(["daily", "weekly", "monthly"]).optional(),
  startDate: validDate,
  endDate: validDate,
});

export const adminExportQuerySchema = z.object({
  type: z.enum(["orders", "users", "vendors", "products"]),
  format: z.enum(["csv"]).optional(),
  startDate: validDate.optional(),
  endDate: validDate.optional(),
});
