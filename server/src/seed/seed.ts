import { pathToFileURL } from "node:url";
import { connectDatabase, disconnectDatabase } from "../config/db.js";
import { Order } from "../models/Order.js";
import { Employee } from "../models/Employee.js";
import { Sale } from "../models/Sale.js";

const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad", "Kolkata"];
const names = ["Aarav Sharma", "Aditi Rao", "Arjun Mehta", "Diya Nair", "Ishaan Gupta", "Kavya Iyer", "Meera Joshi", "Neel Kapoor", "Riya Singh", "Vihaan Patel", "Zara Khan"];
const products = [
  { name: "Wireless Earbuds", category: "Electronics", price: 3499 }, { name: "Smart Watch", category: "Electronics", price: 8999 },
  { name: "Cotton Kurta", category: "Fashion", price: 1899 }, { name: "Running Shoes", category: "Sports", price: 4299 },
  { name: "Yoga Mat", category: "Sports", price: 1199 }, { name: "Coffee Maker", category: "Home", price: 5299 },
  { name: "Table Lamp", category: "Home", price: 1699 }, { name: "Skin Care Set", category: "Beauty", price: 2499 },
];
const departments = { Engineering: ["Software Engineer", "QA Engineer", "Engineering Manager"], Sales: ["Account Executive", "Sales Manager"], Marketing: ["Content Strategist", "Growth Manager"], HR: ["People Partner", "Recruiter"], Support: ["Support Specialist", "Customer Success Manager"] };
const regions = ["North", "South", "East", "West", "Central"];
const pick = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)]!;
const between = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const round = (value: number): number => Math.round(value * 100) / 100;

function seasonalDate(): Date {
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, offset) => { const date = new Date(now.getFullYear(), now.getMonth() - offset, 1); return { date, weight: [9, 10].includes(date.getMonth()) ? 2.4 : 1 }; });
  const total = months.reduce((sum, item) => sum + item.weight, 0); let cursor = Math.random() * total;
  const selected = months.find((item) => ((cursor -= item.weight) <= 0)) ?? months[0]!;
  const days = new Date(selected.date.getFullYear(), selected.date.getMonth() + 1, 0).getDate();
  const latestDay = selected.date.getMonth() === now.getMonth() && selected.date.getFullYear() === now.getFullYear() ? now.getDate() : days;
  return new Date(selected.date.getFullYear(), selected.date.getMonth(), between(1, latestDay), between(8, 21), between(0, 59));
}
const quarter = (date: Date): string => `Q${Math.floor(date.getMonth() / 3) + 1}`;
function buildOrders(count: number) { return Array.from({ length: count }, (_, index) => { const product = pick(products); const quantity = between(1, 5); const orderDate = seasonalDate(); const boost = [9, 10].includes(orderDate.getMonth()) ? 1.08 : 1; return { orderId: `DW-${String(index + 1).padStart(5, "0")}`, customerName: pick(names), city: pick(cities), product: product.name, category: product.category, quantity, amount: round(product.price * quantity * boost * (.9 + Math.random() * .2)), status: pick(["delivered", "delivered", "delivered", "shipped", "pending", "cancelled"]), orderDate }; }); }
function buildEmployees(count: number) { return Array.from({ length: count }, () => { const department = pick(Object.keys(departments)) as keyof typeof departments; const joinDate = new Date(); joinDate.setDate(joinDate.getDate() - between(30, 365 * 6)); return { name: pick(names), department, role: pick(departments[department]), city: pick(cities), salary: between(5, 32) * 100000, joinDate, status: pick(["active", "active", "active", "active", "on-leave", "exited"]) }; }); }
function buildSales(count: number) { return Array.from({ length: count }, () => { const product = pick(products); const saleDate = seasonalDate(); const unitsSold = between(8, 85); const boost = [9, 10].includes(saleDate.getMonth()) ? 1.35 : 1; return { region: pick(regions), product: product.name, category: product.category, revenue: round(product.price * unitsSold * boost * (.88 + Math.random() * .25)), unitsSold, quarter: quarter(saleDate), saleDate }; }); }

export async function seedDatabase(): Promise<void> {
  await connectDatabase();
  try {
    await Promise.all([Order.deleteMany({}), Employee.deleteMany({}), Sale.deleteMany({})]);
    const [orders, employees, sales] = await Promise.all([Order.insertMany(buildOrders(150)), Employee.insertMany(buildEmployees(40)), Sale.insertMany(buildSales(100))]);
    console.log(`Seed complete: ${orders.length} orders, ${employees.length} employees, ${sales.length} sales.`);
  } finally { await disconnectDatabase(); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) seedDatabase().catch((error: unknown) => { console.error("Seed failed:", error instanceof Error ? error.message : error); process.exit(1); });
