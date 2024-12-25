// Write a script that:
// 1. Connects to MongoDB.
// 2. Creates the 'users' collection.
// 3. Adds new users.
// 4. Finds users with duplicate emails.

// Use Mongoose library

import mongoose, { Schema, Document } from "mongoose";

type UserWithDuplicateEmail = {
  email: string;
};

interface User extends Document {
  name: string;
  email: string;
}

async function handleUserData(): Promise<UserWithDuplicateEmail[]> {
  await mongoose.connect("mongodb://localhost:27017/mydatabase");

  const userSchema = new Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  });

  const UserModel = mongoose.model<User>("User", userSchema);

  const sampleUsers = [
    new UserModel({ name: "Alice Brown", email: "alice@example.com" }),
    new UserModel({ name: "Bob White", email: "bob@example.com" }),
    new UserModel({ name: "Alice Brown", email: "alice@example.com" }),
  ];

  try {
    await UserModel.insertMany(sampleUsers);
  } catch (error) {
    console.error("Error while adding users:", error);
  }

  const duplicateEmails = await UserModel.aggregate([
    { $group: { _id: "$email", count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
    { $project: { email: "$_id", _id: 0 } },
  ]);

  console.log("Users with duplicate emails:", duplicateEmails);

  await mongoose.disconnect();

  return duplicateEmails;
}

module.exports = { handleUserData };
