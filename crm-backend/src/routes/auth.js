// src/routes/auth.js
const router = require("express").Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const { validate } = require("../middleware/errorHandler");
const { listUsers } = require("../controllers/users.Controller");

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
    body("role")
      .optional()
      .isIn(["admin", "super_admin", "agent"])
      .withMessage("Invalid role"),
    validate,
  ],
  authController.register,
);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
    validate,
  ],
  authController.login,
);

router.get("/me", authenticate, authController.me);

router.post(
  "/change-password",
  authenticate,
  [
    body("currentPassword").notEmpty().withMessage("Current password required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password min 6 chars"),
    validate,
  ],
  authController.changePassword,
);
//route to check existing user in db
// router.get('/users', authenticate, listUsers);
module.exports = router;
