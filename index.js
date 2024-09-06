const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const logger = require("./logger");
const connectDB = require("./db");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const adminRoute = require("./routes/adminRoute");

// Load environment variables from .env file
dotenv.config();

const morganFormat = ":method :url :status :response-time ms";
const app = express();
const port = process.env.PORT || 8000;

// Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Connect database
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send({ message: "Inventory management application backend server." });
});

app.use("/api", userRoute);

app.use("/api", productRoute);

app.use("/api", orderRoute);

app.use("/api", adminRoute);

// Not found route
app.use((req, res, next) => {
  next({ status: 404, message: "Page not found." });
});

// Error boundary
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err);
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
