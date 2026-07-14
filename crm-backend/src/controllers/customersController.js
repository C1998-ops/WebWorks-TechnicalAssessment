// src/controllers/customersController.js
const { v4: uuidv4 } = require("uuid");
const { getDB } = require("../db/database");

const BASE_SELECT = `
  SELECT
    c.*
  FROM customers c
`;

// GET /api/customers
function list(req, res, next) {
  try {
    const db = getDB();
    const {
      page = 1,
      limit = 20,
      search,
      sort = "created_at",
      order = "desc",
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const conditions = [];
    const params = [];

    if (search) {
      conditions.push(
        "(c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ? OR c.company LIKE ?)",
      );
      const like = `%${search}%`;
      params.push(like, like, like, like);
    }

    const where = conditions.length ? "WHERE " + conditions.join(" AND ") : "";
    const allowedSort = ["created_at", "updated_at", "name", "company"];
    const orderBy = allowedSort.includes(sort) ? sort : "created_at";
    const orderDir = order === "asc" ? "ASC" : "DESC";

    const customers = db
      .prepare(`${BASE_SELECT} ${where} ORDER BY c.${orderBy} ${orderDir} LIMIT ? OFFSET ?`)
      .all(...params, Number(limit), offset);

    const totalCount = db
      .prepare(`SELECT COUNT(*) as count FROM customers c ${where}`)
      .get(...params);

    res.json({
      success: true,
      data: customers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount.count,
        totalPages: Math.ceil(totalCount.count / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/customers/:id
function get(req, res, next) {
  try {
    const db = getDB();
    const customer = db.prepare(`${BASE_SELECT} WHERE c.id = ?`).get(req.params.id);

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    res.json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
}

// POST /api/customers
function create(req, res, next) {
  try {
    const db = getDB();
    const { name, email, phone, company, address, notes } = req.body;

    const id = uuidv4();
    db.prepare(
      `
      INSERT INTO customers (id, name, email, phone, company, address, notes, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(id, name, email, phone, company, address, notes, req.user.id);

    const customer = db.prepare(`${BASE_SELECT} WHERE c.id = ?`).get(id);

    res.status(201).json({ success: true, message: "Customer created", data: customer });
  } catch (err) {
    next(err);
  }
}

// PUT /api/customers/:id
function update(req, res, next) {
  try {
    const db = getDB();
    const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(req.params.id);

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    const { name, email, phone, company, address, notes } = req.body;

    db.prepare(
      `
      UPDATE customers
      SET name           = COALESCE(?, name),
          email          = COALESCE(?, email),
          phone          = COALESCE(?, phone),
          company        = COALESCE(?, company),
          address        = COALESCE(?, address),
          notes          = COALESCE(?, notes),
          updated_at     = datetime('now')
      WHERE id = ?
    `,
    ).run(name, email, phone, company, address, notes, req.params.id);

    const updatedCustomer = db.prepare(`${BASE_SELECT} WHERE c.id = ?`).get(req.params.id);

    res.json({ success: true, message: "Customer updated", data: updatedCustomer });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/customers/:id
function remove(req, res, next) {
  try {
    const db = getDB();
    const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(req.params.id);

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    db.prepare("DELETE FROM customers WHERE id = ?").run(req.params.id);

    res.json({ success: true, message: "Customer deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, get, create, update, remove };
