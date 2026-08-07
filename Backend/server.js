import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

const jokes = [
  {
    id: 1,
    title: "Programming Joke",
    content: "Why do programmers prefer dark mode? Because light attracts bugs."
  },
  {
    id: 2,
    title: "JavaScript Joke",
    content: "Why was JavaScript sad? Because it didn't know how to 'null' its feelings."
  },
  {
    id: 3,
    title: "React Joke",
    content: "React developers never get lost—they always follow the Router."
  }
];

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/api/jokes", (req, res) => {
  res.json(jokes);
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});