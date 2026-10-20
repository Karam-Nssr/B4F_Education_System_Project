import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = Number(process.env.PORT) || 5000;
async function startServer(): Promise<void> {
  await connectDB();

  app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("Failed to start server: ", error);
  process.exit(1);
});