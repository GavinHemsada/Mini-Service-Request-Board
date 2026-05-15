const mongoose = require("mongoose");
const { api, registerUser, authHeader, createJob } = require("./helpers");

describe("GET /api/jobs", () => {
  it("returns an empty paginated list", async () => {
    const res = await api().get("/api/jobs");

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.pagination).toMatchObject({
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0,
    });
  });

  it("returns 400 for an invalid status filter", async () => {
    const res = await api().get("/api/jobs").query({ status: "NotAStatus" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("lists created jobs", async () => {
    const { token } = await registerUser();
    await createJob(token);

    const res = await api().get("/api/jobs");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe("Fix leaking tap");
    expect(res.body.pagination.total).toBe(1);
  });
});

describe("GET /api/jobs/:id", () => {
  it("returns 400 for a non-ObjectId id", async () => {
    const res = await api().get("/api/jobs/not-a-valid-id");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("returns 404 when the job does not exist", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await api().get(`/api/jobs/${id}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Job not found");
  });

  it("returns a job by id", async () => {
    const { token } = await registerUser();
    const { job } = await createJob(token);

    const res = await api().get(`/api/jobs/${job._id}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(job._id);
    expect(res.body.title).toBe("Fix leaking tap");
  });
});

describe("GET /api/jobs/mine", () => {
  it("returns 401 without authentication", async () => {
    const res = await api().get("/api/jobs/mine");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Authentication required");
  });

  it("returns only jobs created by the signed-in user", async () => {
    const { token } = await registerUser({ email: "owner@example.com" });
    const { token: otherToken } = await registerUser({ email: "other@example.com" });

    await createJob(token, { title: "My job" });
    await createJob(otherToken, { title: "Their job" });

    const res = await api().get("/api/jobs/mine").set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe("My job");
  });
});

describe("POST /api/jobs", () => {
  it("returns 401 without authentication", async () => {
    const res = await api().post("/api/jobs").send({
      title: "Test",
      description: "Desc",
      contactEmail: "a@b.com",
    });

    expect(res.status).toBe(401);
  });

  it("returns 400 when required fields are missing", async () => {
    const { token } = await registerUser();
    const res = await api().post("/api/jobs").set(authHeader(token)).send({ title: "Only title" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("creates a job when authenticated", async () => {
    const { token, user } = await registerUser();
    const { res, job } = await createJob(token);

    expect(res.status).toBe(201);
    expect(job.title).toBe("Fix leaking tap");
    expect(job.status).toBe("Open");
    expect(job.createdBy).toEqual(
      expect.objectContaining({
        email: user.email,
        name: user.name,
      })
    );
    expect(job.createdBy._id).toBeDefined();
  });
});

describe("PATCH /api/jobs/:id", () => {
  it("returns 401 without authentication", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await api().patch(`/api/jobs/${id}`).send({ status: "Closed" });

    expect(res.status).toBe(401);
  });

  it("allows any authenticated user to update status", async () => {
    const { token } = await registerUser({ email: "owner@example.com" });
    const { token: otherToken } = await registerUser({ email: "other@example.com" });
    const { job } = await createJob(token);

    const res = await api()
      .patch(`/api/jobs/${job._id}`)
      .set(authHeader(otherToken))
      .send({ status: "In Progress" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("In Progress");
  });

  it("returns 400 for an invalid status value", async () => {
    const { token } = await registerUser();
    const { job } = await createJob(token);

    const res = await api()
      .patch(`/api/jobs/${job._id}`)
      .set(authHeader(token))
      .send({ status: "Done" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });
});

describe("DELETE /api/jobs/:id", () => {
  it("returns 401 without authentication", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await api().delete(`/api/jobs/${id}`);

    expect(res.status).toBe(401);
  });

  it("returns 403 when a non-owner tries to delete", async () => {
    const { token } = await registerUser({ email: "owner@example.com" });
    const { token: otherToken } = await registerUser({ email: "other@example.com" });
    const { job } = await createJob(token);

    const res = await api().delete(`/api/jobs/${job._id}`).set(authHeader(otherToken));

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Only the creator can delete this request");
  });

  it("deletes the job when called by the owner", async () => {
    const { token } = await registerUser();
    const { job } = await createJob(token);

    const del = await api().delete(`/api/jobs/${job._id}`).set(authHeader(token));
    expect(del.status).toBe(204);

    const get = await api().get(`/api/jobs/${job._id}`);
    expect(get.status).toBe(404);
  });
});
