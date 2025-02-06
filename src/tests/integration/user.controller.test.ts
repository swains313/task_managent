import request from "supertest";
import app from "../../app";
import { connectMongoose } from "../../db-config/db.config";
import mongoose from "mongoose";

describe("User API", () => {
  jest.setTimeout(30000);
  const uniqueEmail = `testuser${Date.now()}@domain.com`;
  let user: any
  let superadminToken: string;

  beforeAll(async () => {
    await connectMongoose()
    const superadminResponse = await request(app)
      .post("/api/v1/login")
      .send({ email: "admin@gmail.com", password: "admin@123" });

    if (superadminResponse.status !== 200) {
      console.error("Login failed", superadminResponse.body);
      throw new Error("Login failed, cannot retrieve token");
    }

    superadminToken = superadminResponse.body.data.token;
  });


  it("should create a new user", async () => {
    const userData = { email: uniqueEmail, password: "password123", role: "user" };

    const response: any = await request(app)
      .post("/api/v1/user")
      .set("Authorization", `Bearer ${superadminToken}`)
      .send(userData);
    user = response.body.data
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
    expect(response.body.data.email).toBe(userData.email);
    expect(response.body.data.role).toBe(userData.role);
  });

  it("should login the user and return a JWT token", async () => {
    const userData = { email: uniqueEmail, password: "password123" };

    await request(app)
      .post("/api/v1/user")
      .send({ email: uniqueEmail, password: "password123", role: "user" });

    const response = await request(app)
      .post("/api/v1/login")
      .send(userData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User login successfully");
    expect(response.body.data.token).toBeDefined();
  });

  it("should return an error for invalid login credentials", async () => {
    const wrongEmailData = { email: "nonexistent@domain.com", password: "password123" };

    const nonexistentUserResponse = await request(app)
      .post("/api/v1/login")
      .send(wrongEmailData);

    expect(nonexistentUserResponse.status).toBe(404);
    expect(nonexistentUserResponse.body.message).toBe("Invalid credentials");

    const wrongPasswordData = { email: "testuser@domain.com", password: "wrongpassword" };

    const incorrectPasswordResponse = await request(app)
      .post("/api/v1/login")
      .send(wrongPasswordData);

    expect(incorrectPasswordResponse.status).toBe(401);
    expect(incorrectPasswordResponse.body.message).toBe("Invalid credentials");
  });

  it("should return all users", async () => {
    const loginResponse = await request(app)
      .post("/api/v1/login")
      .send({ email: uniqueEmail, password: "password123" });

    const token = loginResponse.body.data.token;

    const response = await request(app)
      .get("/api/v1/user")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true); // Check if it's an array
  });

  it("should return a user by ID", async () => {
    const loginResponse = await request(app)
      .post("/api/v1/login")
      .send({ email: "testuser@domain.com", password: "password123" });

    const token = loginResponse.body.data.token;

    // Assuming the user created earlier has ID '1'
    const response = await request(app)
      .get("/api/v1/user/" + loginResponse.body.data.user._id)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data._id).toBe(loginResponse.body.data.user._id);
  });

  it("should update a user by ID", async () => {
    const loginResponse = await request(app)
      .post("/api/v1/login")
      .send({ email: "admin@gmail.com", password: "admin@123" });
    const token = loginResponse.body.data.token;
    const updatedData = { email: `testuser${Date.now()}@domain.com` };

    const response = await request(app)
      .put("/api/v1/user/" + user._id)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe(updatedData.email);

  });

  it("should delete a user by ID", async () => {
    const loginResponse = await request(app)
      .post("/api/v1/login")
      .send({ email: "testuser@domain.com", password: "password123" });

    const token = loginResponse.body.data.token;

    const response = await request(app)
      .delete("/api/v1/user/" + user._id)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted successfully");
  });

  afterAll(async()=>{
      await mongoose.connection.close();
  })
});
