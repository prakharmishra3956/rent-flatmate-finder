const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

describe("Auth Endpoints", () => {
  const testUser = {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "owner",
  };

  test("POST /api/auth/register - Should register a new user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User Registered");

    const userInDb = await User.findOne({ email: testUser.email });
    expect(userInDb).toBeDefined();
    expect(userInDb.name).toBe(testUser.name);
    expect(userInDb.role).toBe(testUser.role);
  });

  test("POST /api/auth/register - Should fail if user already exists", async () => {
    // Create user first
    await request(app)
      .post("/api/auth/register")
      .send(testUser);

    // Try creating duplicate
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  test("POST /api/auth/login - Should log in and return a JWT token", async () => {
    // Register
    await request(app)
      .post("/api/auth/register")
      .send(testUser);

    // Login
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(testUser.email);
  });

  test("POST /api/auth/login - Should fail with invalid credentials", async () => {
    // Try logging in non-existent user
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "nonexistent@example.com",
        password: "wrongpassword",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid Credentials");
  });
});
