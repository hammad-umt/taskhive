import { Calendar, Home, Inbox, Search, Settings, Users, CheckSquare, UserPlus, Plus } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import LogoutButton from "./logout-button"

// Menu items.
const mainItems = [
  {
    title: "Home",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "/admin/inbox",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "/admin/calendar",
    icon: Calendar,
  },
]

const managementItems = [
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Tasks",
    url: "/admin/tasks",
    icon: CheckSquare,
  },
]

const actionItems = [
  {
    title: "Add User",
    url: "/admin/users/new",
    icon: UserPlus,
  },
  {
    title: "Add Task",
    url: "/admin/tasks/new",
    icon: Plus,
  },
  {
    title: "Assign Task",
    url: "/admin/tasks/assign",
    icon: CheckSquare,
  },
]

const settingsItems = [
  {
    title: "Search",
    url: "/admin/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="w-full">
      <SidebarContent className="flex flex-col h-full">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs md:text-sm">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-xs md:text-sm">
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs md:text-sm">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-xs md:text-sm">
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs md:text-sm">Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {actionItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-xs md:text-sm">
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs md:text-sm">Preferences</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-xs md:text-sm">
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Spacer to push logout to bottom */}
        <div className="flex-1"></div>

        {/* Logout Button */}
        <SidebarGroup>
          <SidebarMenuButton asChild className="w-full">
            <LogoutButton />
          </SidebarMenuButton>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}