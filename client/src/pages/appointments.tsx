import { useState, useEffect, ChangeEvent } from "react";

interface Appointment {
  id?: number;
  date: string;
  time: string;
  vet: string;
  notes: string;
}

const Appointments = ({ language }: { language: string }) => {
  const t = (en: string, ur: string) => language === "en" ? en : ur;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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

  const handleSubmit = () => {
    if (!newAppointment.date || !newAppointment.time || !newAppointment.vet) {
      alert(t("Please fill all required fields", "براہ کرم تمام ضروری فیلڈز بھریں"));
      return;
    }

    fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAppointment),
    })
      .then((response) => response.json())
      .then((data) => {
        setAppointments([...appointments, data]);
        setNewAppointment({ date: "", time: "", vet: "", notes: "" });
      })
      .catch((error) => console.error("Error adding appointment:", error));
  };

  return (
    <div style={{ padding: "16px", maxWidth: "1280px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#f1f5f9" }}>
        {t("Appointments", "ملاقاتیں")}
      </h1>

      <div
        style={{
          marginBottom: "24px",
          padding: "24px",
          backgroundColor: "#1e293b",
          borderRadius: "8px",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#f1f5f9" }}>
          {t("Schedule New Appointment", "نئی ملاقات مقرر کریں")}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1", marginBottom: "4px" }}>
              {t("Date:", "تاریخ:")}
            </label>
            <input
              type="date"
              name="date"
              value={newAppointment.date}
              onChange={handleInputChange}
              style={{
                width: "100%",
                border: "1px solid #334155",
                padding: "8px",
                borderRadius: "4px",
                fontSize: "14px",
                backgroundColor: "#0f172a",
                color: "#f1f5f9"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1", marginBottom: "4px" }}>
              {t("Time:", "وقت:")}
            </label>
            <input
              type="time"
              name="time"
              value={newAppointment.time}
              onChange={handleInputChange}
              style={{
                width: "100%",
                border: "1px solid #334155",
                padding: "8px",
                borderRadius: "4px",
                fontSize: "14px",
                backgroundColor: "#0f172a",
                color: "#f1f5f9"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1", marginBottom: "4px" }}>
              {t("Vet Name:", "ڈاکٹر کا نام:")}
            </label>
            <input
              type="text"
              name="vet"
              value={newAppointment.vet}
              onChange={handleInputChange}
              placeholder={t("Enter vet name", "ڈاکٹر کا نام درج کریں")}
              style={{
                width: "100%",
                border: "1px solid #334155",
                padding: "8px",
                borderRadius: "4px",
                fontSize: "14px",
                backgroundColor: "#0f172a",
                color: "#f1f5f9"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1", marginBottom: "4px" }}>
              {t("Notes:", "نوٹس:")}
            </label>
            <input
              type="text"
              name="notes"
              value={newAppointment.notes}
              onChange={handleInputChange}
              placeholder={t("Additional notes", "اضافی نوٹس")}
              style={{
                width: "100%",
                border: "1px solid #334155",
                padding: "8px",
                borderRadius: "4px",
                fontSize: "14px",
                backgroundColor: "#0f172a",
                color: "#f1f5f9"
              }}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
        >
          {t("Add Appointment", "ملاقات شامل کریں")}
        </button>
      </div>

      <div style={{ backgroundColor: "#1e293b", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)", overflow: "hidden" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "600", padding: "16px", color: "#f1f5f9", borderBottom: "1px solid #334155" }}>
          {t("Scheduled Appointments", "مقررہ ملاقاتیں")}
        </h2>

        {appointments.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
            {t("No appointments scheduled", "کوئی ملاقات مقرر نہیں")}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#0f172a" }}>
                  <th style={{ border: "1px solid #334155", padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#f1f5f9" }}>
                    {t("Date", "تاریخ")}
                  </th>
                  <th style={{ border: "1px solid #334155", padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#f1f5f9" }}>
                    {t("Time", "وقت")}
                  </th>
                  <th style={{ border: "1px solid #334155", padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#f1f5f9" }}>
                    {t("Vet", "ڈاکٹر")}
                  </th>
                  <th style={{ border: "1px solid #334155", padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#f1f5f9" }}>
                    {t("Notes", "نوٹس")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#1e293b" : "#0f172a" }}>
                    <td style={{ border: "1px solid #334155", padding: "12px", fontSize: "14px", color: "#f1f5f9" }}>
                      {apt.date}
                    </td>
                    <td style={{ border: "1px solid #334155", padding: "12px", fontSize: "14px", color: "#f1f5f9" }}>
                      {apt.time}
                    </td>
                    <td style={{ border: "1px solid #334155", padding: "12px", fontSize: "14px", color: "#f1f5f9", fontWeight: "500" }}>
                      {apt.vet}
                    </td>
                    <td style={{ border: "1px solid #334155", padding: "12px", fontSize: "14px", color: "#cbd5e1" }}>
                      {apt.notes || t("No notes", "کوئی نوٹ نہیں")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
