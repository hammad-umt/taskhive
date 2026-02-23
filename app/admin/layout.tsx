'use client';

import ProtectedPage from '@/app/components/ProtectedPage';
import Header from './components/header';
import { AppSidebar } from '@/app/components/app-sidebar';
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';

// export const metadata = {
//   title: 'Admin Dashboard',
//   description: 'Professional Admin Dashboard',
// };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedPage>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedPage>
  );
}
