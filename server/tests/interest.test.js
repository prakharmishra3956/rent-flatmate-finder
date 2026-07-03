const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Listing = require("../models/Listing");
const Interest = require("../models/Interest");
const TenantProfile = require("../models/TenantProfile");

describe("Interest Request API Tests", () => {
  let tenantToken;
  let ownerToken;
  let listingId;
  let interestId;

  beforeEach(async () => {
    // 1. Register & Login Owner
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Owner Interest",
        email: "owner.int@test.com",
        password: "password123",
        role: "owner",
      });

    const ownerRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "owner.int@test.com", password: "password123" });

    ownerToken = `Bearer ${ownerRes.body.token}`;

    // 2. Create Listing
    const listingRes = await request(app)
      .post("/api/listings")
      .set("Authorization", ownerToken)
      .send({
        title: "Large Loft in Downtown",
        description: "Great room in central location",
        rent: 1100,
        address: "123 Main St, Downtown",
        location: "Downtown",
        roomType: "Single",
        furnishing: "Furnished",
        amenities: ["WiFi"],
        availableFrom: "2026-08-01",
        genderPreference: "Any",
        occupancy: 1,
      });

    listingId = listingRes.body.listing._id;

    // 3. Register & Login Tenant
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Tenant Interest",
        email: "tenant.int@test.com",
        password: "password123",
        role: "tenant",
      });

    const tenantRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "tenant.int@test.com", password: "password123" });

    tenantToken = `Bearer ${tenantRes.body.token}`;
    
    // Express initial interest in the room for secondary tests that expect it
    const initInterestRes = await request(app)
      .post("/api/interests")
      .set("Authorization", tenantToken)
      .send({
        listingId,
        message: "Hi, I am interested!",
      });
      
    interestId = initInterestRes.body.interest?._id;
  });

  it("should allow tenant to express interest in listing", async () => {
    // Clean database first for clean assertion
    await Interest.deleteMany({});
    
    const res = await request(app)
      .post("/api/interests")
      .set("Authorization", tenantToken)
      .send({
        listingId,
        message: "Hi, I am interested!",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.interest.status).toBe("Pending");
    expect(res.body.interest.message).toBe("Hi, I am interested!");
  });

  it("should prevent double applications by the same tenant to the same room", async () => {
    const res = await request(app)
      .post("/api/interests")
      .set("Authorization", tenantToken)
      .send({
        listingId,
        message: "Applying again",
      });

    expect(res.status).toBe(400);
  });

  it("should retrieve sent interest applications for tenant", async () => {
    const res = await request(app)
      .get("/api/interests/tenant")
      .set("Authorization", tenantToken);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.interests.length).toBe(1);
    expect(res.body.interests[0].message).toBe("Hi, I am interested!");
  });

  it("should retrieve received interest applications for owner", async () => {
    const res = await request(app)
      .get("/api/interests/owner")
      .set("Authorization", ownerToken);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.interests.length).toBe(1);
    expect(res.body.interests[0].message).toBe("Hi, I am interested!");
  });

  it("should allow owner to accept interest request", async () => {
    const res = await request(app)
      .patch(`/api/interests/${interestId}/status`)
      .set("Authorization", ownerToken)
      .send({ status: "Accepted" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.interest.status).toBe("Accepted");
  });
});
