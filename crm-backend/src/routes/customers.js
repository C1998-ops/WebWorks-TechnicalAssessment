// src/routes/customers.js
const router = require("express").Router();
const { body } = require("express-validator");
const ctrl = require("../controllers/customersController");
const { authenticate, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/errorHandler");

const requireAuth = authenticate;

const customerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email required"),
  validate,
];

router.get("/", requireAuth, ctrl.list);
router.get("/:id", requireAuth, ctrl.get);
router.post("/", requireAuth, customerValidation, ctrl.create);
router.put("/:id", requireAuth, customerValidation, ctrl.update);
router.delete("/:id", requireAuth, authorize("admin", "manager"), ctrl.remove);

module.exports = router;
