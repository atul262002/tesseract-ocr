// app.js
const express = require("express");
const ocrRoutes = require("./routes/ocrRoutes");

const app = express();
const port = 8000;

// Middleware for handling JSON requests
app.use(express.json({ limit: "10mb" }));

// Use the OCR routes
app.use("/api", ocrRoutes);

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
