import express from 'express';
import { ENV } from './src/config/env.js';
import { connectDB } from './src/config/db.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { inngest, functions } from './src/config/inngest.js';

const app = express();

app.use(express.json());
app.use(clerkMiddleware());

// Correct Inngest v3 usage
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get('/', (req, res) => {
  res.send("hello this is home page");
});

const startServer = async () => {
  try {
    await connectDB();
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => {
        console.log("Server started on port:", ENV.PORT);
      });
    }
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit the process with a failure code
  }
};

startServer();

export default app;
