const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "StudyRoom API is running!"
  });
});

app.listen(PORT, () => {
  console.log(`StudyRoom server running at http://localhost:${PORT}`);
});