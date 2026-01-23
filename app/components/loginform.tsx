'use client';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner';
import { Zap } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/login', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json();
      
      if (response.ok && data.role) {
        // Store user ID in localStorage with role-based keys
        if (data.id) {
          console.log('Login successful:', data.role, 'ID:', data.id);
          localStorage.setItem('userId', data.id);
          localStorage.setItem('userRole', data.role);
          localStorage.setItem(`${data.role}Id`, data.id); // adminId or userId
        }
        
        toast.success('Login successful!');
        if (data.role === 'admin') {
          console.log("Admin logged in with ID:", data.id);  
          router.push('/admin/dashboard');
        } else {
          console.log("User logged in with ID:", data.id);
          router.push('/user');
        }
      } else {
        toast.error(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Header Section - Professional Branding */}
      <div className="flex flex-col gap-3 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-linear-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              TaskHive
            </h1>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Enterprise
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
          Professional task management platform
        </p>
      </div>

      {/* Login Card - Premium Design */}
      <Card className="border border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-2xl bg-white dark:bg-gray-900/50 backdrop-blur-sm">
        <CardHeader className="bg-linear-to-r from-indigo-50 via-purple-50 to-indigo-50 dark:from-gray-800 dark:via-indigo-900/20 dark:to-gray-800 border-b border-gray-200 dark:border-gray-800">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign in
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Enter your credentials to access your workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="font-semibold text-gray-700 dark:text-gray-200">
                  Email Address
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="your.email@company.com"
                  required
                  className="h-11 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 text-gray-900 dark:text-white"
                />
              </Field>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="font-semibold text-gray-700 dark:text-gray-200">
                    Password
                  </FieldLabel>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  onChange={handleChange} 
                  value={formData.password} 
                  placeholder="••••••••••••"
                  required 
                  className="h-11 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 text-gray-900 dark:text-white"
                />
              </Field>

              {/* Sign In Button */}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-11 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Demo Credentials - Premium Style */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>
                  Demo Credentials
                </p>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Email:</span>
                    <span className="text-xs font-mono text-gray-900 dark:text-gray-300 bg-white dark:bg-gray-900 px-2 py-1 rounded">
                      admin@taskhive.com
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Password:</span>
                    <span className="text-xs font-mono text-gray-900 dark:text-gray-300 bg-white dark:bg-gray-900 px-2 py-1 rounded">
                      password123
                    </span>
                  </div>
                </div>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* Footer - Professional */}
      <div className="flex flex-col gap-2 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
          ✓ Enterprise-grade security • Encrypted communications • SOC 2 Compliant
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-600">
          © 2024 TaskHive. All rights reserved.
        </p>
      </div>
    </div>
  )
}
