'use client';

import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Zap, 
  Shield, 
  BarChart3, 
  MessageSquare,
  Smartphone,
  Settings,
  TrendingUp,
  Award,
  Lightbulb,
  Moon,
  Sun,
  Search,
  Bell,
  Lock,
  Eye,
  Calendar,
  Flag,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { FAQSection } from './faq-section';
import { SupportSection } from './support-section';
import { useState, useEffect } from 'react';

export default function HomeHero() {
  const [isDark, setIsDark] = useState(true);

  const updateTheme = (isDarkMode: boolean) => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    updateTheme(!isDark);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const isDarkMode = savedTheme === 'dark';
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, []);
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-linear-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-linear-to-br from-gray-50 via-gray-100 to-gray-50'}`}>
      {/* Navigation Bar */}
      <nav className={`flex items-center justify-between px-6 py-4 max-w-7xl mx-auto sticky top-0 z-50 ${isDark ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-md border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <Zap size={32} className={isDark ? "text-blue-400" : "text-blue-600"} />
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>TaskHive</div>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a href="#features" className={`transition ${isDark ? 'text-slate-200 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Features</a>
          <a href="#how-it-works" className={`transition ${isDark ? 'text-slate-200 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>How It Works</a>
          <a href="#benefits" className={`transition ${isDark ? 'text-slate-200 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Benefits</a>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} transition`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link
            href="/login"
            className={`px-6 py-2 transition ${isDark ? 'text-slate-200 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className={`px-6 py-2 rounded-lg font-semibold transition ${isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className={`inline-block mb-6 px-4 py-2 rounded-full border ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-100 border-blue-300'}`}>
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Welcome to TaskHive</span>
            </div>
            <h1 className={`text-5xl lg:text-6xl font-bold mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Organize Your Work,
              <span className={isDark ? "text-blue-400" : "text-blue-600"}> Amplify Productivity</span>
            </h1>
            <p className={`text-xl mb-8 leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              TaskHive is a modern, intuitive task management platform designed to help teams and individuals 
              collaborate seamlessly, organize projects effortlessly, and deliver outstanding results faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/login"
                className={`px-8 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Start Free <ArrowRight size={20} />
              </Link>
            </div>
            <div className={`flex items-center gap-6 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              <div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>500+</p>
                <p className="text-sm">Active Teams</p>
              </div>
              <div className={`w-px h-12 ${isDark ? 'bg-slate-600' : 'bg-gray-300'}`}></div>
              <div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>10K+</p>
                <p className="text-sm">Tasks Completed</p>
              </div>
              <div className={`w-px h-12 ${isDark ? 'bg-slate-600' : 'bg-gray-300'}`}></div>
              <div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>99.9%</p>
                <p className="text-sm">Uptime</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className={`absolute -inset-1 rounded-xl blur opacity-75 ${isDark ? 'bg-linear-to-r from-blue-600 to-purple-600' : 'bg-linear-to-r from-blue-500 to-purple-500'}`}></div>
            <div className={`relative rounded-xl p-8 h-96 flex flex-col items-center justify-center border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="text-center">
                <div className={`mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full border ${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-100 border-blue-300'}`}>
                  <Zap size={40} className={isDark ? "text-blue-400" : "text-blue-600"} />
                </div>
                <p className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Smart Task Management</p>
                <p className={isDark ? "text-slate-300" : "text-gray-600"}>Organize, prioritize, and track tasks with ease</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features Section */}
      <div className={`border-y py-20 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-100 border-gray-300'}`} id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Complete Task Management Solution
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              Everything you need to organize, collaborate, and deliver. Here are the powerful features that make TaskHive the essential platform for modern teams.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Task Management */}
            <div className={`border rounded-xl p-6 transition duration-300 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-blue-500/50 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50'}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-100 border-blue-300'}`}>
                <Layers size={24} className={isDark ? "text-blue-400" : "text-blue-600"} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Smart Task Management</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Create, assign, update, and manage tasks with ease. Set priorities, due dates, and track progress in real-time.
              </p>
              <ul className={`space-y-1 text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Create & organize tasks</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Assign to team members</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Set deadlines & priorities</li>
              </ul>
            </div>

            {/* Feature 2: Admin Dashboard */}
            <div className={`border rounded-xl p-6 transition duration-300 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-purple-500/50 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-purple-500 hover:bg-purple-50'}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${isDark ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-100 border-purple-300'}`}>
                <BarChart3 size={24} className={isDark ? "text-purple-400" : "text-purple-600"} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Admin Dashboard & Analytics</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Comprehensive dashboard with team analytics, task completion rates, and performance metrics.
              </p>
              <ul className={`space-y-1 text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Team performance metrics</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Completion tracking</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Overdue task alerts</li>
              </ul>
            </div>

            {/* Feature 3: User Management */}
            <div className={`border rounded-xl p-6 transition duration-300 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-green-500/50 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-green-500 hover:bg-green-50'}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-100 border-green-300'}`}>
                <Users size={24} className={isDark ? "text-green-400" : "text-green-600"} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>User Management</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Manage team members, assign roles, control access, and manage user permissions effortlessly.
              </p>
              <ul className={`space-y-1 text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Add team members</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Role assignment</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Access control</li>
              </ul>
            </div>

            {/* Feature 4: Advanced Search */}
            <div className={`border rounded-xl p-6 transition duration-300 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-yellow-500/50 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-yellow-500 hover:bg-yellow-50'}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${isDark ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-100 border-yellow-300'}`}>
                <Search size={24} className={isDark ? "text-yellow-400" : "text-yellow-600"} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Advanced Search & Filtering</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Real-time search across all tasks with filtering by status, priority, assignee, and more.
              </p>
              <ul className={`space-y-1 text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Real-time filtering</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Multi-criteria search</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Quick task lookup</li>
              </ul>
            </div>

            {/* Feature 5: Smart Notifications */}
            <div className={`border rounded-xl p-6 transition duration-300 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-red-500/50 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-red-500 hover:bg-red-50'}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-100 border-red-300'}`}>
                <Bell size={24} className={isDark ? "text-red-400" : "text-red-600"} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Smart Notifications & Alerts</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Intelligent alerts for overdue tasks, unassigned work, deleted tasks, and pending items.
              </p>
              <ul className={`space-y-1 text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Overdue alerts</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Deletion logging</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Unassigned task alerts</li>
              </ul>
            </div>

            {/* Feature 6: Role-Based Access */}
            <div className={`border rounded-xl p-6 transition duration-300 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-orange-500/50 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-orange-500 hover:bg-orange-50'}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${isDark ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-100 border-orange-300'}`}>
                <Lock size={24} className={isDark ? "text-orange-400" : "text-orange-600"} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Role-Based Access Control</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Secure admin and user roles with granular permissions and restricted access levels.
              </p>
              <ul className={`space-y-1 text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Admin privileges</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> User permissions</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Secure access</li>
              </ul>
            </div>

            {/* Feature 7: Password Security */}
            <div className={`border rounded-xl p-6 transition duration-300 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-cyan-500/50 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-cyan-500 hover:bg-cyan-50'}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${isDark ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-100 border-cyan-300'}`}>
                <Shield size={24} className={isDark ? "text-cyan-400" : "text-cyan-600"} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Password & Security Management</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Change passwords securely with verification, maintain account security and privacy.
              </p>
              <ul className={`space-y-1 text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Old password verification</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Secure password change</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Account protection</li>
              </ul>
            </div>

            {/* Feature 8: Task Details View */}
            <div className={`border rounded-xl p-6 transition duration-300 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-pink-500/50 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-pink-500 hover:bg-pink-50'}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${isDark ? 'bg-pink-500/10 border-pink-500/30' : 'bg-pink-100 border-pink-300'}`}>
                <Eye size={24} className={isDark ? "text-pink-400" : "text-pink-600"} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Detailed Task Views</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Comprehensive task details with full information, status updates, and action buttons.
              </p>
              <ul className={`space-y-1 text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Full task info</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Status dropdown</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Edit capabilities</li>
              </ul>
            </div>

            {/* Feature 9: Calendar View */}
            <div className={`border rounded-xl p-6 transition duration-300 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-indigo-500/50 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${isDark ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-indigo-100 border-indigo-300'}`}>
                <Calendar size={24} className={isDark ? "text-indigo-400" : "text-indigo-600"} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Calendar View</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Visualize tasks on a calendar to see schedules and plan deadlines effectively.
              </p>
              <ul className={`space-y-1 text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Visual task scheduling</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Deadline visualization</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Planning & coordination</li>
              </ul>
            </div>

            {/* Feature 10: Status Tracking */}
            <div className={`border rounded-xl p-6 transition duration-300 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-green-500/50 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-green-500 hover:bg-green-50'}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-100 border-green-300'}`}>
                <CheckCircle size={24} className={isDark ? "text-green-400" : "text-green-600"} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Status Tracking</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Track task statuses with color-coded badges: Pending, In Progress, On Hold, Completed.
              </p>
              <ul className={`space-y-1 text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Color-coded status</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Progress visibility</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Workflow management</li>
              </ul>
            </div>

            {/* Feature 11: Priority Management */}
            <div className={`border rounded-xl p-6 transition duration-300 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-red-500/50 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-red-500 hover:bg-red-50'}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-100 border-red-300'}`}>
                <Flag size={24} className={isDark ? "text-red-400" : "text-red-600"} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Priority Management</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Organize tasks by priority levels (High, Medium, Low) with visual indicators.
              </p>
              <ul className={`space-y-1 text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> High priority alerts</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Color-coded priorities</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Focus important work</li>
              </ul>
            </div>

            {/* Feature 12: Responsive Design */}
            <div className={`border rounded-xl p-6 transition duration-300 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-teal-500/50 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-teal-500 hover:bg-teal-50'}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${isDark ? 'bg-teal-500/10 border-teal-500/30' : 'bg-teal-100 border-teal-300'}`}>
                <Smartphone size={24} className={isDark ? "text-teal-400" : "text-teal-600"} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Responsive Design</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Works seamlessly on desktop, tablet, and mobile devices for access anywhere.
              </p>
              <ul className={`space-y-1 text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Mobile friendly</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Touch optimized</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Full functionality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className={`py-24 max-w-7xl mx-auto px-6`} id="how-it-works">
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>How TaskHive Works</h2>
          <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
            Get started in minutes with our simple and intuitive workflow
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: '1',
              title: 'Create Account',
              description: 'Sign up and set up your profile in just 2 minutes'
            },
            {
              step: '2',
              title: 'Create Projects',
              description: 'Organize your work into projects and teams'
            },
            {
              step: '3',
              title: 'Add Tasks',
              description: 'Create tasks with details, deadlines, and assignments'
            },
            {
              step: '4',
              title: 'Collaborate',
              description: 'Work together and track progress in real-time'
            }
          ].map((item, index) => (
            <div key={index} className="relative">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-white font-bold text-2xl mb-4 ${isDark ? 'bg-blue-600' : 'bg-blue-600'}`}>
                  {item.step}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                <p className={isDark ? "text-slate-300" : "text-gray-600"}>{item.description}</p>
              </div>
              {index < 3 && (
                <div className="hidden md:block absolute top-8 -right-4 text-blue-400 text-3xl">→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose TaskHive Section */}
      <div className={`border-y py-24 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-100 border-gray-300'}`} id="benefits">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={`text-4xl lg:text-5xl font-bold mb-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>Why Choose TaskHive?</h2>
          <p className={`text-xl text-center max-w-2xl mx-auto mb-16 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
            Discover the advantages that make TaskHive the perfect choice for your team
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Lightbulb, title: 'Easy-to-Use Interface', desc: 'Intuitive design for quick adoption with minimal learning curve' },
              { icon: MessageSquare, title: 'Team Coordination', desc: 'Assign tasks, track progress, and keep your team organized' },
              { icon: Settings, title: 'Customizable Workflows', desc: 'Adapt TaskHive to your unique business processes' },
              { icon: TrendingUp, title: 'Beautiful Analytics', desc: 'Track progress and measure team performance effectively' },
              { icon: Smartphone, title: 'Mobile Responsive', desc: 'Access TaskHive on any device, anytime, anywhere' },
              { icon: Award, title: 'Industry Leading Support', desc: 'Dedicated support team ready to help you succeed' }
            ].map((item, index) => (
              <div key={index} className={`flex gap-4 p-6 rounded-lg border transition ${isDark ? 'bg-slate-700/30 border-slate-600 hover:border-blue-500/30' : 'bg-white border-gray-200 hover:border-blue-500'}`}>
                <div className="shrink-0">
                  <item.icon className={isDark ? "text-blue-400" : "text-blue-600"} size={32} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                  <p className={isDark ? "text-slate-300" : "text-gray-600"}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Support Section */}
      <SupportSection isDark={isDark} />

      {/* Pricing Section */}
      <div className="py-20 max-w-7xl mx-auto px-6">
        <div className={`rounded-2xl p-12 text-center ${isDark ? 'bg-linear-to-r from-blue-600 to-blue-700' : 'bg-linear-to-r from-blue-500 to-blue-600'}`}>
          <h2 className={`text-3xl lg:text-4xl font-bold text-white mb-4`}>Always Free</h2>
          <p className={`mb-8 text-lg ${isDark ? 'text-blue-100' : 'text-blue-100'}`}>
            No credit card required. No hidden fees. TaskHive is completely free for everyone.
          </p>
          <div className="flex justify-center">
            <div className="text-center">
              <p className="text-white font-bold mb-2 text-2xl">FREE PLAN</p>
              <p className="text-5xl font-bold text-white mb-4">$0</p>
              <p className={`${isDark ? 'text-blue-100' : 'text-blue-100'} mb-6`}>Forever free for everyone</p>
              <ul className="space-y-2 text-left max-w-xs mx-auto">
                <li className="text-white flex items-center gap-2"><CheckCircle size={20} className="text-green-400" /> Unlimited tasks</li>
                <li className="text-white flex items-center gap-2"><CheckCircle size={20} className="text-green-400" /> Team collaboration</li>
                <li className="text-white flex items-center gap-2"><CheckCircle size={20} className="text-green-400" /> All features included</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection isDark={isDark} />

      {/* Final CTA Section */}
      <div className={`py-20 mb-0 ${isDark ? 'bg-linear-to-r from-blue-600 to-purple-600' : 'bg-linear-to-r from-blue-500 to-purple-500'}`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className={`text-4xl lg:text-5xl font-bold text-white mb-6`}>
            Ready to Transform Your Productivity?
          </h2>
          <p className={`text-xl mb-4 ${isDark ? 'text-blue-100' : 'text-blue-100'}`}>
            Join hundreds of teams already using TaskHive to manage their work efficiently and deliver exceptional results.
          </p>
          <p className={isDark ? 'text-blue-100 mb-10' : 'text-blue-100 mb-10'}>
            Start your free journey today. No credit card required.
          </p>
          <Link
            href="/login"
            className={`inline-block px-10 py-4 rounded-lg font-bold text-lg transition ${isDark ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-white text-blue-600 hover:bg-gray-100'}`}
          >
            Start Your Free Trial Today
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t py-12 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-900 border-gray-700'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap size={28} className={isDark ? "text-blue-400" : "text-blue-300"} />
            <h3 className="text-white font-bold text-xl">TaskHive</h3>
          </div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>Making task management simple, effective, and accessible for everyone.</p>
        </div>
          <div className={`border-t pt-8 text-center text-sm ${isDark ? 'border-slate-700 text-slate-400' : 'border-gray-700 text-gray-400'}`}>
            <p>&copy; 2026 TaskHive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
