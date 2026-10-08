import { useState } from "react";

function App() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("2");
  const [capacity, setCapacity] = useState("");
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [locationId, setLocationId] = useState("1");
  const [roomCapacity, setRoomCapacity] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [reservationMessage, setReservationMessage] = useState(""); 

  const [myReservations, setMyReservations] = useState([]);
  const [reservationListMessage, setReservationListMessage] = useState("");

  const searchRooms = async (event) => {
    event.preventDefault();

    setError("");
    setReservationMessage("");
    setRooms([]);

    try {
      const url = new URL("http://localhost:3000/api/rooms");

      url.searchParams.append("date", date);
      url.searchParams.append("startTime", startTime);
      url.searchParams.append("duration", duration);
      url.searchParams.append("capacity", capacity);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to retrieve available rooms.");
      }

      const availableRooms = await response.json();

      setRooms(availableRooms);
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the StudyRoom server.");
    }
  };

  const loadMyReservations = async () => {
    setReservationListMessage("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/reservations/user/1"
      );

      if (!response.ok) {
        throw new Error("Unable to retrieve reservations.");
      }

      const reservations = await response.json();

      setMyReservations(reservations);
    } catch (error) {
      console.error(error);
      setReservationListMessage("Unable to load your reservations.");
    }
  };

  const cancelReservation = async (reservationId) => {
    setReservationListMessage("");

    try {
      const response = await fetch(
        `http://localhost:3000/api/reservations/${reservationId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to cancel reservation.");
      }

      setReservationListMessage("Reservation cancelled successfully.");

      loadMyReservations();
    } catch (error) {
      console.error(error);
      setReservationListMessage(error.message);
    }
  };

  const createRoom = async (event) => {
    event.preventDefault();
    setAdminMessage("");

    try {
      const response = await fetch("http://localhost:3000/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomNumber,
          locationId: Number(locationId),
          capacity: Number(roomCapacity),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create room.");
      }

      setAdminMessage(`Room ${data.roomNumber} was created successfully.`);
      setRoomNumber("");
      setRoomCapacity("");

      const roomsResponse = await fetch("http://localhost:3000/api/rooms");
      const updatedRooms = await roomsResponse.json();
      setRooms(updatedRooms);
    } catch (error) {
      console.error(error);
      setAdminMessage("Unable to create room.");
    }
  };

const deleteRoom = async (roomId, roomNumber) => {
  setAdminMessage("");

  try {
    const response = await fetch(
      `http://localhost:3000/api/rooms/${roomId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to delete room.");
    }

    setAdminMessage(`Room ${roomNumber} was deleted successfully.`);

    const roomsResponse = await fetch("http://localhost:3000/api/rooms");
    const updatedRooms = await roomsResponse.json();
    setRooms(updatedRooms);
  } catch (error) {
    console.error(error);
    setAdminMessage("Unable to delete room.");
  }
};

const reserveRoom = async (roomId, roomNumber) => {
  setReservationMessage("");

  try {
    const response = await fetch(
      "http://localhost:3000/api/reservations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 1,
          roomId: roomId,
          reservationDate: date,
          startTime: startTime,
          duration: Number(duration),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to reserve room.");
    }

    setReservationMessage(
      `Room ${roomNumber} reserved successfully!`
    );

    loadMyReservations();
  } catch (error) {
    console.error(error);
    setReservationMessage(error.message);
  }
};

  return (
    <div>
      <header>
        <h1>StudyRoom</h1>
        <p>Study Room Research Prototype</p>
      </header>

      <main>
        <section>
          <h2>Find a Study Room</h2>

          <form onSubmit={searchRooms}>
            <label>
              Date
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </label>

            <label>
              Start Time
              <input
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                required
              />
            </label>

            <label>
              Duration
              <select
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
              >
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
              </select>
            </label>

            <label>
              Number of People
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(event) => setCapacity(event.target.value)}
                required
              />
            </label>

            <button type="submit">Search Rooms</button>
          </form>
        </section>

        <section>
          <h2>Available Rooms</h2>

          {reservationMessage && <p>{reservationMessage}</p>}

          {error && <p>{error}</p>}

          {!error && rooms.length === 0 && (
            <p>Enter your search information to find available rooms.</p>
          )}

          {!error &&
            rooms.map((room) => (
              <div key={room.id}>
                <h3>Room {room.roomNumber}</h3>
                <p>Location: {room.location}</p>
                <p>Capacity: {room.capacity}</p>
                <button type="button" onClick={() => reserveRoom(room.id, room.roomNumber)}>
                  Reserve
                </button>
              </div>
            ))}
        </section>
        <section>
          <h2>My Reservations</h2>

          <button type="button" onClick={loadMyReservations}>
            Load My Reservations
          </button>

          {reservationListMessage && <p>{reservationListMessage}</p>}

          {myReservations.length === 0 && !reservationListMessage && (
            <p>You currently have no reservations.</p>
          )}

          {myReservations.map((reservation) => (
            <div key={reservation.id}>
              <h3>Room {reservation.roomNumber}</h3>

              <p>Location: {reservation.location}</p>

              <p>
                Date:{" "}
                {new Date(reservation.reservationDate).toLocaleDateString()}
              </p>

              <p>
                <p>
                  Time:{" "}
                  {new Date(`1970-01-01T${reservation.startTime}`).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(`1970-01-01T${reservation.endTime}`).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </p>

              <button
                type="button"
                onClick={() => cancelReservation(reservation.id)}
              >
                Cancel Reservation
              </button>
            </div>
          ))}
        </section>
        <section>
          <h2>Admin: Manage Study Rooms</h2>

          <form onSubmit={createRoom}>
            <label>
              Room Number
              <input
                type="text"
                value={roomNumber}
                onChange={(event) => setRoomNumber(event.target.value)}
                placeholder="Example: 301"
                required
              />
            </label>

            <label>
              Location
              <select
                value={locationId}
                onChange={(event) => setLocationId(event.target.value)}
              >
                <option value="1">Main Library</option>
                <option value="2">Science Library</option>
              </select>
            </label>

            <label>
              Capacity
              <input
                type="number"
                min="1"
                value={roomCapacity}
                onChange={(event) => setRoomCapacity(event.target.value)}
                required
              />
            </label>

            <button type="submit">Add Room</button>
          </form>

          {adminMessage && <p>{adminMessage}</p>}

          <h3>Current Rooms</h3>

          {rooms.map((room) => (
            <div key={room.id}>
              <span>
                Room {room.roomNumber} | {room.location} | Capacity: {room.capacity}
              </span>

              <button
                type="button"
                onClick={() => deleteRoom(room.id, room.roomNumber)}
              >
                Delete
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;