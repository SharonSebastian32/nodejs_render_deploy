const express = require("express");
const dotenv = require("dotenv");
const connectmongoDatabase = require("./config/db");

const protectedRoutes = require("./routes/protected");
const authRoutes = require("./routes/auth");
dotenv.config();
const app = express();

connectmongoDatabase();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
