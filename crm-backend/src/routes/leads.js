// src/routes/leads.js
const router = require("express").Router();
const { body } = require("express-validator");
const ctrl = require("../controllers/leadsController");
const { authenticate, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/errorHandler");

const requireAuth = authenticate;

const leadValidation = [
  body("first_name").trim().notEmpty().withMessage("First name is required"),
  body("last_name").trim().notEmpty().withMessage("Last name is required"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email required"),
  body("status")
    .optional()
    .isIn([
      "new",
      "assigned-leads",
      "converted-leads"
    ]),
  body("priority").optional().isIn(["low", "medium", "high"]),
  body("source")
    .optional()
    .isIn([
      "website",
      "referral",
      "cold_call",
      "social_media",
      "email_campaign",
      "other",
    ]),
  body("estimated_value")
    .optional()
    .isNumeric()
    .withMessage("Value must be a number"),
  validate,
];
router.get("/stats", requireAuth, ctrl.stats);
router.get("/", requireAuth, ctrl.list);
router.get("/:id", requireAuth, ctrl.get);
router.post("/", requireAuth, leadValidation, ctrl.create);
router.put("/:id", requireAuth, leadValidation, ctrl.update);
router.delete("/:id", requireAuth, authorize("admin", "super_admin"), ctrl.remove);
module.exports = router;
