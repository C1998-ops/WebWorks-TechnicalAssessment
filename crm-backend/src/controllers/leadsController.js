// src/controllers/leadsController.js
const { v4: uuidv4 } = require("uuid");
const { getDB } = require("../db/database");

const BASE_SELECT = `
  SELECT
    l.*
  FROM leads l
`;

// GET /api/leads
function list(req, res, next) {
  try {
    const db = getDB();
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      search,
      sort = "created_at",
      order = "desc",
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const conditions = [];
    const params = [];

    if (status) {
      conditions.push("l.status = ?");
      params.push(status);
    }
    if (priority) {
      conditions.push("l.priority = ?");
      params.push(priority);
    }
    if (search) {
      conditions.push(
        "(l.first_name LIKE ? OR l.last_name LIKE ? OR l.email LIKE ? OR l.company LIKE ?)",
      );
      const like = `%${search}%`;
      params.push(like, like, like, like);
    }

    const where = conditions.length ? "WHERE " + conditions.join(" AND ") : "";
    const allowedSort = [
      "created_at",
      "updated_at",
      "estimated_value",
      "status",
      "priority",
    ];
    const allowedOrder = ["asc", "desc"];
    const safeSort = allowedSort.includes(sort) ? `l.${sort}` : "l.created_at";
    const safeOrder = allowedOrder.includes(order) ? order : "desc";

    const total = db
      .prepare(`SELECT COUNT(*) AS n FROM leads l ${where}`)
      .get(...params).n;
    const rows = db
      .prepare(
        `${BASE_SELECT} ${where} ORDER BY ${safeSort} ${safeOrder} LIMIT ? OFFSET ?`,
      )
      .all(...params, Number(limit), offset);

    res.json({
      success: true,
      data: rows,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/leads/:id
function get(req, res, next) {
  try {
    const db = getDB();
    const lead = db.prepare(`${BASE_SELECT} WHERE l.id = ?`).get(req.params.id);
    if (!lead)
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });

    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
}

// POST /api/leads
function create(req, res, next) {
  try {
    const db = getDB();
    const {
      first_name,
      last_name,
      email,
      phone,
      company,
      source,
      status = "new",
      priority = "medium",
      estimated_value = 0,
      notes,
    } = req.body;

    const id = uuidv4();
    db.prepare(
      `
      INSERT INTO leads
        (id, first_name, last_name, email, phone, company,
         source, status, priority, estimated_value, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      id,
      first_name,
      last_name,
      email,
      phone,
      company,
      source,
      status,
      priority,
      estimated_value,
      notes,
    );

    const lead = db.prepare(`${BASE_SELECT} WHERE l.id = ?`).get(id);
    // const availableLeads = db.prepare(`select * from leads`).all();
    res
      .status(201)
      .json({ success: true, message: "Lead created", data: lead });
  } catch (err) {
    next(err);
  }
}

// PUT /api/leads/:id
function update(req, res, next) {
  try {
    const db = getDB();
    const lead = db
      .prepare("SELECT * FROM leads WHERE id = ?")
      .get(req.params.id);
    if (!lead)
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });

    const {
      first_name,
      last_name,
      email,
      phone,
      company,
      source,
      status,
      priority,
      estimated_value,
      notes,
    } = req.body;

    const closedAt =
      ["won", "lost"].includes(status) && !["won", "lost"].includes(lead.status)
        ? "datetime('now')"
        : `'${lead.closed_at}'`;

    db.prepare(
      `
      UPDATE leads SET
        first_name      = COALESCE(?, first_name),
        last_name       = COALESCE(?, last_name),
        email           = COALESCE(?, email),
        phone           = COALESCE(?, phone),
        company         = COALESCE(?, company),
        source          = COALESCE(?, source),
        status          = COALESCE(?, status),
        priority        = COALESCE(?, priority),
        estimated_value = COALESCE(?, estimated_value),
        notes           = COALESCE(?, notes),
        closed_at       = ${closedAt},
        updated_at      = datetime('now')
      WHERE id = ?
    `,
    ).run(
      first_name,
      last_name,
      email,
      phone,
      company,
      source,
      status,
      priority,
      estimated_value,
      notes,
      req.params.id,
    );

    const updated = db
      .prepare(`${BASE_SELECT} WHERE l.id = ?`)
      .get(req.params.id);
    res.json({ success: true, message: "Lead updated", data: updated });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/leads/:id
function remove(req, res, next) {
  try {
    const db = getDB();
    const lead = db
      .prepare("SELECT id FROM leads WHERE id = ?")
      .get(req.params.id);
    if (!lead)
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });

    db.prepare("DELETE FROM leads WHERE id = ?").run(req.params.id);
    res.json({ success: true, message: "Lead deleted" });
  } catch (err) {
    next(err);
  }
}

// POST /api/leads/:id/activities
// function addActivity(req, res, next) {
//   try {
//     const db = getDB();
//     const lead = db
//       .prepare("SELECT id FROM leads WHERE id = ?")
//       .get(req.params.id);
//     if (!lead)
//       return res
//         .status(404)
//         .json({ success: false, message: "Lead not found" });

//     const { type, description } = req.body;
//     const id = uuidv4();
//     db.prepare(
//       `
//       INSERT INTO lead_activities (id, lead_id, type, description)
//       VALUES (?, ?, ?, ?)
//     `,
//     ).run(id, req.params.id, type, description);

//     const activity = db
//       .prepare(
//         `
//       SELECT a.* FROM lead_activities a WHERE a.id = ?
//     `,
//       )
//       .get(id);

//     res.status(201).json({ success: true, data: activity });
//   } catch (err) {
//     next(err);
//   }
// }

// GET /api/leads/stats
function stats(req, res, next) {
  try {
    const db = getDB();
    const byStatus = db
      .prepare(
        "SELECT status, COUNT(*) AS count, SUM(estimated_value) AS value FROM leads GROUP BY status",
      )
      .all();
    const byPriority = db
      .prepare(
        "SELECT priority, COUNT(*) AS count FROM leads GROUP BY priority",
      )
      .all();
    const recent = db
      .prepare(`${BASE_SELECT} ORDER BY l.created_at DESC LIMIT 5`)
      .all();
    const totals = db
      .prepare(
        "SELECT COUNT(*) AS total, SUM(estimated_value) AS pipeline FROM leads WHERE status NOT IN ('won','lost')",
      )
      .get();

    res.json({ success: true, data: { byStatus, byPriority, recent, totals } });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, get, create, update, remove, stats };
