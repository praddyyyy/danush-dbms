import { Metadata } from "next";
import CustomerAuthForm from "@/components/auth/customer-auth-form";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Customer Login/Signup | Auto Detailing Management System",
  description:
    "Customer login and signup page for the Auto Detailing Management System",
};

export default function CustomerAuthPage() {
  return (
    <div className="min-h-screen bg-[#6366F1]">
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-5xl flex">
          {/* Left side - Image */}
          <div className="relative hidden md:block md:w-1/2">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/80 to-[#6366F1]/40 z-10" />
            <Image
              src="/login.jpg"
              alt="Person working"
              width={600}
              height={800}
              className="object-cover h-full"
              priority
            />
            {/* Overlay logo or branding */}
            <div className="absolute top-8 left-8 z-20">
              <div className="text-white text-2xl font-bold">
                Auto Detailing Pro
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  Welcome to Auto Detailing Pro
                </h1>
                <p className="text-gray-500">
                  Please sign in to your account or create a new one
                </p>
              </div>
              <CustomerAuthForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
