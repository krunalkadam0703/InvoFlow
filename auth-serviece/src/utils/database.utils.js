import prisma from "../config/database.config";

// Test DB connection
export const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected ✅");
  } catch (error) {
    console.error("Database connection failed ❌", error);
    throw error;
  }
};

// Initialize DB (call testConnection)
export const initializeDb = async () => {
  try {
    await testConnection(); // must call the function
  } catch (error) {
    throw error;
  }
};

// Disconnect DB
export const disconnectDb = async () => {
  try {
    await prisma.$disconnect(); // correct spelling: $disconnect
    console.log("Database disconnected ✅");
  } catch (error) {
    console.error("Database disconnection failed ❌", error);
  }
};
