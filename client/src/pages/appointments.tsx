import { useState, useEffect, ChangeEvent, FormEvent } from "react";

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
      const response = await fetch("/api/appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/appointments", {
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
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Appointment
        </button>
      </form>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Date</th>
            <th className="border p-2">Time</th>
            <th className="border p-2">Vet</th>
            <th className="border p-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt, i) => (
            <tr key={i}>
              <td className="border p-2">{apt.date}</td>
              <td className="border p-2">{apt.time}</td>
              <td className="border p-2">{apt.vet}</td>
              <td className="border p-2">{apt.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Appointments;
