"use client";

import * as React from "react";
import { Frame } from "lucide-react";

import { UserPlus, CalendarPlus, Package, Car, Users } from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Admin",
    email: "admin@adc.com",
    avatar: "/avatars/shadcn.jpg",
  },
  projects: [
    { name: "Dashboard", url: "/dashboard", icon: Frame },
    { name: "Customer Management", url: "/customers", icon: UserPlus },
    {
      name: "Appointments",
      url: "/appointments",
      icon: CalendarPlus,
    },
    { name: "Manage Inventory", url: "/inventory", icon: Package },
    { name: "Manage Vehicles", url: "/vehicles", icon: Car },
    // { name: "Manage Employees", url: "#", icon: Users },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="bg-purple-100 text-purple-900"
      {...props}
    >
      <SidebarHeader className="border-b border-purple-200">
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter className="border-t border-purple-200">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
