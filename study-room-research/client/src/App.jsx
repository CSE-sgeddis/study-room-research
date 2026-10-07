import { useState } from "react";

function App() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("2");
  const [capacity, setCapacity] = useState("");
  const [rooms, setRooms] = useState([]);

  const searchRooms = (event) => {
    event.preventDefault();

    const sampleRooms = [
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

    const matchingRooms = sampleRooms.filter(
      (room) => room.capacity >= Number(capacity)
    );

    setRooms(matchingRooms);
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

          {rooms.length === 0 ? (
            <p>Enter your search information to find available rooms.</p>
          ) : (
            rooms.map((room) => (
              <div key={room.id}>
                <h3>Room {room.roomNumber}</h3>
                <p>Location: {room.location}</p>
                <p>Capacity: {room.capacity}</p>
                <button>Reserve</button>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;