// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { getDB } = require("../db/database");
function generateToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const db = getDB();

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
      INSERT INTO users (id, name, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `,
    ).run(id, name, email, hash, role);

    const token = generateToken(id);
    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: { token, user: { id, name, email, role } },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const db = getDB();

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user.id);
    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
function me(req, res) {
  res.json({ success: true, data: req.user });
}

// POST /api/auth/change-password
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const db = getDB();

    const user = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(req.user.id);
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res
        .status(400)
        .json({ success: false, message: "Current password incorrect" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    db.prepare(
      "UPDATE users SET password = ?, updated_at = datetime('now') WHERE id = ?",
    ).run(hash, req.user.id);

    res.json({ success: true, message: "Password updated" });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me, changePassword };
