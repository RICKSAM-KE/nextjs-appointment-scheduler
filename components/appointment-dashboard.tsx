"use client";

import { useState, useEffect } from "react";

export type Appointment = {
  id: number;
  title: string;
  description: string | null;
  appointmentDate: string;
  reminderMinutes: number;
  status: "upcoming" | "completed" | "missed";
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

  const fetchAppointments = async () => {
    const response = await fetch("/api/appointments");
    const data = await response.json();
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title || !form.appointmentDate) {
      return;
    }

    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setForm(emptyForm);
      fetchAppointments();
    }
  };

  const handleStatusUpdate = async (appointmentId: number, nextStatus: string) => {
    await fetch(`/api/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    fetchAppointments();
  };

  const handleDelete = async (appointmentId: number) => {
    await fetch(`/api/appointments/${appointmentId}`, {
      method: "DELETE",
    });

    fetchAppointments();
  };

  return (
    <main className="shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">Personal planner</p>
          <h1>Appointment scheduler</h1>
        </div>
        <div className="pill">{appointments.length} total</div>
      </section>

      <section className="layout">
        <form onSubmit={handleSubmit} className="card form-card">
          <h2>Add appointment</h2>

          <label>
            Title
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Doctor visit"
            />
          </label>

          <label>
            Notes
            <textarea
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Bring ID and previous report"
            />
          </label>

          <div className="two-column">
            <label>
              Date & time
              <input
                type="datetime-local"
                value={form.appointmentDate}
                onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
              />
            </label>

            <label>
              Reminder
              <select
                value={form.reminderMinutes}
                onChange={(e) =>
                  setForm({ ...form, reminderMinutes: Number(e.target.value) })
                }
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={1440}>1 day</option>
              </select>
            </label>
          </div>

          <button type="submit" className="primary-button">
            Save appointment
          </button>
        </form>

        <div className="card list-card">
          <h2>Upcoming schedule</h2>

          {loading ? (
            <p>Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p className="empty-state">No appointments yet. Add your first one.</p>
          ) : (
            <div className="appointment-list">
              {appointments.map((appointment) => (
                <article key={appointment.id} className="appointment-item">
                  <div>
                    <div className="appointment-header">
                      <h3>{appointment.title}</h3>
                      <span className={`status status-${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="date-text">
                      {new Date(appointment.appointmentDate).toLocaleString()}
                    </p>
                    {appointment.description ? (
                      <p className="description">{appointment.description}</p>
                    ) : null}
                    <p className="meta">Reminder: {appointment.reminderMinutes} minutes</p>
                  </div>

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
