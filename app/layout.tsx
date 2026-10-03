import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Appointment Scheduler",
  description: "Personal appointment planner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}