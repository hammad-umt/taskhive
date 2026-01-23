'use client';

import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Zap, 
  Shield, 
  BarChart3, 
  Clock, 
  MessageSquare,
  Smartphone,
  Settings,
  TrendingUp,
  Award,
  Lightbulb,
  Moon,
  Sun
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
              Powerful Features for Every Team
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              Everything you need to manage tasks, collaborate with your team, and achieve your goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className={`border p-8 rounded-lg transition duration-300 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-blue-500/50 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50'}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-100 border-blue-300'}`}>
                <Users size={24} className={isDark ? "text-blue-400" : "text-blue-600"} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Team Collaboration</h3>
              <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Assign tasks, share updates, and collaborate with team members in real-time. Keep everyone synchronized and informed.
              </p>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Assign multiple team members</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Real-time notifications</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Comments & discussions</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className={`border p-8 rounded-lg transition duration-300 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-yellow-500/50 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-yellow-500 hover:bg-yellow-50'}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${isDark ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-100 border-yellow-300'}`}>
                <Zap size={24} className={isDark ? "text-yellow-400" : "text-yellow-600"} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Boost Productivity</h3>
              <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Streamline your workflow with intuitive task management, priority levels, and deadline tracking.
              </p>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Priority levels</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Deadline management</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Custom workflows</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className={`border p-8 rounded-lg transition duration-300 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-green-500/50 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-green-500 hover:bg-green-50'}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-100 border-green-300'}`}>
                <Shield size={24} className={isDark ? "text-green-400" : "text-green-600"} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Secure & Reliable</h3>
              <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Your data is protected with enterprise-grade security and encryption standards.
              </p>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> End-to-end encryption</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> GDPR compliant</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Regular backups</li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className={`border p-8 rounded-lg transition duration-300 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-purple-500/50 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-purple-500 hover:bg-purple-50'}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${isDark ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-100 border-purple-300'}`}>
                <BarChart3 size={24} className={isDark ? "text-purple-400" : "text-purple-600"} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Advanced Analytics</h3>
              <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Track progress with beautiful dashboards and insightful reports to measure team performance.
              </p>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Progress tracking</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Performance metrics</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Custom reports</li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className={`border p-8 rounded-lg transition duration-300 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-pink-500/50 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-pink-500 hover:bg-pink-50'}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${isDark ? 'bg-pink-500/10 border-pink-500/30' : 'bg-pink-100 border-pink-300'}`}>
                <Clock size={24} className={isDark ? "text-pink-400" : "text-pink-600"} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Time Management</h3>
              <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Track time spent on tasks, set deadlines, and manage project timelines effectively.
              </p>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Time tracking</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Calendar view</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Deadline alerts</li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className={`border p-8 rounded-lg transition duration-300 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-orange-500/50 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-orange-500 hover:bg-orange-50'}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${isDark ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-100 border-orange-300'}`}>
                <Settings size={24} className={isDark ? "text-orange-400" : "text-orange-600"} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Customizable & Flexible</h3>
              <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Tailor TaskHive to match your unique workflow and business processes.
              </p>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Custom fields</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Automation rules</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> API access</li>
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
              { icon: MessageSquare, title: 'Real-Time Collaboration', desc: 'Instant notifications and updates keep your team connected' },
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

      {/* Trust & Social Proof Section */}
      <div className={`border-y py-16 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className={`text-xl font-semibold mb-8 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Trusted by leading companies and teams</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-50">
            <div className={`h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-300 text-gray-600'}`}>
              Company A
            </div>
            <div className={`h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-300 text-gray-600'}`}>
              Company B
            </div>
            <div className={`h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-300 text-gray-600'}`}>
              Company C
            </div>
            <div className={`h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-300 text-gray-600'}`}>
              Company D
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap size={24} className={isDark ? "text-blue-400" : "text-blue-300"} />
                <h3 className="text-white font-bold text-lg">TaskHive</h3>
              </div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>Making task management simple, effective, and accessible for everyone.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                <li><a href="#features" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>Features</a></li>
                <li><a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>Pricing</a></li>
                <li><a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>Security</a></li>
                <li><a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                <li><a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>About Us</a></li>
                <li><a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>Blog</a></li>
                <li><a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>Careers</a></li>
                <li><a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                <li><a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>Help Center</a></li>
                <li><a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>Documentation</a></li>
                <li><a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>API Docs</a></li>
                <li><a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                <li><a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>Privacy Policy</a></li>
                <li><a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>Terms of Service</a></li>
                <li><a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>Cookie Policy</a></li>
                <li><a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>GDPR</a></li>
              </ul>
            </div>
          </div>
          
          {/* Newsletter Section */}
          <div className={`border-t pt-12 mb-12 ${isDark ? 'border-slate-700' : 'border-gray-700'}`}>
            <div className="max-w-md">
              <h4 className="text-white font-semibold mb-4">Subscribe to our newsletter</h4>
              <p className={`mb-4 text-sm ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>Get the latest updates and productivity tips delivered to your inbox.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className={`flex-1 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 ${isDark ? 'bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'}`}
                />
                <button className={`px-6 py-2 rounded-lg font-semibold transition ${isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className={`border-t pt-8 flex flex-col sm:flex-row justify-between items-center text-sm ${isDark ? 'border-slate-700 text-slate-400' : 'border-gray-700 text-gray-400'}`}>
            <p>&copy; 2026 TaskHive. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>Twitter</a>
              <a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>LinkedIn</a>
              <a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>GitHub</a>
              <a href="#" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-200'} transition`}>Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
