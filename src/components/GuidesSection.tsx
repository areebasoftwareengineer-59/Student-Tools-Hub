import { BookOpen, ArrowRight } from 'lucide-react';
import { GUIDES_DATA } from '../data/guidesData';
import { GuideArticle } from '../types';

interface GuidesSectionProps {
  onSelectGuide: (guide: GuideArticle) => void;
}

export function GuidesSection({ onSelectGuide }: GuidesSectionProps) {
  return (
    <section id="guides" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-cyan-400 font-mono tracking-wider">
            <span>KNOWLEDGE BASE</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>ACADEMIC CONCEPTS EXPLAINED</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight [text-wrap:balance]">
            Student Guides
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Concise, peer-reviewed explanations of grading formulas, degree classifications, and attendance calculations.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUIDES_DATA.map((article) => (
            <article
              key={article.id}
              className="glass-panel rounded-2xl p-6 sm:p-7 border border-white/[0.08] hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between text-left group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{article.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.readTime}</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-white/[0.06]">
                <button
                  onClick={() => onSelectGuide(article)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
