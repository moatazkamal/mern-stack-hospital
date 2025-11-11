// backends/server.js
import app from "./app.js";
import { config } from "dotenv";

config({ path: "./config/config.env" });

// Use env if set; otherwise default to 3000 (nice for Prometheus scraping)
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

