"use client";

import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function TeamSwitcher() {
  const teams = {
    name: "Auto Detailing Inc.",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-purple-200 data-[state=open]:text-purple-900"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-purple-600 text-white">
            <teams.logo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-purple-900">
              {teams.name}
            </span>
            <span className="truncate text-xs text-purple-700">
              {teams.plan}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
