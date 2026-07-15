// src/db/seed.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { getDB } = require("./database");

// Run migrate first
require("./migrate");

async function seed() {
  const db = getDB();

  //Super Admin user
  const superAdminId = uuidv4();
  const hash = await bcrypt.hash("superadmin123", 10);

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, name, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertUser.run(
    superAdminId,
    "Super Admin",
    "super_admin@test.com",
    hash,
    "super_admin",
  );

  // Get actual super admin ID from database (in case it already existed)
  const superAdminResult = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get("super_admin@test.com");
  const actualAdminId = superAdminResult ? superAdminResult.id : superAdminId;

  const agentId = uuidv4();
  const agentHash = await bcrypt.hash("agent123", 10);
  insertUser.run(agentId, "Sales Agent", "agent@test.com", agentHash, "agent");

  // Get actual agent ID from database (in case it already existed)
  const agentResult = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get("agent@test.com");
  const actualAgentId = agentResult ? agentResult.id : agentId;

  // Sample customers
  const c1 = uuidv4();
  const c2 = uuidv4();
  const insertCustomer = db.prepare(`
    INSERT OR IGNORE INTO customers (id, name, email, phone, company,address,notes,is_active, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertCustomer.run(
    c1,
    "Acme Corp",
    "contact@acme.com",
    "+91-9876543210",
    "Acme Corp",
    "Nagarbhavi",
    "Notes for Acme corp",
    0,
    actualAdminId,
  );
  insertCustomer.run(
    c2,
    "TechStart Ltd",
    "hello@techstart.in",
    "+91-9123456789",
    "TechStart Ltd",
    "Electronic City ph-2",
    "Notes for TechStart Ltd",
    1,
    actualAdminId,
  );

  // Sample leads
  const insertLead = db.prepare(`
    INSERT OR IGNORE INTO leads
      (id, first_name, last_name, email, phone, company, source, status, priority, estimated_value, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertLead.run(
    uuidv4(),
    "Rahul",
    "Sharma",
    "rahul@acme.com",
    "+91-9800000001",
    "Acme Corp",
    "converted-leads",
    "qualified",
    "high",
    500000,
    "Interested in enterprise plan",
  );

  insertLead.run(
    uuidv4(),
    "Priya",
    "Patel",
    "priya@techstart.in",
    "+91-9800000002",
    "TechStart Ltd",
    "assigned-leads",
    "proposal",
    "high",
    250000,
    "Follow up scheduled",
  );

  insertLead.run(
    uuidv4(),
    "Amit",
    "Kumar",
    "amit@newco.com",
    "+91-9800000003",
    "NewCo",
    "cold_call",
    "new",
    "medium",
    75000,
    "Initial contact made",
  );

  console.log("✅ Seed complete");
  console.log("   super_admin@test.com / superadmin123");
  console.log("   agent@test.com / agent123");
}

seed().catch(console.error);
