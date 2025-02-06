
import bcryptjs from "bcryptjs";
import UserModel from "../../model/User";
import { UserService } from "../../services/user.service";

jest.mock("../../model/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));


describe("UserService", () => {
  jest.setTimeout(30000);

  beforeEach(() => {
    jest.clearAllMocks();
  });
  let userService: UserService;

  beforeAll(() => {
    userService = new UserService();
  });


  it("should create a new user", async () => {
    const userData = { email: "test@domain.com", password: "password123", role: "user" };

    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    (bcryptjs.hash as jest.Mock).mockResolvedValue("hashedPassword123");

    (UserModel.create as jest.Mock).mockResolvedValue({ ...userData, password: "hashedPassword123", _id: "123" });

    const result = await userService.createUser(userData);

    expect(result.email).toBe(userData.email);
    expect(result.password).toBe("hashedPassword123");
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: userData.email });
    expect(UserModel.create).toHaveBeenCalledWith({ ...userData, password: "hashedPassword123" });
  });

  it("should throw an error if the user already exists", async () => {
    const userData = { email: "existing@domain.com", password: "password123", role: "user" };

    (UserModel.findOne as jest.Mock).mockResolvedValue({ email: "existing@domain.com" });

    await expect(userService.createUser(userData)).rejects.toThrowError("User already exist with email existing@domain.com");
  });

  it("should return a user by ID", async () => {
    const userId = "123";
    const mockUser = { _id: "123", email: "user@domain.com", role: "user", password: "hashedPassword123" };
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
    const result = await userService.getUserById(userId);
    expect(result).toEqual(mockUser);
    expect(UserModel.findById).toHaveBeenCalledWith(userId);
  });

  it("should throw an error if user is not found by ID", async () => {
    const userId = "123";
    (UserModel.findById as jest.Mock).mockResolvedValue({
      select: jest.fn().mockReturnThis(),  // Mock the `select` method to return the same object
    });
    (UserModel.findById as jest.Mock).mockResolvedValue(null);
    await expect(userService.getUserById(userId)).rejects.toThrowError("User not found");
    expect(UserModel.findById).toHaveBeenCalledWith(userId);
  });

  it("should delete a user by ID", async () => {
    const userId = "123";
    const mockDeletedUser = { _id: "123", email: "user@domain.com", role: "user", password: "hashedPassword123" };
    (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDeletedUser);
    const result = await userService.deleteUserById(userId);
    expect(result).toEqual(mockDeletedUser);
    expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
  });

  it("should throw an error if user is not found by ID", async () => {
    const userId = "123";
    (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
    await expect(userService.deleteUserById(userId)).rejects.toThrowError("User not found");
    expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
  });





});

