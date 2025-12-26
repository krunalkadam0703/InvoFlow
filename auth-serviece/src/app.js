import express 
 from "express";

const app = express();

// Middleware
app.use(express.json());

// Health check route
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "auth-service",
    timestamp: new Date().toISOString(),
  });
});

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Auth service running on port ${PORT}`);
});
