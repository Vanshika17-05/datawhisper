export const COLLECTION_SCHEMAS = {
  orders: {
    description: "Customer orders placed across Indian cities. MongoDB model: Order.",
    fields: {
      orderId: { type: "string", example: "DW-00042" }, customerName: { type: "string", example: "Aditi Rao" },
      city: { type: "string", allowed: ["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad", "Kolkata"] },
      product: { type: "string", example: "Wireless Earbuds" }, category: { type: "string", allowed: ["Electronics", "Home", "Fashion", "Beauty", "Sports"] },
      quantity: { type: "number", example: 2 }, amount: { type: "number", description: "Total order amount in INR", example: 6998 },
      status: { type: "string", allowed: ["pending", "shipped", "delivered", "cancelled"] }, orderDate: { type: "date", example: "2026-09-18T10:30:00.000Z" },
    },
  },
  employees: {
    description: "Company employees and employment status. MongoDB model: Employee.",
    fields: {
      name: { type: "string", example: "Arjun Mehta" }, department: { type: "string", allowed: ["Engineering", "Sales", "Marketing", "HR", "Support"] },
      role: { type: "string", example: "Software Engineer" }, city: { type: "string", allowed: ["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad", "Kolkata"] },
      salary: { type: "number", description: "Annual salary in INR", example: 1400000 }, joinDate: { type: "date", example: "2024-03-12T00:00:00.000Z" },
      status: { type: "string", allowed: ["active", "on-leave", "exited"] },
    },
  },
  sales: {
    description: "Aggregated product sales by Indian business region. This collection has region, not city. MongoDB model: Sale.",
    fields: {
      region: { type: "string", allowed: ["North", "South", "East", "West", "Central"] }, product: { type: "string", example: "Smart Watch" },
      category: { type: "string", allowed: ["Electronics", "Home", "Fashion", "Beauty", "Sports"] }, revenue: { type: "number", description: "Revenue in INR", example: 275000 },
      unitsSold: { type: "number", example: 48 }, quarter: { type: "string", allowed: ["Q1", "Q2", "Q3", "Q4"] }, saleDate: { type: "date", example: "2026-07-21T14:15:00.000Z" },
    },
  },
};

export function getSchemaContext() { return COLLECTION_SCHEMAS; }
export function formatSchemaContext() { return JSON.stringify(COLLECTION_SCHEMAS, null, 2); }
