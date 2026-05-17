import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/products", async (req, res) => {
  try {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch API" });
  }
});

app.get("/", (req, res) => {
  res.send("Server işləyir 🚀2");
});

app.listen(5000, () => {
  console.log("Server işləyir 🚀2");
});