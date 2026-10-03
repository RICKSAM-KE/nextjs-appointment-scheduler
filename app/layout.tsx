import type { Metadata } from "next";
import "./globals.css";
import { AppointmentDashboard } from "@/components/appointment-dashboard";

export const metadata: Metadata = {
  title: "Appointment Scheduler",
  description: "Personal appointment planner and scheduler",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
