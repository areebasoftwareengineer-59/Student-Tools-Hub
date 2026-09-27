import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQItem } from '../types';

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'what-is-gpa',
    question: 'What is GPA?',
    answer:
      'GPA stands for Grade Point Average. It is a standard numerical metric (typically ranging from 0.0 to 4.0 or 4.33) that measures a student’s average academic performance across courses completed in a single semester or term, weighted by each course’s credit hours.',
  },
  {
    id: 'what-is-cgpa',
    question: 'What is CGPA?',
    answer:
      'CGPA stands for Cumulative Grade Point Average. Unlike GPA which measures a single semester, CGPA calculates your cumulative, overall average across all semesters and credit hours completed throughout your entire collegiate or university degree program.',
  },
  {
    id: 'how-is-gpa-calculated',
    question: 'How is GPA calculated?',
    answer:
      'GPA is calculated using the formula: GPA = Total Quality Points ÷ Total Credit Hours. Each course’s Quality Points equal the numerical grade point (e.g., A = 4.0) multiplied by its credit value. Summing these points and dividing by total credits gives your semester GPA.',
  },
  {
    id: 'how-is-percentage-calculated',
    question: 'How is percentage calculated?',
    answer:
      'Marks percentage is calculated as: Percentage (%) = (Marks Obtained ÷ Total Maximum Marks) × 100. For converting 10-point CGPA to percentage, universities following Indian/CBSE standards use the established multiplier: Percentage = CGPA × 9.5.',
  },
  {
    id: 'how-is-attendance-calculated',
    question: 'How is attendance percentage calculated?',
    answer:
      'Attendance percentage is calculated as: (Classes Attended ÷ Total Classes Conducted) × 100. To find how many consecutive classes you must attend to reach a 75% target, use our calculator, which computes the exact formula: ceil((0.75 × Total - Attended) ÷ 0.25).',
  },
  {
    id: 'are-calculators-free',
    question: 'Are the calculators free?',
    answer:
      'Yes, 100% free forever. There are no subscriptions, paywalls, premium tiers, or hidden fees. All academic calculators and student guides are freely accessible to students and faculty worldwide.',
  },
  {
    id: 'can-i-use-on-mobile',
    question: 'Can I use the calculators on mobile?',
    answer:
      'Absolutely. Student Tools Hub is fully responsive and optimized for mobile smartphones, tablets, laptops, and desktops. The 3D visuals automatically adjust for battery and performance efficiency on handheld devices.',
  },
];

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>('what-is-gpa');

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 relative bg-white/[0.01] border-y border-white/[0.04]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-cyan-400 font-mono tracking-wider">
            <span>FREQUENTLY ASKED QUESTIONS</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>CLEAR ANSWERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight [text-wrap:balance]">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Everything you need to know about academic grading, cumulative points, and how our calculators work.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3 text-left">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="glass-panel rounded-xl border border-white/[0.08] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-white font-display pr-4">
                    {item.question}
                  </span>
                  <div className={`w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400 bg-cyan-950/40' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-white/[0.04] pt-3 animate-in fade-in duration-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Help footer prompt */}
        <div className="mt-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Still have questions about your university's grading scale? Visit our Guides or Contact us.</span>
        </div>
      </div>
    </section>
  );
}
