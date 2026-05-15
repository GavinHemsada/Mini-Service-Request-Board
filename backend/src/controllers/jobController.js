const JobRequest = require("../models/JobRequest");
const { AppError } = require("../middleware/errors");
const { parsePagination, paginationMeta } = require("../utils/pagination");

const OWNER_FIELDS = "email name";

function buildListFilter(req) {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.status) filter.status = req.query.status;
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (q) {
    filter.$text = { $search: q };
  }
  return filter;
}

async function queryJobsPaginated(filter, req) {
  const { page, limit, skip } = parsePagination(req.query);
  const [data, total] = await Promise.all([
    JobRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", OWNER_FIELDS)
      .lean(),
    JobRequest.countDocuments(filter),
  ]);
  return {
    data,
    pagination: paginationMeta(page, limit, total),
  };
}

async function listJobs(req, res) {
  const result = await queryJobsPaginated(buildListFilter(req), req);
  res.json(result);
}

async function listMyJobs(req, res) {
  const filter = { createdBy: req.user.id, ...buildListFilter(req) };
  const result = await queryJobsPaginated(filter, req);
  res.json(result);
}

async function getJob(req, res) {
  const job = await JobRequest.findById(req.params.id)
    .populate("createdBy", OWNER_FIELDS)
    .lean();
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  res.json(job);
}

async function createJob(req, res) {
  const doc = await JobRequest.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category ?? "",
    location: req.body.location ?? "",
    contactName: req.body.contactName ?? "",
    contactEmail: req.body.contactEmail,
    createdBy: req.user.id,
  });
  const populated = await JobRequest.findById(doc._id)
    .populate("createdBy", OWNER_FIELDS)
    .lean();
  res.status(201).json(populated);
}

function ownerIdOf(job) {
  if (!job.createdBy) return null;
  if (typeof job.createdBy === "object" && job.createdBy._id) {
    return String(job.createdBy._id);
  }
  return String(job.createdBy);
}

function assertOwnerOrForbidden(job, userId) {
  const ownerId = ownerIdOf(job);
  if (!ownerId) {
    throw new AppError("This request has no owner", 403);
  }
  if (ownerId !== String(userId)) {
    throw new AppError("Only the creator can delete this request", 403);
  }
}

async function updateJobStatus(req, res) {
  const job = await JobRequest.findById(req.params.id);
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  job.status = req.body.status;
  await job.save();
  const populated = await JobRequest.findById(job._id)
    .populate("createdBy", OWNER_FIELDS)
    .lean();
  res.json(populated);
}

async function deleteJob(req, res) {
  const job = await JobRequest.findById(req.params.id);
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  assertOwnerOrForbidden(job, req.user.id);
  await job.deleteOne();
  res.status(204).send();
}

module.exports = {
  listJobs,
  listMyJobs,
  getJob,
  createJob,
  updateJobStatus,
  deleteJob,
};
