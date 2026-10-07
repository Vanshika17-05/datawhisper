import { pathToFileURL } from "node:url";

// TODO: Insert realistic Orders, Employees, and Sales demo data.
export async function seedDatabase() { throw new Error("Seed script is not implemented yet"); }

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) seedDatabase().catch((error) => { console.error(error.message); process.exit(1); });
