const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const productRoute = require("./routes/product.route.js");
const fs = require("fs").promises;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// API routes
app.use("/api/products", productRoute);

// Root route for API health check
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Shopping List API" });
});

async function getPasswordFromJson() {
  try {
    const data = await fs.readFile("./password.json", "utf8");
    const jsonData = JSON.parse(data);
    return jsonData.password;
  } catch (error) {
    console.error("Error reading password file:", error);
    throw error;
  }
}

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

async function startServer() {
  try {
    const password = await getPasswordFromJson();

    await mongoose.connect(
      `mongodb+srv://johnnywizcord:${password}@backendproject.be0px.mongodb.net/?retryWrites=true&w=majority&appName=backendproject`
    );
    console.log("Connected to database");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Connection failed:", error);
  }
}

startServer();