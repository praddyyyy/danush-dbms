"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-purple-200 data-[state=open]:text-purple-900"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-purple-300 text-purple-900">
                  CN
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-purple-900">
                  {user.name}
                </span>
                <span className="truncate text-xs text-purple-700">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-purple-600" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-purple-300 text-purple-900">
                    CN
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-purple-900">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-purple-700">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-purple-200" />
            {/* <DropdownMenuGroup>
              <DropdownMenuItem className="text-purple-900 hover:bg-purple-100">
                <Sparkles className="text-purple-600" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-purple-200" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-purple-900 hover:bg-purple-100">
                <BadgeCheck className="text-purple-600" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="text-purple-900 hover:bg-purple-100">
                <CreditCard className="text-purple-600" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="text-purple-900 hover:bg-purple-100">
                <Bell className="text-purple-600" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-purple-200" /> */}
            <DropdownMenuItem className="text-purple-900 hover:bg-purple-100">
              <LogOut className="text-purple-600" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
