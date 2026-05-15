require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDb } = require("../src/config/db");
const User = require("../src/models/User");
const JobRequest = require("../src/models/JobRequest");

const samples = [
  {
    title: "Leaking kitchen tap",
    description: "Kitchen mixer tap drips constantly. Need someone in the west end.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "Alex Homeowner",
    contactEmail: "alex.example@mail.com",
    status: "Open",
  },
  {
    title: "Outdoor socket install",
    description: "Want a weatherproof socket fitted next to the patio.",
    category: "Electrical",
    location: "Edinburgh",
    contactName: "Jamie Lee",
    contactEmail: "jamie.example@mail.com",
    status: "In Progress",
  },
  {
    title: "Hallway repaint",
    description: "Two-bed flat, hallway and stairs need fresh emulsion.",
    category: "Painting",
    location: "Glasgow",
    contactName: "Sam Taylor",
    contactEmail: "sam.example@mail.com",
    status: "Open",
  },
  {
    title: "Interior door sticking",
    description: "Bedroom door rubs on the frame, needs planing or hinge adjust.",
    category: "Joinery",
    location: "Paisley",
    contactName: "Riley Morgan",
    contactEmail: "riley.example@mail.com",
    status: "Closed",
  },
  {
    title: "Boiler pressure low",
    description: "Combi boiler showing low pressure error. Bleed radiators already tried.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "Casey Brown",
    contactEmail: "casey.example@mail.com",
    status: "Open",
  },
];

async function run() {
  await connectDb();
  const email = "seed@example.com";
  let user = await User.findOne({ email });
  if (!user) {
    const passwordHash = await bcrypt.hash("password123", 10);
    user = await User.create({ email, passwordHash, name: "Seed User" });
    // eslint-disable-next-line no-console
    console.log("Created seed user:", email, "/ password123");
  }
  const count = await JobRequest.countDocuments();
  if (count > 0) {
    // eslint-disable-next-line no-console
    console.log("jobRequests already has documents; skipping job insert.");
  } else {
    await JobRequest.insertMany(
      samples.map((j) => ({ ...j, createdBy: user._id }))
    );
    // eslint-disable-next-line no-console
    console.log(`Inserted ${samples.length} sample jobs.`);
  }
  process.exit(0);
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
