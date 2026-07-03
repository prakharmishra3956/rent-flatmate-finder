const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Listing = require("../models/Listing");
const Message = require("../models/Message");

describe("Chat API Tests", () => {
  let tenantToken;
  let ownerToken;
  let listingId;
  let tenantId;
  let ownerId;

  beforeEach(async () => {
    // 1. Register & Login Owner
    const ownerRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Owner Chat",
        email: "owner.chat@test.com",
        password: "password123",
        role: "owner",
      });

    const ownerLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "owner.chat@test.com", password: "password123" });

    ownerToken = `Bearer ${ownerLogin.body.token}`;
    ownerId = ownerLogin.body.user._id;

    // 2. Create Listing
    const listingRes = await request(app)
      .post("/api/listings")
      .set("Authorization", ownerToken)
      .send({
        title: "Chat Room Bedroom",
        description: "Great room for testing chats",
        rent: 900,
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
        name: "Tenant Chat",
        email: "tenant.chat@test.com",
        password: "password123",
        role: "tenant",
      });

    const tenantRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "tenant.chat@test.com", password: "password123" });

    tenantToken = `Bearer ${tenantRes.body.token}`;
    tenantId = tenantRes.body.user._id;

    // 4. Seed a message in the database
    await Message.create({
      sender: tenantId,
      recipient: ownerId,
      listing: listingId,
      content: "Hello! Is this room still available?",
    });
  });

  it("should allow tenant involved to retrieve chat messages history", async () => {
    const res = await request(app)
      .get(`/api/chats/${listingId}/${tenantId}`)
      .set("Authorization", tenantToken);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.messages.length).toBe(1);
    expect(res.body.messages[0].content).toBe("Hello! Is this room still available?");
  });

  it("should allow owner involved to retrieve chat messages history", async () => {
    const res = await request(app)
      .get(`/api/chats/${listingId}/${tenantId}`)
      .set("Authorization", ownerToken);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.messages.length).toBe(1);
    expect(res.body.messages[0].content).toBe("Hello! Is this room still available?");
  });

  it("should block non-related third-party users from accessing the conversation log", async () => {
    // Create an unrelated user
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Unrelated User",
        email: "unrelated@test.com",
        password: "password123",
        role: "tenant",
      });

    const unrelatedRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "unrelated@test.com", password: "password123" });

    const unrelatedToken = `Bearer ${unrelatedRes.body.token}`;

    const res = await request(app)
      .get(`/api/chats/${listingId}/${tenantId}`)
      .set("Authorization", unrelatedToken);

    expect(res.status).toBe(403);
  });
});
