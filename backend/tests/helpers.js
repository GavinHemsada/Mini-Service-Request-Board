const request = require("supertest");
const { app } = require("../src/app");

function api() {
  return request(app);
}

async function registerUser(overrides = {}) {
  const body = {
    email: "user@example.com",
    password: "password123",
    name: "Test User",
    ...overrides,
  };
  const res = await api().post("/api/auth/register").send(body);
  return { res, body, token: res.body.token, user: res.body.user };
}

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

async function createJob(token, overrides = {}) {
  const body = {
    title: "Fix leaking tap",
    description: "Kitchen tap drips constantly.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "Alex",
    contactEmail: "contact@example.com",
    ...overrides,
  };
  const res = await api().post("/api/jobs").set(authHeader(token)).send(body);
  return { res, body, job: res.body };
}

module.exports = { api, registerUser, authHeader, createJob };
