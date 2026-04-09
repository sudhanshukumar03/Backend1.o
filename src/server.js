import dotenv from "dotenv";

dotenv.config();

/*
import dotenv from "dotenv";
dotenv.config(); // ✅ MUST be first
*/

import connectDB from "./config/db.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed ❌", error);
  });
//.then(() => {
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
// .catch((error) => {
//   console.error('DB Connection Error:', error.message);
//   process.exit(1);
// });
