import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TopicCard } from './components/TopicCard';
import { InteractiveSimulators } from './components/InteractiveSimulators';
import { QuizSection } from './components/QuizSection';
import { TOPICS, LESSON_METADATA } from './data/lessonData';
import { BookOpen, GraduationCap, Sparkles, MessageCircle } from 'lucide-react';

export default function App() {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  const scrollTo = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateTopic = (topicId: number) => {
    scrollTo(`topic-${topicId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 text-slate-800">
      {/* Navigation Top Bar */}
      <Navbar
        fontSize={fontSize}
        setFontSize={setFontSize}
        onNavigate={scrollTo}
      />

      {/* Main Content Area */}
      <main className="flex-1 space-y-8 sm:space-y-12">
        {/* Hero Section */}
        <Hero
          onNavigateTopic={handleNavigateTopic}
          onStartQuiz={() => scrollTo('quiz')}
        />

        {/* 4 Core Lesson Topics */}
        <section id="lessons" className="py-6 sm:py-10 max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-amber-200">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 mb-1">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>เนื้อหาหลัก 4 เรื่องย่อย</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                หน่วยการเรียนรู้: พฤติกรรมการบริโภค
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              กดปุ่ม <span className="text-amber-700 font-bold">"ฟังเสียงบรรยาย"</span> ในแต่ละหัวข้อ เพื่อฟังเสียงอ่านภาษาไทยแบบชัดเจน
            </p>
          </div>

          <div className="space-y-12">
            {TOPICS.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                fontSize={fontSize}
              />
            ))}
          </div>
        </section>

        {/* Interactive Lab / Decision Sandbox */}
        <InteractiveSimulators />

        {/* End-of-Lesson Assessment (Quiz) */}
        <QuizSection fontSize={fontSize} />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-10 mt-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                <span>วิชาสังคมศึกษา ศาสนา และวัฒนธรรม ({LESSON_METADATA.courseCode})</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                {LESSON_METADATA.gradeLevel} · {LESSON_METADATA.unitTitle}
              </p>
              <p className="text-xs text-amber-300/80 font-medium pt-1">
                {LESSON_METADATA.indicator}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>ส่งงานการบ้านผ่าน Line ของคุณครู</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>สื่อการสอนดิจิทัลเพื่อการเรียนรู้อย่างเท่าเทียม พร้อมระบบเสียงบรรยายภาษาไทย TTS</span>
            <span>หลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
