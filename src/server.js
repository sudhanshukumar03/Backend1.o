import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { error } from 'node:console';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

connectDB();

app.get('/', (req, res) => {
  res.send('MongoDB connected 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//.then(() => {
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
// .catch((error) => {
//   console.error('DB Connection Error:', error.message);
//   process.exit(1);
// });
