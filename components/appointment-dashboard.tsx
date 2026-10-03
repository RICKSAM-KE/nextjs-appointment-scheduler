"use client";

import { useState, useEffect } from "react";

type Appointment = {
  id: number;
  title: string;
  description: string | null;
  appointmentDate: string;
  reminderMinutes: number;
  status: string;
};

const emptyForm = {
  title: "",
  description: "",
  appointmentDate: "",
  reminderMinutes: 60,
};

export function AppointmentDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments");
      const data = await response.json();
      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title || !form.appointmentDate) {
      alert("Please fill in title and date");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setForm(emptyForm);
        await fetchAppointments();
      } else {
        alert("Failed to save appointment");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Error saving appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (appointmentId: number, status: string) => {
    try {
      await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await fetchAppointments();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update appointment");
    }
  };

  const handleDelete = async (appointmentId: number) => {
    if (!confirm("Delete this appointment?")) return;

    try {
      await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
      });
      await fetchAppointments();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete appointment");
    }
  };

  return (
    <main className="shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">Personal Planner</p>
          <h1>Appointment Scheduler</h1>
        </div>
        <div className="pill">{appointments.length} appointments</div>
      </section>

      <section className="layout">
        <form onSubmit={handleSubmit} className="card">
          <h2>Add Appointment</h2>

          <label>
            Title
            <span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Doctor visit"
              />
            </span>
          </label>

          <label>
            Notes
            <span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g., Bring ID and insurance card"
              />
            </span>
          </label>

          <div className="two-column">
            <label>
              Date & Time
              <span>
                <input
                  type="datetime-local"
                  value={form.appointmentDate}
                  onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                />
              </span>
            </label>

            <label>
              Reminder
              <span>
                <select
                  value={form.reminderMinutes}
                  onChange={(e) => setForm({ ...form, reminderMinutes: parseInt(e.target.value) })}
                >
                  <option value={15}>15 min before</option>
                  <option value={30}>30 min before</option>
                  <option value={60}>1 hour before</option>
                  <option value={120}>2 hours before</option>
                  <option value={1440}>1 day before</option>
                </select>
              </span>
            </label>
          </div>

          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? "Saving..." : "Save Appointment"}
          </button>
        </form>

        <div className="card">
          <h2>Upcoming Schedule</h2>

          {loading ? (
            <div className="loading">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="empty-state">
              <p>No appointments yet</p>
              <p style={{ marginTop: "8px", fontSize: "13px" }}>Add your first appointment to get started</p>
            </div>
          ) : (
            <div className="appointment-list">
              {appointments.map((appointment) => (
                <article key={appointment.id} className="appointment-item">
                  <div className="appointment-header">
                    <h3>{appointment.title}</h3>
                    <span className={`status status-${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <p className="date-text">
                    {new Date(appointment.appointmentDate).toLocaleString()}
                  </p>
                  {appointment.description && (
                    <p className="description">{appointment.description}</p>
                  )}
                  <p className="meta">Reminder: {appointment.reminderMinutes} minutes before</p>

                  <div className="action-row">
                    <button
                      className="secondary-button"
                      onClick={() =>
                        handleStatusUpdate(
                          appointment.id,
                          appointment.status === "completed" ? "upcoming" : "completed"
                        )
                      }
                    >
                      {appointment.status === "completed" ? "Reopen" : "Complete"}
                    </button>
                    <button
                      className="danger-button"
                      onClick={() => handleDelete(appointment.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}