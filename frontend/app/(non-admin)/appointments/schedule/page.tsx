import { Metadata } from "next";
import ImprovedAppointmentForm from "@/components/appointment/appointment-schedule-form";

export const metadata: Metadata = {
  title: "Schedule Appointment | Auto Detailing Management System",
  description: "Schedule a new auto detailing appointment",
};

export default function ScheduleAppointmentPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Schedule Appointment</h1>
        <ImprovedAppointmentForm />
      </div>
    </div>
  );
}
