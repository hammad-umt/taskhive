'use client';

import { 
  Slack, 
  Mail, 
  MessageSquare, 
  FileJson, 
  Cloud,
  Globe,
  Users,
  Zap
} from 'lucide-react';

interface SupportSectionProps {
  isDark?: boolean;
}

export function SupportSection({ isDark = true }: SupportSectionProps) {
  const integrations = [
    { icon: Slack, name: 'Slack', desc: 'Receive notifications in Slack' },
    { icon: Mail, name: 'Email', desc: 'Email notifications & reports' },
    { icon: MessageSquare, name: 'Live Chat', desc: '24/7 live customer support' },
    { icon: FileJson, name: 'API', desc: 'REST API for integrations' },
    { icon: Cloud, name: 'Cloud Storage', desc: 'Google Drive & Dropbox sync' },
    { icon: Globe, name: 'Web Access', desc: 'Access from any browser' },
    { icon: Users, name: 'Team Management', desc: 'Unlimited team members' },
    { icon: Zap, name: 'Webhooks', desc: 'Real-time data sync' }
  ];

  return (
    <div className={`border-y py-24 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            What TaskHive Supports
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
            Seamless integrations and comprehensive support options for your team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {integrations.map((item, index) => (
            <div 
              key={index} 
              className={`border p-6 rounded-lg transition duration-300 ${
                isDark
                  ? 'bg-slate-700/50 border-slate-600 hover:border-blue-500/50 hover:bg-slate-700'
                  : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border mb-4 ${
                isDark
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-blue-100 border-blue-300'
              }`}>
                <item.icon size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {item.name}
              </h3>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className={`mt-16 p-8 rounded-lg border ${
          isDark
            ? 'bg-blue-600/10 border-blue-500/30'
            : 'bg-blue-100 border-blue-300'
        }`}>
          <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Community Driven</h3>
          <p className={isDark ? 'text-slate-300' : 'text-gray-700'}>
            TaskHive is completely free and open to everyone. We&apos;re committed to providing a feature-rich platform 
            that works for individuals, small teams, and growing organizations without any cost, limitations, or paywalls.
          </p>
        </div>
      </div>
    </div>
  );
}
