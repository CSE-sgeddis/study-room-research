const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "studyroom",
  password: "mf9swqsfQ$$",
  port: 5432,
});

app.get("/", (req, res) => {
  res.json({
    message: "StudyRoom API is running!",
  });
});

app.get("/api/rooms", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        rooms.id,
        rooms.room_number AS "roomNumber",
        locations.name AS location,
        rooms.capacity
      FROM rooms
      JOIN locations
        ON rooms.location_id = locations.id
      ORDER BY rooms.id;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Unable to retrieve rooms from the database.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`StudyRoom server running at http://localhost:${PORT}`);
});