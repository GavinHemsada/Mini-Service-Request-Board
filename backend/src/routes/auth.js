const { Router } = require("express");
const { body } = require("express-validator");
const { handleValidation } = require("../middleware/validate");
const asyncHandler = require("../middleware/asyncHandler");
const { register, login } = require("../controllers/authController");

const router = Router();

router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("name").optional().isString().trim(),
  ],
  handleValidation,
  asyncHandler(register)
);

router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").isString().notEmpty()],
  handleValidation,
  asyncHandler(login)
);

module.exports = router;
