const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Listing = require("../models/Listing");

describe("Listing Endpoints", () => {
  let ownerToken;
  let tenantToken;
  let ownerId;
  let tenantId;
  let createdListingId;

  const validListing = {
    title: "Beautiful Room in Downtown",
    description: "Spacious master bedroom with private bath.",
    location: "Downtown",
    address: "123 Main St, Metro City",
    rent: 1200,
    securityDeposit: 600,
    availableFrom: "2026-08-01",
    roomType: "Single",
    furnishing: "Furnished",
  };

  beforeEach(async () => {
    // Clean up
    await User.deleteMany({});
    await Listing.deleteMany({});

    // Register & Login Owner
    const ownerRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Alice Owner",
        email: "alice@example.com",
        password: "password123",
        role: "owner",
      });
    
    const ownerLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "alice@example.com",
        password: "password123",
      });
    
    ownerToken = `Bearer ${ownerLogin.body.token}`;
    ownerId = ownerLogin.body.user._id;

    // Register & Login Tenant
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Bob Tenant",
        email: "bob@example.com",
        password: "password123",
        role: "tenant",
      });

    const tenantLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "bob@example.com",
        password: "password123",
      });
    
    tenantToken = `Bearer ${tenantLogin.body.token}`;
    tenantId = tenantLogin.body.user._id;
  });

  test("POST /api/listings - Should fail if unauthorized (no token)", async () => {
    const res = await request(app)
      .post("/api/listings")
      .send(validListing);

    expect(res.statusCode).toBe(401);
  });

  test("POST /api/listings - Should fail if role is tenant", async () => {
    const res = await request(app)
      .post("/api/listings")
      .set("Authorization", tenantToken)
      .send(validListing);

    expect(res.statusCode).toBe(403);
  });

  test("POST /api/listings - Should succeed if role is owner and valid fields", async () => {
    const res = await request(app)
      .post("/api/listings")
      .set("Authorization", ownerToken)
      .send(validListing);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.listing.title).toBe(validListing.title);
    expect(res.body.listing.owner).toBe(ownerId);
    
    createdListingId = res.body.listing._id;
  });

  test("GET /api/listings - Should retrieve all available public listings", async () => {
    // Create one listing
    await request(app)
      .post("/api/listings")
      .set("Authorization", ownerToken)
      .send(validListing);

    const res = await request(app).get("/api/listings");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.listings.length).toBe(1);
    expect(res.body.listings[0].title).toBe(validListing.title);
  });

  test("GET /api/listings/my - Should retrieve owner's own listings", async () => {
    // Create one listing
    await request(app)
      .post("/api/listings")
      .set("Authorization", ownerToken)
      .send(validListing);

    const res = await request(app)
      .get("/api/listings/my")
      .set("Authorization", ownerToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.listings.length).toBe(1);
  });

  test("PUT /api/listings/:id - Should update listing if user is owner", async () => {
    // Create listing
    const createRes = await request(app)
      .post("/api/listings")
      .set("Authorization", ownerToken)
      .send(validListing);
    
    const id = createRes.body.listing._id;

    const res = await request(app)
      .put(`/api/listings/${id}`)
      .set("Authorization", ownerToken)
      .send({
        title: "Updated Luxury Penthouse",
        rent: 2000,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.listing.title).toBe("Updated Luxury Penthouse");
    expect(res.body.listing.rent).toBe(2000);
  });

  test("PUT /api/listings/:id - Should fail update if user is NOT owner", async () => {
    // Create listing
    const createRes = await request(app)
      .post("/api/listings")
      .set("Authorization", ownerToken)
      .send(validListing);
    
    const id = createRes.body.listing._id;

    // Login a second owner
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Charlie Second Owner",
        email: "charlie@example.com",
        password: "password123",
        role: "owner",
      });

    const secondLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "charlie@example.com",
        password: "password123",
      });
    
    const secondOwnerToken = `Bearer ${secondLogin.body.token}`;

    const res = await request(app)
      .put(`/api/listings/${id}`)
      .set("Authorization", secondOwnerToken)
      .send({
        title: "Sneaky Update Attempt",
      });

    expect(res.statusCode).toBe(403);
  });

  test("DELETE /api/listings/:id - Should delete listing if user is owner", async () => {
    const createRes = await request(app)
      .post("/api/listings")
      .set("Authorization", ownerToken)
      .send(validListing);
    
    const id = createRes.body.listing._id;

    const res = await request(app)
      .delete(`/api/listings/${id}`)
      .set("Authorization", ownerToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Listing deleted");

    const dbListing = await Listing.findById(id);
    expect(dbListing).toBeNull();
  });
});
