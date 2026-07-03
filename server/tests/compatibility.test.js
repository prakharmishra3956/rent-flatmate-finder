const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Listing = require("../models/Listing");
const TenantProfile = require("../models/TenantProfile");
const Compatibility = require("../models/Compatibility");

describe("AI Compatibility API Tests", () => {
  let tenantToken;
  let ownerToken;
  let listingId;
  let tenantId;

  beforeEach(async () => {
    // 1. Register & Login Owner
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Owner Test",
        email: "owner.comp@test.com",
        password: "password123",
        role: "owner",
      });

    const ownerRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "owner.comp@test.com", password: "password123" });

    ownerToken = `Bearer ${ownerRes.body.token}`;

    // 2. Create Listing
    const listingRes = await request(app)
      .post("/api/listings")
      .set("Authorization", ownerToken)
      .send({
        title: "Cozy Bedroom in Downtown",
        description: "Great room in central location",
        rent: 1000,
        address: "123 Main St, Downtown",
        location: "Downtown",
        roomType: "Single",
        furnishing: "Furnished",
        amenities: ["WiFi", "AC"],
        availableFrom: "2026-08-01",
        genderPreference: "Any",
        occupancy: 1,
      });

    listingId = listingRes.body.listing._id;

    // 3. Register & Login Tenant
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Tenant Test",
        email: "tenant.comp@test.com",
        password: "password123",
        role: "tenant",
      });

    const tenantRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "tenant.comp@test.com", password: "password123" });

    tenantToken = `Bearer ${tenantRes.body.token}`;
    tenantId = tenantRes.body.user._id;

    // 4. Create Tenant Profile
    await request(app)
      .post("/api/tenant/profile")
      .set("Authorization", tenantToken)
      .send({
        preferredLocation: "Downtown",
        budgetMin: 800,
        budgetMax: 1200,
        moveInDate: "2026-08-01",
        preferredRoomType: "Single",
        preferredAmenities: ["WiFi"],
      });
  });

  it("should calculate and cache compatibility score for tenant", async () => {
    const res = await request(app)
      .get(`/api/tenant/compatibility/${listingId}`)
      .set("Authorization", tenantToken);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.compatibility).toHaveProperty("score");
    expect(res.body.compatibility).toHaveProperty("explanation");
    expect(res.body.compatibility.tenant).toBe(tenantId);
    expect(res.body.compatibility.listing).toBe(listingId);

    // Verify it is saved in DB
    const dbComp = await Compatibility.findOne({ tenant: tenantId, listing: listingId });
    expect(dbComp).not.toBeNull();
    expect(dbComp.score).toBe(res.body.compatibility.score);
  });

  it("should fail to fetch compatibility for non-tenant users", async () => {
    const res = await request(app)
      .get(`/api/tenant/compatibility/${listingId}`)
      .set("Authorization", ownerToken);

    expect(res.status).toBe(403);
  });
});
