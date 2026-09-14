import { Parser } from "json2csv";
import AppError from "../utils/AppError.js";
import AdminRepository from "../repositories/admin.repository.js";

class ExportService {
  static async exportData({ type, format = "csv", startDate, endDate }) {
    if (!type) {
      throw new AppError("Export type is required", 400);
    }

    if (format !== "csv") {
      throw new AppError("Only CSV export is currently supported", 400);
    }

    const allowedTypes = ["orders", "users", "vendors", "products"];

    if (!allowedTypes.includes(type)) {
      throw new AppError(`Invalid export type: ${type}`, 400);
    }

    let data;

    switch (type) {
      case "orders":
        data = await AdminRepository.getOrdersForExport({
          startDate,
          endDate,
        });
        break;

      case "users":
        data = await AdminRepository.getUsersForExport({
          startDate,
          endDate,
        });
        break;

      case "vendors":
        data = await AdminRepository.getVendorsForExport({
          startDate,
          endDate,
        });
        break;

      case "products":
        data = await AdminRepository.getProductsForExport({
          startDate,
          endDate,
        });
        break;
    }

    const normalizedData = data.map((item) => this.normalizeData(item));

    const parser = new Parser();

    const csv = parser.parse(normalizedData);

    return {
      csv,
      filename: `${type}-export-${Date.now()}.csv`,
    };
  }

  static normalizeData(data) {
    const result = {};

    for (const [key, value] of Object.entries(data)) {
      if (
        value &&
        typeof value === "object" &&
        typeof value.toNumber === "function"
      ) {
        result[key] = value.toNumber();
      } else if (value instanceof Date) {
        result[key] = value.toISOString();
      } else if (value && typeof value === "object") {
        result[key] = JSON.stringify(value);
      } else {
        result[key] = value;
      }
    }

    return result;
  }
}

export default ExportService;
