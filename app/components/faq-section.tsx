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
    answer: 'Yes! TaskHive offers a free plan for individuals and small teams. We also have affordable Pro plans for businesses with advanced features.'
  },
  {
    question: 'How secure is my data?',
    answer: 'We use industry-leading encryption and security practices. All data is encrypted in transit and at rest, and we\'re GDPR compliant. Your privacy is our top priority.'
  },
  {
    question: 'Can I integrate TaskHive with other tools?',
    answer: 'Yes! TaskHive supports integrations with popular tools like Slack, Google Workspace, Microsoft Teams, and more. We also have an API for custom integrations.'
  },
  {
    question: 'How do I get support?',
    answer: 'We offer 24/7 email support, live chat, and a comprehensive help center. Pro plan users get priority support with faster response times.'
  },
  {
    question: 'Can I export my data?',
    answer: 'Yes, you can export all your data at any time in various formats including CSV, JSON, and Excel. You have complete ownership of your data.'
  },
  {
    question: 'Will there be paid plans in the future?',
    answer: 'TaskHive is completely free and we plan to keep it free forever. There are no paid plans or premium versions planned.'
  },
  {
    question: 'Is there a mobile app?',
    answer: 'TaskHive is fully responsive and works great on mobile browsers. Native mobile apps for iOS and Android are coming soon.'
  },
  {
    question: 'Can I customize workflows for my team?',
    answer: 'Absolutely! TaskHive allows you to create custom task statuses, workflows, fields, and automation rules to match your team\'s unique processes.'
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
