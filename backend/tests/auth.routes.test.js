const { api, registerUser } = require("./helpers");

describe("POST /api/auth/register", () => {
  it("creates a user and returns a token", async () => {
    const { res, user } = await registerUser();

    expect(res.status).toBe(201);
    expect(res.body.token).toEqual(expect.any(String));
    expect(user).toMatchObject({
      email: "user@example.com",
      name: "Test User",
    });
    expect(user.id).toBeDefined();
  });

  it("returns 400 when email is invalid", async () => {
    const res = await api()
      .post("/api/auth/register")
      .send({ email: "not-an-email", password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
    expect(res.body.details).toEqual(expect.any(Array));
  });

  it("returns 400 when password is too short", async () => {
    const res = await api()
      .post("/api/auth/register")
      .send({ email: "short@example.com", password: "short" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("returns 409 when email is already registered", async () => {
    await registerUser();
    const res = await api()
      .post("/api/auth/register")
      .send({ email: "user@example.com", password: "password123" });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("Email already registered");
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await registerUser();
  });

  it("returns a token for valid credentials", async () => {
    const res = await api()
      .post("/api/auth/login")
      .send({ email: "user@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user.email).toBe("user@example.com");
  });

  it("returns 401 for wrong password", async () => {
    const res = await api()
      .post("/api/auth/login")
      .send({ email: "user@example.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid email or password");
  });

  it("returns 400 when email is missing", async () => {
    const res = await api().post("/api/auth/login").send({ password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });
});
