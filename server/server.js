require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 8080;

// ---------- Stripe Webhook (must come before express.json) ----------
const webhookRoutes = require("./Routes/webHook");
app.use("/api/webhooks", webhookRoutes);

// ---------- Middleware ----------
app.use(express.json()); // for normal JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Logger (for debugging)
app.use((req, res, next) => {
  console.log(req.method, req.path, req.body);
  next();
});

// ---------- Routes ----------
const paymentRoutes = require("./Routes/paymentRoutes");
app.use("/api/payments", paymentRoutes);

const orderRoutes = require("./Routes/order");
app.use("/api/orders", orderRoutes);

const contactRoutes = require("./Routes/contactRoutes");
app.use("/api", contactRoutes);

const authRoutes = require("./Routes/auth");
app.use("/api/auth", authRoutes);

const adminRoutes = require("./Routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const productRoutes = require("./Routes/productRoutes");
app.use("/api/products", productRoutes);

// ---------- Static Files ----------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- Start Server ----------
app.listen(PORT, "0.0.0.0", async () => {
  await db();
  console.log(`Server running on port ${PORT}`);
});
