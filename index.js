const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product.model.js");
const productRoute = require("./routes/product.route.js");
const { restart } = require("nodemon");
const fs = require("fs").promises;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.use("/api/products", productRoute);

app.get("/", (req, res) => {
  res.send("HELLO IT'S WORKING");
});

async function startServer() {
  try {
    const password = await getPasswordFromJson();

    await mongoose.connect(
      `mongodb+srv://johnnywizcord:${password}@backendproject.be0px.mongodb.net/?retryWrites=true&w=majority&appName=backendproject`
    );
    console.log("Connected to database");

    app.listen(3000, () => {
      console.log("Application running on port 3000");
    });
  } catch (error) {
    console.log("Connection failed:", error);
  }
}

startServer();
