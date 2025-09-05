
'use client';

import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { LayoutDashboard, FileText, CheckSquare, Settings, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

function AppLogo() {
  return (
    <div className="flex items-center gap-2.5 p-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12.4 2.7c.3-.3.8-.3 1.1 0l7.1 7.1c.3.3.3.8 0 1.1l-7.1 7.1c-.3.3-.8.3-1.1 0l-7.1-7.1c-.3-.3-.3-.8 0-1.1l7.1-7.1z"/><path d="M5.3 9.8 2.7 12.4c-.3.3-.3.8 0 1.1l7.1 7.1c.3.3.8.3 1.1 0l2.6-2.6"/></svg>
      </div>
      <h1 className="text-lg font-bold text-sidebar-foreground">PermitFlow</h1>
      <div className="flex-1" />
      <SidebarTrigger className="hidden md:flex" />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <AppLogo />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard')} tooltip="Dashboard">
                    <Link href="/dashboard">
                        <LayoutDashboard />
                        Dashboard
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/templates')} tooltip="Templates">
                    <Link href="/templates">
                        <FileText />
                        PDF Templates
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/checklists')} tooltip="Checklists">
                    <Link href="/checklists">
                        <CheckSquare />
                        County Checklists
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://picsum.photos/100" alt="Admin" data-ai-hint="person avatar" />
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-sidebar-accent-foreground truncate">Admin User</p>
                    <p className="text-xs text-muted-foreground truncate">admin@permitflow.com</p>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-sidebar-accent-foreground">
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
