const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Listing = require("../models/Listing");

describe("Dashboard Endpoints", () => {
  let ownerToken;
  let tenantToken;

  const validListing = {
    title: "Flat in City",
    description: "Good view.",
    location: "City Center",
    address: "456 City Rd",
    rent: 900,
    securityDeposit: 450,
    availableFrom: "2026-08-01",
    roomType: "Double",
    furnishing: "Semi Furnished",
  };

  beforeEach(async () => {
    await User.deleteMany({});
    await Listing.deleteMany({});

    // Register & Login Owner
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "David Owner",
        email: "david@example.com",
        password: "password123",
        role: "owner",
      });
    
    const ownerLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "david@example.com",
        password: "password123",
      });
    
    ownerToken = `Bearer ${ownerLogin.body.token}`;

    // Register & Login Tenant
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Emma Tenant",
        email: "emma@example.com",
        password: "password123",
        role: "tenant",
      });

    const tenantLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "emma@example.com",
        password: "password123",
      });
    
    tenantToken = `Bearer ${tenantLogin.body.token}`;
  });

  test("GET /api/dashboard/owner - Should fail if unauthorized (no token)", async () => {
    const res = await request(app).get("/api/dashboard/owner");
    expect(res.statusCode).toBe(401);
  });

  test("GET /api/dashboard/owner - Should fail if user is tenant", async () => {
    const res = await request(app)
      .get("/api/dashboard/owner")
      .set("Authorization", tenantToken);
    expect(res.statusCode).toBe(403);
  });

  test("GET /api/dashboard/owner - Should return correct stats for owner", async () => {
    // 1. Create a listing (starts as Available by default)
    const listingRes = await request(app)
      .post("/api/listings")
      .set("Authorization", ownerToken)
      .send(validListing);

    // 2. Create another listing
    const listing2Res = await request(app)
      .post("/api/listings")
      .set("Authorization", ownerToken)
      .send({
        ...validListing,
        title: "Second Flat",
      });

    // 3. Mark the second listing as filled
    const id = listing2Res.body.listing._id;
    await request(app)
      .patch(`/api/listings/${id}/fill`)
      .set("Authorization", ownerToken);

    // 4. Fetch dashboard stats
    const res = await request(app)
      .get("/api/dashboard/owner")
      .set("Authorization", ownerToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats.total).toBe(2);
    expect(res.body.stats.available).toBe(1);
    expect(res.body.stats.filled).toBe(1);
    expect(res.body.stats.requests).toBe(0);
  });
});
