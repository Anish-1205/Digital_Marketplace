const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
const entrepreneurRoutes = require("./routes/entrepreneurs");
const productRoutes = require("./routes/products");
const serviceRequestRoutes = require("./routes/serviceRequests");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");
const adminRoutes = require("./routes/admin");
const authRateLimit = require("./middleware/rateLimit");
const { notFound, errorHandler } = require("./middleware/error");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-vercel-app-url.vercel.app"],
    credentials: true
  })
);
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.json({ message: "HunarHub API running" });
});

app.use("/api/auth", authRateLimit, authRoutes);
app.use("/api/entrepreneurs", entrepreneurRoutes);
app.use("/api/products", productRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
