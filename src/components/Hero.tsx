import React from 'react';
import { LESSON_METADATA, TOPICS } from '../data/lessonData';
import { AudioButton } from './AudioButton';
import { Sparkles, ArrowRight, BookOpen, Award, CheckCircle } from 'lucide-react';

interface HeroProps {
  onNavigateTopic: (topicId: number) => void;
  onStartQuiz: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateTopic, onStartQuiz }) => {
  const heroIntroSpeech = `ยินดีต้อนรับสู่บทเรียนวิชาสังคมศึกษา รหัส ส 21103 ชั้นมัธยมศึกษาปีที่ 1 เรื่อง พฤติกรรมการบริโภค ตัวชี้วัด ส.3.1 ม.1/2 วิเคราะห์ค่านิยมและพฤติกรรมการบริโภคของคนในสังคมซึ่งมีผลต่อเศรษฐกิจของชุมชนและประเทศ บทเรียนนี้มี 4 เรื่องย่อย พร้อมเสียงบรรยายและแบบทดสอบท้ายบทเรียน ขอให้นักเรียนทุกคนตั้งใจเรียนรู้ไปด้วยกันครับ`;

  return (
    <section id="hero" className="pt-6 pb-12 sm:pt-10 sm:pb-16 bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Curriculum standard badge bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-amber-900 font-medium mb-4">
          <span className="font-semibold text-amber-700">{LESSON_METADATA.courseCode}</span>
          <span aria-hidden="true">·</span>
          <span>{LESSON_METADATA.gradeLevel}</span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-600">กลุ่มสาระการเรียนรู้สังคมศึกษา ศาสนา และวัฒนธรรม</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading and Intro */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-100/80 border border-amber-200/80 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>ตัวชี้วัด ส.3.1 ม.1/2</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                พฤติกรรมการบริโภค
              </h1>
              <p className="text-base sm:text-lg font-medium text-amber-800/90">
                วิเคราะห์ค่านิยมและพฤติกรรมการบริโภค ที่ส่งผลต่อเศรษฐกิจของชุมชนและประเทศ
              </p>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              เรียนรู้หลักการเป็น <span className="font-semibold text-slate-800">"ผู้บริโภคชาญฉลาด"</span> รู้เท่าทันการโฆษณา แยกแยะความจำเป็นกับความต้องการ เข้าใจผลกระทบต่อเงินหมุนเวียนในท้องถิ่น และพร้อมทำแบบทดสอบเก็บคะแนนส่งคุณครู
            </p>

            {/* Accessibility Read Aloud & Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <AudioButton
                id="hero-intro"
                textToRead={heroIntroSpeech}
                label="ฟังเสียงบรรยายบทนำ"
                variant="primary"
                className="py-3 px-5 text-base"
              />

              <button
                onClick={onStartQuiz}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-base font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Award className="w-5 h-5 text-emerald-700" />
                <span>ไปที่แบบทดสอบ</span>
              </button>
            </div>

            {/* Quick Key Outcomes */}
            <div className="pt-3 border-t border-amber-200/50 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>4 หัวข้อย่อยครบถ้วน</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>มีเสียงอ่านทุกย่อหน้า</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>รายงานคะแนนส่งครู</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-amber-200/70 bg-white">
              <img
                src={LESSON_METADATA.heroImage}
                alt="ภาพประกอบนักเรียนกับการบริโภคอย่างฉลาด"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover aspect-16/9 sm:aspect-4/3"
              />
              <div className="p-4 bg-white/95 border-t border-amber-100">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-amber-800">สื่ออินเทอร์แอคทีฟ ม.1</span>
                  <span>ระบบเสียงภาษาไทย TTS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Topic Jump Cards */}
        <div className="mt-10 pt-8 border-t border-amber-200/70">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <span>เนื้อหาบทเรียน 4 หัวข้อย่อย</span>
            </h2>
            <span className="text-xs text-slate-500">เลือกหัวข้อเพื่อเริ่มเรียน</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => onNavigateTopic(topic.id)}
                className="group p-4 bg-white hover:bg-amber-50/70 border border-amber-200/80 rounded-xl text-left transition-all hover:shadow-md hover:border-amber-400 active:scale-98 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block text-xs font-bold text-amber-700 mb-1">
                    เรื่องที่ {topic.id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 line-clamp-2 leading-snug">
                    {topic.title.replace(/^\d+\.\s*/, '')}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-normal">
                    {topic.subtitle}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-amber-700 pt-2 border-t border-slate-100 group-hover:border-amber-200">
                  <span>เข้าสู่เนื้อหา</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
