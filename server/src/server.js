const app = require("./app");
const connectDb = require("./config/db");

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  throw new Error("Missing required environment variables");
}

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
