import React from 'react';
import { TopicContent } from '../types/content';
import { AudioButton } from './AudioButton';
import { CheckCircle2, Bookmark, Lightbulb, ChevronRight } from 'lucide-react';

interface TopicCardProps {
  topic: TopicContent;
  fontSize: 'normal' | 'large' | 'xlarge';
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, fontSize }) => {
  const getHeadingSize = () => {
    if (fontSize === 'xlarge') return 'text-xl sm:text-2xl';
    if (fontSize === 'large') return 'text-lg sm:text-xl';
    return 'text-base sm:text-lg';
  };

  const getBodySize = () => {
    if (fontSize === 'xlarge') return 'text-base sm:text-lg';
    if (fontSize === 'large') return 'text-sm sm:text-base';
    return 'text-sm';
  };

  return (
    <article
      id={`topic-${topic.id}`}
      className="bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden transition-all hover:shadow-md"
    >
      {/* Top Banner with Image and Headline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-amber-100">
        {/* Topic Visual */}
        <div className="lg:col-span-5 bg-amber-50/40 relative overflow-hidden">
          <img
            src={topic.image}
            alt={topic.title}
            referrerPolicy="no-referrer"
            className="w-full h-full min-h-[220px] max-h-[300px] object-cover object-center"
          />
        </div>

        {/* Topic Title & Primary Audio */}
        <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-100/90 px-2.5 py-1 rounded-md">
                เรื่องที่ {topic.id}
              </span>
              <AudioButton
                id={`topic-main-${topic.id}`}
                textToRead={topic.narratorText}
                label="ฟังเสียงบทนี้"
                variant="primary"
                className="py-2 px-3 text-xs"
              />
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {topic.title}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-amber-800/90">
              {topic.subtitle}
            </p>
          </div>

          <p className={`${getBodySize()} text-slate-600 leading-relaxed bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/50`}>
            {topic.summary}
          </p>
        </div>
      </div>

      {/* Sections Content */}
      <div className="p-5 sm:p-7 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topic.sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 rounded-xl p-4 sm:p-5 border border-slate-200/70 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className={`${getHeadingSize()} font-bold text-slate-800 leading-snug`}>
                    {section.heading}
                  </h4>
                  {section.readText && (
                    <AudioButton
                      id={`section-${topic.id}-${idx}`}
                      textToRead={section.readText}
                      variant="compact"
                    />
                  )}
                </div>

                <p className={`${getBodySize()} text-slate-600`}>
                  {section.description}
                </p>

                <ul className="space-y-2 pt-1">
                  {section.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                      <span className={`${getBodySize()} text-slate-700 leading-relaxed`}>
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Key Takeaway Banner */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-300 flex items-start gap-3">
          <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-900 block mb-0.5">
              ข้อคิดสำคัญประจำเรื่อง (Key Takeaway)
            </span>
            <p className={`${getBodySize()} font-semibold text-slate-800 leading-relaxed`}>
              {topic.keyTakeaway}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
