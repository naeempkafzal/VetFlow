import { useState, useEffect, ChangeEvent } from "react";

interface Appointment {
  id?: number;
  ownerName?: string;
  reason?: string;
  appointmentDate?: string;
  status?: string;
}

const Appointments = ({ language }: { language: string }) => {
  const t = (en: string, ur: string) => language === "en" ? en : ur;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [newAppointment, setNewAppointment] = useState({
    ownerName: "",    // Aligned with Backend
    reason: "",       // Aligned with Backend
    appointmentDate: "", // Aligned with Backend (Combined Date/Time)
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
    if (!newAppointment.appointmentDate) {
      alert(t("Please select a date", "براہ کرم تاریخ منتخب کریں"));
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
        setNewAppointment({ ownerName: "", reason: "", appointmentDate: "" });
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
              {t("Owner/Staff Name:", "مالک/اسٹاف کا نام:")}
            </label>
            <input
              type="text"
              name="ownerName"
              value={newAppointment.ownerName}
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
              {t("Reason:", "وجہ:")}
            </label>
            <input
              type="text"
              name="reason"
              value={newAppointment.reason}
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
              {t("Date & Time:", "تاریخ اور وقت:")}
            </label>
            <input
              type="datetime-local"
              name="appointmentDate"
              value={newAppointment.appointmentDate}
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
          }}
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
                    {t("Owner/Staff", "مالک/اسٹاف")}
                  </th>
                  <th style={{ border: "1px solid #334155", padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#f1f5f9" }}>
                    {t("Reason", "وجہ")}
                  </th>
                  <th style={{ border: "1px solid #334155", padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#f1f5f9" }}>
                    {t("Status", "حالت")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#1e293b" : "#0f172a" }}>
                    <td style={{ border: "1px solid #334155", padding: "12px", fontSize: "14px", color: "#f1f5f9" }}>
                      {apt.appointmentDate?.replace('T', ' ')}
                    </td>
                    <td style={{ border: "1px solid #334155", padding: "12px", fontSize: "14px", color: "#f1f5f9", fontWeight: "500" }}>
                      {apt.ownerName}
                    </td>
                    <td style={{ border: "1px solid #334155", padding: "12px", fontSize: "14px", color: "#cbd5e1" }}>
                      {apt.reason || t("N/A", "N/A")}
                    </td>
                    <td style={{ border: "1px solid #334155", padding: "12px", fontSize: "14px", color: "#cbd5e1" }}>
                      {apt.status || "scheduled"}
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