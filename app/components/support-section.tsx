'use client';

import { 
  Mail, 
  Globe,
} from 'lucide-react';

interface SupportSectionProps {
  isDark?: boolean;
}

export function SupportSection({ isDark = true }: SupportSectionProps) {
  const features = [
    { icon: Mail, name: 'Email Support', desc: 'Get help via email' },
    { icon: Globe, name: 'Web Access', desc: 'Access from any browser' }
  ];

  return (
    <div className={`border-y py-24 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Support & Access
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
            TaskHive is designed to be simple and accessible for everyone
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {features.map((item, index) => (
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
          <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Completely Free</h3>
          <p className={isDark ? 'text-slate-300' : 'text-gray-700'}>
            TaskHive is completely free for everyone. We&apos;re committed to providing a feature-rich platform 
            that works for individuals, small teams, and growing organizations without any cost, limitations, or paywalls.
          </p>
        </div>
      </div>
    </div>
  );
}
