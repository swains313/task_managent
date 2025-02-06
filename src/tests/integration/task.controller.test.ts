import request from "supertest";
import app from "../../app"; // Your Express app
import { connectMongoose } from "../../db-config/db.config";
import mongoose from "mongoose";

describe("Task API", () => {
  jest.setTimeout(30000);
  let superadminToken: string;
  let taskId: string;

  beforeAll(async () => {
    await connectMongoose();

    const superadminResponse = await request(app)
      .post("/api/v1/login")
      .send({ email: "admin@gmail.com", password: "admin@123" });

    if (superadminResponse.status !== 200) {
      console.error("Login failed", superadminResponse.body);
      throw new Error("Login failed, cannot retrieve token");
    }

    superadminToken = superadminResponse.body.data.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a new task", async () => {
    const newTask = {
      title: `Test Task ${Date.now()}`,
      description: "This is a test task",
      status: "pending",
      priority: "medium",
    };

    const response = await request(app)
      .post("/api/v1/task")
      .set("Authorization", `Bearer ${superadminToken}`)
      .send(newTask);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("_id");
    expect(response.body.data.title).toBe(newTask.title);
    taskId = response.body.data._id; // Save the taskId for later tests
  });

  it("should fetch all tasks", async () => {
    const response = await request(app)
      .get("/api/v1/task")
      .set("Authorization", `Bearer ${superadminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true); 
  });

  it("should fetch a task by ID", async () => {
    const response = await request(app)
      .get(`/api/v1/task/${taskId}`)
      .set("Authorization", `Bearer ${superadminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("_id", taskId); 
  });

  it("should update a task by ID", async () => {
    const updatedTask = {
      title: `Updated Task ${Date.now()}`,
      status: "completed",
    };

    const response = await request(app)
      .put(`/api/v1/task/${taskId}`)
      .set("Authorization", `Bearer ${superadminToken}`)
      .send(updatedTask);

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe(updatedTask.title);
    expect(response.body.data.status).toBe(updatedTask.status); // Ensure task is updated
  });

  it("should delete a task by ID", async () => {
    const response = await request(app)
      .delete(`/api/v1/task/${taskId}`)
      .set("Authorization", `Bearer ${superadminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Task deleted successfully");
  });
});
