'use client';

interface FAQItemProps {
  question: string;
  answer: string;
  isDark?: boolean;
}

export function FAQItem({ question, answer, isDark = true }: FAQItemProps) {
  return (
    <details className={`group border rounded-lg p-6 cursor-pointer transition ${
      isDark 
        ? 'bg-slate-700/50 border-slate-600 hover:border-blue-500/50 hover:bg-slate-700' 
        : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50'
    }`}>
      <summary className={`flex items-center justify-between font-semibold ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        {question}
        <span className="transition group-open:rotate-180">▼</span>
      </summary>
      <p className={`mt-4 ${
        isDark ? 'text-slate-300' : 'text-gray-600'
      }`}>{answer}</p>
    </details>
  );
}
