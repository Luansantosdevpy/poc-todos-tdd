const mongoose = require("mongoose");
const { connect } = require("../../mongodb/mongodb.connect");

describe("MongoDB Connection", () => {
  it("should log an error when connection fails", async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();

    mongoose.connect = jest.fn().mockImplementation(() => {
      throw new Error("Connection failed");
    });

    await connect();

    expect(console.error).toHaveBeenCalledWith("Error connection to mongodb");
    expect(console.error).toHaveBeenCalledWith(expect.any(Error));

    console.error = originalConsoleError;
  });
});
