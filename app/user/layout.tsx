'use client';

import ProtectedPage from '@/app/components/ProtectedPage';
import { UserSidebar } from '@/app/components/user-sidebar';
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import UserHeader from './components/user-header';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedPage>
      <SidebarProvider>
        <UserSidebar />
        <SidebarInset>
          <UserHeader />
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedPage>
  );
}
