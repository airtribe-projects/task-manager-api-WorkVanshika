const express = require("express");
const axios = require("axios");
const router = express.Router();
const usersModel = require("../models/usersModel");
const { validateJWT } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const saltRounds = 10;
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = "https://newsapi.org/v2/top-headlines";

router.use(express.json());

const validateInput = (fields, reqBody) => {
  const errors = [];
  fields.forEach(({ field, type, required, minLength, maxLength }) => {
    const value = reqBody[field];

    if (required && !value) {
      errors.push(`${field} is required`);
    } else if (value) {
      if (type === "string" && typeof value !== "string") {
        errors.push(`${field} must be a string`);
      }
      if (type === "array" && !Array.isArray(value)) {
        errors.push(`${field} must be an array`);
      }
      if (minLength && value.length < minLength) {
        errors.push(`${field} must be at least ${minLength} characters`);
      }
      if (maxLength && value.length > maxLength) {
        errors.push(`${field} must be at most ${maxLength} characters`);
      }
    }
  });
  return errors;
};

router.post("/", async (req, res) => {
  try {
    const validationErrors = validateInput(
      [
        { field: "name", type: "string", required: true },
        { field: "email", type: "string", required: true, maxLength: 50 },
        { field: "password", type: "string", required: true, minLength: 6 },
      ],
      req.body
    );

    if (validationErrors.length > 0) {
      return res.status(400).send({ errors: validationErrors });
    }

    const dbUser = await usersModel.findOne({ email: req.body.email });

    if (dbUser) {
      return res.status(409).send({ text: "Used email" });
    }

    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);

    usersModel
      .create(req.body)
      .then((dbUser) => {
        res.send(dbUser);
      })
      .catch((err) => {
        console.log("Error creating user", err);
        res.status(500).send({ text: "Error creating user" });
      });
  } catch (err) {
    console.error("Error in user creation:", err);
    res.status(500).send({ text: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const dbUser = await usersModel.findOne({ email: email });

  if (!dbUser) {
    return res.status(401).send({ text: "Invalid email" });
  }

  const isPasswordValid = bcrypt.compareSync(password, dbUser.password);

  if (!isPasswordValid) {
    return res.status(401).send({ text: "Invalid password" });
  }

  const resUser = {
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
  };

  const token = jwt.sign(resUser, JWT_SECRET, { expiresIn: "24h" });
  return res.send({ token });
});

router.get("/preferences", validateJWT, async (req, res) => {
  try {
    const user = await usersModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).send({ text: "User not found" });
    }
    res.send({ preferences: user.preferences });
  } catch (err) {
    console.error("Error retrieving preferences:", err);
    res.status(500).send({ text: "Error retrieving preferences" });
  }
});

router.put("/preferences", validateJWT, async (req, res) => {
  const { categories, languages } = req.body;
  const validationErrors = validateInput(
    [
      { field: "categories", type: "array", required: false },
      { field: "languages", type: "array", required: false },
    ],
    req.body
  );
  if (validationErrors.length > 0) {
    return res.status(400).send({ errors: validationErrors });
  }

  try {
    const user = await usersModel.findOneAndUpdate(
      { email: req.user.email },
      { preferences: { categories, languages } },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ text: "User not found" });
    }

    res.send({ preferences: user.preferences });
  } catch (err) {
    console.error("Error updating preferences:", err);
    res.status(500).send({ text: "Error updating preferences" });
  }
});

router.get("/news", validateJWT, async (req, res) => {
  try {
    // Fetch the user's preferences
    const user = await usersModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).send({ text: "User not found" });
    }

    const { categories, languages } = user.preferences;

    const params = {
      apiKey: NEWS_API_KEY,
      category: categories?.[0] || "general",
      language: languages?.[0] || "en",
    };

    const response = await axios.get(NEWS_API_URL, { params });

    res.send({ articles: response.data.articles });
  } catch (err) {
    console.error("Error fetching news articles:", err);
    res.status(500).send({ text: "Error fetching news articles" });
  }
});

module.exports = router;
