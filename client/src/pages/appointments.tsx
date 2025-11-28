import { useState, useEffect } from "react";
import { Link } from "wouter";

const Appointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [newAppointment, setNewAppointment] = useState({
    date: "",
    time: "",
    vet: "",
    notes: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppointment),
      });
      const data = await response.json();
      setAppointments([...appointments, data]);
      setNewAppointment({ date: "", time: "", vet: "", notes: "" });
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="date"
          name="date"
          value={newAppointment.date}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="time"
          name="time"
          value={newAppointment.time}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          name="vet"
          value={newAppointment.vet}
          onChange={handleInputChange}
          placeholder="Vet Name"
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          name="notes"
          value={newAppointment.notes}
          onChange={handleInputChange}
          placeholder="Notes"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Add Appointment
        </button>
      </form>
      <ul>
        {appointments.map((appt, index) => (
          <li key={index} className="border p-2 mb-2">
            {appt.date} {appt.time} - {appt.vet}: {appt.notes}
          </li>
        ))}
      </ul>
      <Link to="/" className="text-blue-500">
        Back to Home
      </Link>
    </div>
  );
};

export default Appointments;
