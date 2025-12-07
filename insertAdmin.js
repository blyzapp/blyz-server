import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://Blyzapp_Admin:Audrey0228!}’@blyzapp.f1ttxsz.mongodb.net/blyz?retryWrites=true&w=majority";

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  name: String
});

const User = mongoose.model("User", UserSchema);

async function run() {
  await mongoose.connect(MONGO_URI);

  await User.insertMany([
    {
      email: "admin@blyzapp.com",
      password: "$2a$10$KqXNc.Z/xV1n9jT0ffzKnOKrFhFtUQkFpRCANhAbP8Q8aFV42whXi",
      role: "admin",
      name: "Blyz Admin"
    }
  ]);

  console.log("Admin user inserted into Atlas!");
  process.exit();
}

run().catch(err => console.error(err));
