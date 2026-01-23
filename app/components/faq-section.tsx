'use client';

import { FAQItem } from './faq-item';

interface FAQData {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs?: FAQData[];
}

const defaultFAQs: FAQData[] = [
  {
    question: 'Is TaskHive free to use?',
    answer: 'Yes! TaskHive is completely free for everyone. No credit card required and no hidden fees.'
  },
  {
    question: 'How secure is my data?',
    answer: 'We use industry-leading encryption and security practices. All data is encrypted in transit and at rest, and we\'re GDPR compliant. Your privacy is our top priority.'
  },
  {
    question: 'How do I get support?',
    answer: 'We offer support through email and our help center. Our team is dedicated to helping you get the most out of TaskHive.'
  },
  {
    question: 'Can I export my data?',
    answer: 'Yes, you can export all your data at any time in various formats including CSV and JSON. You have complete ownership of your data.'
  },
  {
    question: 'Is TaskHive responsive on mobile?',
    answer: 'Yes! TaskHive is fully responsive and works seamlessly on mobile devices, tablets, and desktops. Access your tasks anytime, anywhere.'
  },
  {
    question: 'Can I customize workflows for my team?',
    answer: 'Absolutely! TaskHive allows you to create custom task statuses, set priorities, assign team members, and manage all workflows to match your team\'s unique processes.'
  },
  {
    question: 'How do I manage my team?',
    answer: 'You can invite team members, assign roles (admin or user), manage permissions, and track who is working on what with real-time updates and notifications.'
  },
  {
    question: 'Can I track task progress?',
    answer: 'Yes! TaskHive provides real-time progress tracking with status indicators (Pending, In Progress, On Hold, Completed), priority levels, and detailed task views.'
  }
];

interface FAQSectionExtendedProps extends FAQSectionProps {
  isDark?: boolean;
}

export function FAQSection({ faqs = defaultFAQs, isDark = true }: FAQSectionExtendedProps) {
  return (
    <div className="py-24 max-w-4xl mx-auto px-6">
      <h2 className={`text-4xl font-bold mb-12 text-center ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <FAQItem 
            key={index} 
            question={faq.question} 
            answer={faq.answer}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
}
