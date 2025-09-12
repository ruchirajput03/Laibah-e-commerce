require("dotenv").config();
const express      = require("express");
const cookieParser = require("cookie-parser");
const cors         = require("cors");
const db           = require("./config/db");
const app          = express();
const PORT         = process.env.PORT || 8080;
const path = require("path")
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(req.method, req.path, req.body);
  next();
});
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


const orderRoutes = require("./Routes/order");
app.use("/api/orders", orderRoutes);

const contactRoutes = require('./Routes/contactRoutes');
app.use('/api', contactRoutes);


const authRoutes = require("./Routes/auth");
app.use("/api/auth", authRoutes);

const adminRoutes= require("./Routes/adminRoutes");
app.use("/api/admin",adminRoutes);

const productRoutes = require("./Routes/productRoutes");
app.use("/api/products", productRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const paymentRoutes = require('./Routes/paymentRoutes');
app.use('/api', paymentRoutes);



app.listen(PORT, "0.0.0.0", async () => {
  await db();

  console.log(`Server running on port ${PORT}`);
});
