import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../../data");
const dataFile = path.join(dataDir, "dev-store.json");

export const memoryStore = {
  tenants: [],
  users: [],
  tickets: [],
  messages: [],
};

export const loadMemoryStore = () => {
  try {
    if (!fs.existsSync(dataFile)) return;

    const savedStore = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    memoryStore.tenants = Array.isArray(savedStore.tenants) ? savedStore.tenants : [];
    memoryStore.users = Array.isArray(savedStore.users) ? savedStore.users : [];
    memoryStore.tickets = Array.isArray(savedStore.tickets) ? savedStore.tickets : [];
    memoryStore.messages = Array.isArray(savedStore.messages) ? savedStore.messages : [];
  } catch (error) {
    console.error("Failed to load local dev store:", error.message);
  }
};

export const saveMemoryStore = () => {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify(memoryStore, null, 2));
  } catch (error) {
    console.error("Failed to save local dev store:", error.message);
  }
};

export const isMongoConnected = () => globalThis.__mongooseConnected === true;

export const makeId = () => crypto.randomBytes(12).toString("hex");

export const publicUser = (user) => ({
  id: user.id,
  _id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  tenant: user.tenant,
  verified: user.verified,
});

export const getTenant = (tenantId) =>
  memoryStore.tenants.find((tenant) => tenant.id === String(tenantId));
