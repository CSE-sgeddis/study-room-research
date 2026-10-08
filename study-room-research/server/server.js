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

app.post("/api/rooms", async (req, res) => {
  const { roomNumber, locationId, capacity } = req.body;

  if (!roomNumber || !locationId || !capacity) {
    return res.status(400).json({
      error: "Room number, location, and capacity are required.",
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO rooms (location_id, room_number, capacity)
      VALUES ($1, $2, $3)
      RETURNING id, room_number AS "roomNumber", location_id AS "locationId", capacity;
      `,
      [locationId, roomNumber, capacity]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Unable to create room.",
    });
  }
});

app.delete("/api/rooms/:id", async (req, res) => {
  const roomId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM rooms WHERE id = $1 RETURNING id;",
      [roomId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Room not found.",
      });
    }

    res.json({
      message: "Room deleted successfully.",
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Unable to delete room.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`StudyRoom server running at http://localhost:${PORT}`);
});