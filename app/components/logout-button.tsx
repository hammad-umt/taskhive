'use client';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
        if (response.ok) {
        console.log('Logged out successfully');
        // Redirect to login page or perform other actions
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };
  return (
    <Button
      onClick={handleLogout}
      variant="destructive"
      className="w-full"
    >
      <LogOut size={18} className="mr-2" />
      Logout
    </Button>
  )
}