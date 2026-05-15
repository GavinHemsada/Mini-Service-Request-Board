const { Router } = require("express");
const { body, param, query } = require("express-validator");
const JobRequest = require("../models/JobRequest");
const { authRequired } = require("../middleware/auth");
const { handleValidation } = require("../middleware/validate");
const asyncHandler = require("../middleware/asyncHandler");
const {
  listJobs,
  listMyJobs,
  getJob,
  createJob,
  updateJobStatus,
  deleteJob,
} = require("../controllers/jobController");

const router = Router();

const listQueryRules = [
  query("category").optional().isString().trim(),
  query("status").optional().isIn(JobRequest.STATUS_VALUES),
  query("q").optional().isString().trim(),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
];

router.get("/", listQueryRules, handleValidation, asyncHandler(listJobs));

router.get(
  "/mine",
  authRequired,
  listQueryRules,
  handleValidation,
  asyncHandler(listMyJobs)
);

router.get(
  "/:id",
  [param("id").isMongoId()],
  handleValidation,
  asyncHandler(getJob)
);

router.post(
  "/",
  authRequired,
  [
    body("title").isString().trim().notEmpty(),
    body("description").isString().trim().notEmpty(),
    body("category").optional().isString().trim(),
    body("location").optional().isString().trim(),
    body("contactName").optional().isString().trim(),
    body("contactEmail").isEmail().normalizeEmail(),
  ],
  handleValidation,
  asyncHandler(createJob)
);

router.patch(
  "/:id",
  authRequired,
  [
    param("id").isMongoId(),
    body("status").isIn(JobRequest.STATUS_VALUES),
  ],
  handleValidation,
  asyncHandler(updateJobStatus)
);

router.delete(
  "/:id",
  authRequired,
  [param("id").isMongoId()],
  handleValidation,
  asyncHandler(deleteJob)
);

module.exports = router;
