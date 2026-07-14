// src/controllers/users.Controller.js
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { getDB } = require("../db/database");

const BASE_SELECT = `
  SELECT
    u.id,
    u.name,
    u.email,
    u.role,
    u.is_active,
    u.created_at,
    u.updated_at
  FROM users u
`;

// GET /api/users
function list(req, res, next) {
  try {
    const db = getDB();
    const {
      page = 1,
      limit = 20,
      search,
      role,
      is_active,
      sort = "created_at",
      order = "desc",
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const conditions = [];
    const params = [];

    if (search) {
      conditions.push("(u.name LIKE ? OR u.email LIKE ?)");
      const like = `%${search}%`;
      params.push(like, like);
    }
    if (role) {
      conditions.push("u.role = ?");
      params.push(role);
    }
    if (is_active !== undefined) {
      conditions.push("u.is_active = ?");
      params.push(is_active === "true" || is_active === "1" ? 1 : 0);
    }

    const where = conditions.length ? "WHERE " + conditions.join(" AND ") : "";
    const allowedSort = ["created_at", "updated_at", "name", "role"];
    const orderBy = allowedSort.includes(sort) ? sort : "created_at";
    const orderDir = order === "asc" ? "ASC" : "DESC";

    const users = db
      .prepare(
        `${BASE_SELECT} ${where} ORDER BY u.${orderBy} ${orderDir} LIMIT ? OFFSET ?`,
      )
      .all(...params, Number(limit), offset);

    const totalCount = db
      .prepare(`SELECT COUNT(*) as count FROM users u ${where}`)
      .get(...params);

    res.json({
      success: true,
      data: users,
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

// GET /api/users/:id
function get(req, res, next) {
  try {
    const db = getDB();
    const user = db
      .prepare(`${BASE_SELECT} WHERE u.id = ?`)
      .get(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

// POST /api/users
async function create(req, res, next) {
  try {
    const db = getDB();
    const { name, email, password, role = "agent", is_active = 1 } = req.body;

    const existing = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }

    const hash = await bcrypt.hash(password, 10);
    const id = uuidv4();

    db.prepare(
      `
      INSERT INTO users (id, name, email, password, role, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    ).run(id, name, email, hash, role, is_active ? 1 : 0);

    const user = db.prepare(`${BASE_SELECT} WHERE u.id = ?`).get(id);

    res
      .status(201)
      .json({ success: true, message: "User created", data: user });
  } catch (err) {
    next(err);
  }
}

// PUT /api/users/:id
function update(req, res, next) {
  try {
    const db = getDB();
    const user = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { name, email, role, is_active } = req.body;

    if (email && email !== user.email) {
      const existing = db
        .prepare("SELECT id FROM users WHERE email = ? AND id != ?")
        .get(email, req.params.id);
      if (existing) {
        return res
          .status(409)
          .json({ success: false, message: "Email already in use" });
      }
    }

    db.prepare(
      `
      UPDATE users
      SET name       = COALESCE(?, name),
          email      = COALESCE(?, email),
          role       = COALESCE(?, role),
          is_active  = COALESCE(?, is_active),
          updated_at = datetime('now')
      WHERE id = ?
    `,
    ).run(
      name,
      email,
      role,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      req.params.id,
    );

    const updatedUser = db
      .prepare(`${BASE_SELECT} WHERE u.id = ?`)
      .get(req.params.id);

    res.json({ success: true, message: "User updated", data: updatedUser });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/users/:id
function remove(req, res, next) {
  try {
    const db = getDB();
    const user = db
      .prepare("SELECT id FROM users WHERE id = ?")
      .get(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, get, create, update, remove, listUsers: list };
