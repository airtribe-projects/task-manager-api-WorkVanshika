require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./routes/usersRoute");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/v1/users", usersRouter);
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log("Server started on port", PORT);
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

module.exports = app;
