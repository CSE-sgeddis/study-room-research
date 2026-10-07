const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const rooms = [
  {
    id: 1,
    roomNumber: "101",
    location: "Main Library",
    capacity: 4,
  },
  {
    id: 2,
    roomNumber: "102",
    location: "Main Library",
    capacity: 6,
  },
  {
    id: 3,
    roomNumber: "201",
    location: "Science Library",
    capacity: 8,
  },
];

app.get("/", (req, res) => {
  res.json({
    message: "StudyRoom API is running!",
  });
});

app.get("/api/rooms", (req, res) => {
  res.json(rooms);
});

app.listen(PORT, () => {
  console.log(`StudyRoom server running at http://localhost:${PORT}`);
});