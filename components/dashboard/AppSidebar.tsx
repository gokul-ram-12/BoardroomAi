'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Home, Folder, Bot, BarChart2, Activity, Settings, User } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  { title: 'Overview', url: '/dashboard', icon: Home },
  { title: 'Projects', url: '/dashboard/projects', icon: Folder },
  { title: 'Agents', url: '/dashboard/agents', icon: Bot },
  { title: 'Reports', url: '/dashboard/reports', icon: BarChart2 },
  { title: 'Analytics', url: '/dashboard/analytics', icon: Activity },
];

const bottomItems = [
  { title: 'Settings', url: '/dashboard/settings', icon: Settings },
  { title: 'Profile', url: '/dashboard/profile', icon: User },
];

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-2 px-2">
          <Bot className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">BoardroomAI</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url}>
                    <SidebarMenuButton tooltip={item.title}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50">
        <SidebarMenu>
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url}>
                <SidebarMenuButton tooltip={item.title}>
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
