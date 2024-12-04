import { Metadata } from "next";
import AppointmentList from "@/components/appointment/appointment-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ImprovedAppointmentForm from "@/components/appointment/appointment-schedule-form";

export const metadata: Metadata = {
  title: "Appointments | Auto Detailing Management System",
  description: "View and schedule appointments for auto detailing services.",
};

export default function AppointmentsPage() {
  return (
    <div className="px-4 py-8 h-screen bg-purple-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-900">
        Appointment Management
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-purple-900">
            All Appointments
          </h2>
          {/* <Link href="/appointments/schedule">
            <Button className="bg-purple-600 text-white hover:bg-purple-700">
              Schedule New Appointment
            </Button>
          </Link> */}
          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-purple-600 text-white hover:bg-purple-700">
                Schedule New Appointment
              </Button>
            </SheetTrigger>
            <SheetContent className="min-w-[900px]">
              <SheetHeader>
                {/* <SheetTitle>Schedule New Appointment</SheetTitle> */}
                {/* <SheetDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </SheetDescription> */}
              </SheetHeader>
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">
                  Schedule Appointment
                </h1>
                <ImprovedAppointmentForm />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <AppointmentList />
      </div>
    </div>
  );
}
