const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product.model.js");
const fs = require("fs").promises;
const app = express();


app.use(express.json());

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

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.post('/api/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
