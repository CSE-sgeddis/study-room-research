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
  const { date, startTime, duration, capacity } = req.query;

  try {
    let query = `
      SELECT
        rooms.id,
        rooms.room_number AS "roomNumber",
        locations.name AS location,
        rooms.capacity
      FROM rooms
      JOIN locations
        ON rooms.location_id = locations.id
    `;

    const values = [];

    if (date && startTime && duration && capacity) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(
        start.getTime() + Number(duration) * 60 * 60 * 1000
      );

      const endTime = end.toTimeString().slice(0, 5);

      values.push(date, startTime, endTime, Number(capacity));

      query += `
        WHERE rooms.capacity >= $4
          AND rooms.id NOT IN (
            SELECT room_id
            FROM reservations
            WHERE reservation_date = $1
              AND start_time < $3
              AND end_time > $2
          )
      `;
    }

    query += `
      ORDER BY rooms.id;
    `;

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      error: "Unable to retrieve available rooms.",
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

app.get("/api/reservations", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        reservations.id,
        reservations.room_id AS "roomId",
        rooms.room_number AS "roomNumber",
        reservations.reservation_date AS "reservationDate",
        reservations.start_time AS "startTime",
        reservations.end_time AS "endTime",
        users.name AS "userName"
      FROM reservations
      JOIN rooms
        ON reservations.room_id = rooms.id
      JOIN users
        ON reservations.user_id = users.id
      ORDER BY reservations.reservation_date, reservations.start_time;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      error: "Unable to retrieve reservations.",
    });
  }
});

app.get("/api/reservations/user/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await pool.query(
      `
      SELECT
        reservations.id,
        reservations.room_id AS "roomId",
        rooms.room_number AS "roomNumber",
        locations.name AS location,
        reservations.reservation_date AS "reservationDate",
        reservations.start_time AS "startTime",
        reservations.end_time AS "endTime"
      FROM reservations
      JOIN rooms
        ON reservations.room_id = rooms.id
      JOIN locations
        ON rooms.location_id = locations.id
      WHERE reservations.user_id = $1
      ORDER BY reservations.reservation_date, reservations.start_time;
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      error: "Unable to retrieve user reservations.",
    });
  }
});

app.delete("/api/reservations/:id", async (req, res) => {
  const reservationId = req.params.id;

  try {
    const result = await pool.query(
      `
      DELETE FROM reservations
      WHERE id = $1
      RETURNING id;
      `,
      [reservationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Reservation not found.",
      });
    }

    res.json({
      message: "Reservation cancelled successfully.",
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      error: "Unable to cancel reservation.",
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

app.post("/api/reservations", async (req, res) => {
  const {
    userId,
    roomId,
    reservationDate,
    startTime,
    duration,
  } = req.body;

  if (!userId || !roomId || !reservationDate || !startTime || !duration) {
    return res.status(400).json({
      error: "User, room, date, start time, and duration are required.",
    });
  }

  try {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(start.getTime() + Number(duration) * 60 * 60 * 1000);

    const endTime = end.toTimeString().slice(0, 5);

    const conflictCheck = await pool.query(
      `
      SELECT id
      FROM reservations
      WHERE room_id = $1
        AND reservation_date = $2
        AND start_time < $4
        AND end_time > $3;
      `,
      [roomId, reservationDate, startTime, endTime]
    );

    if (conflictCheck.rows.length > 0) {
      return res.status(409).json({
        error: "This room is already reserved during that time.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO reservations
        (user_id, room_id, reservation_date, start_time, end_time)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING
        id,
        room_id AS "roomId",
        reservation_date AS "reservationDate",
        start_time AS "startTime",
        end_time AS "endTime";
      `,
      [userId, roomId, reservationDate, startTime, endTime]
    );

    res.status(201).json({
      message: "Room reserved successfully.",
      reservation: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      error: "Unable to create reservation.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`StudyRoom server running at http://localhost:${PORT}`);
});