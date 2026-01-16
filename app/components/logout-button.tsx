'use client';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from 'sonner';
import { useState } from 'react';

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        toast.success('Logged out successfully!');
        console.log('Logged out successfully');
        // Redirect to login page after a brief delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 500);
      } else {
        toast.error('Logout failed. Please try again.');
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant="destructive"
      className="w-full"
    >
      <LogOut size={18} className="mr-2" />
      {isLoading ? 'Logging out...' : 'Logout'}
    </Button>
  )
}