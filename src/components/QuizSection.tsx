import React, { useState } from 'react';
import { QuizQuestion, StudentInfo } from '../types/content';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { AudioButton } from './AudioButton';
import { ScoreResultModal } from './ScoreResultModal';
import {
  CheckSquare,
  ArrowRight,
  ArrowLeft,
  User,
  GraduationCap,
  Hash,
  AlertCircle,
  HelpCircle,
  Award,
} from 'lucide-react';

interface QuizSectionProps {
  fontSize: 'normal' | 'large' | 'xlarge';
}

export const QuizSection: React.FC<QuizSectionProps> = ({ fontSize }) => {
  const [student, setStudent] = useState<StudentInfo>({
    fullName: '',
    gradeClass: 'ม.1/1',
    studentNo: '',
  });

  const [hasRegistered, setHasRegistered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const isSelected = selectedAnswers[currentQuestion?.id] !== undefined;
  const progressPercent = Math.round(((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student.fullName.trim()) {
      return;
    }
    setHasRegistered(true);
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate real-time score
      let score = 0;
      QUIZ_QUESTIONS.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctAnswerIndex) {
          score += 1;
        }
      });
      setFinalScore(score);
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
    setFinalScore(0);
  };

  // Text for TTS narration of the current question and options
  const getQuestionSpeechText = () => {
    if (!currentQuestion) return '';
    const optionLabels = ['ข้อ ก', 'ข้อ ข', 'ข้อ ค', 'ข้อ ง'];
    const optionsText = currentQuestion.options
      .map((opt, i) => `${optionLabels[i]} ${opt.replace(/^[ก-ง]\.\s*/, '')}`)
      .join('. ');
    return `คำถามข้อที่ ${currentIndex + 1}. ${currentQuestion.question}. ตัวเลือกได้แก่: ${optionsText}`;
  };

  const getQuestionFontSize = () => {
    if (fontSize === 'xlarge') return 'text-xl sm:text-2xl';
    if (fontSize === 'large') return 'text-lg sm:text-xl';
    return 'text-base sm:text-lg';
  };

  const getOptionFontSize = () => {
    if (fontSize === 'xlarge') return 'text-base sm:text-lg';
    if (fontSize === 'large') return 'text-sm sm:text-base';
    return 'text-sm sm:text-base';
  };

  return (
    <section id="quiz" className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Headline */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>แบบทดสอบท้ายบทเรียน 10 ข้อ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            วัดผลการเรียนรู้: พฤติกรรมการบริโภค
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            ตอบคำถามทีละข้อ เมื่อทำเสร็จสิ้นระบบจะคำนวณคะแนนแบบเรียลไทม์ พร้อมให้ออกรายงานส่งครู
          </p>
        </div>

        {/* Step 1: Student Information Registration Form */}
        {!hasRegistered ? (
          <div className="bg-amber-50/60 rounded-3xl border-2 border-amber-200 p-6 sm:p-8 max-w-lg mx-auto shadow-sm">
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white mx-auto flex items-center justify-center shadow-xs">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                กรอกข้อมูลผู้เรียนก่อนเริ่มทำแบบทดสอบ
              </h3>
              <p className="text-xs text-slate-500">
                ข้อมูลนี้จะปรากฏใน "บัตรรายงานผลคะแนน" สำหรับแคปหน้าจอส่งครูทาง LINE
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อ - นามสกุล นักเรียน <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="เช่น เด็กชายรักเรียน ขยันยิ่ง"
                    value={student.fullName}
                    onChange={(e) => setStudent({ ...student, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชั้น มัธยมศึกษา <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="เช่น ม.1/1"
                      value={student.gradeClass}
                      onChange={(e) => setStudent({ ...student, gradeClass: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    เลขที่ <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="เช่น 12"
                      value={student.studentNo}
                      onChange={(e) => setStudent({ ...student, studentNo: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md active:scale-98 transition-all cursor-pointer mt-2"
              >
                เริ่มทำแบบทดสอบ (10 ข้อ)
              </button>
            </form>
          </div>
        ) : (
          /* Step 2: Presenting Questions ONE BY ONE (นำเสนอทีละข้อ) */
          <div className="bg-white rounded-3xl border-2 border-amber-200 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header: Student badge & Progress Bar */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{student.fullName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-700 font-semibold">{student.gradeClass}</span>
                  <span aria-hidden="true">·</span>
                  <span>เลขที่ {student.studentNo}</span>
                </div>
                <div className="font-bold text-emerald-700">
                  ข้อที่ {currentIndex + 1} จาก {QUIZ_QUESTIONS.length}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3 bg-amber-50/70 p-4 sm:p-5 rounded-2xl border border-amber-200">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wide block">
                    คำถามข้อที่ {currentIndex + 1}
                  </span>
                  <h3 className={`${getQuestionFontSize()} font-extrabold text-slate-900 leading-snug`}>
                    {currentQuestion.question}
                  </h3>
                </div>

                {/* TTS Audio Narration for Students who struggle reading */}
                <AudioButton
                  id={`quiz-q-${currentQuestion.id}`}
                  textToRead={getQuestionSpeechText()}
                  label="ฟังโจทย์และตัวเลือก"
                  variant="primary"
                  className="py-2.5 px-3.5 text-xs shrink-0"
                />
              </div>

              {/* Large Touch Target Options for Tablets & Mobile */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                {currentQuestion.options.map((option, optIdx) => {
                  const isCurSelected = selectedAnswers[currentQuestion.id] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`min-h-[58px] p-4 rounded-2xl text-left transition-all active:scale-98 flex items-center justify-between gap-3 border-2 cursor-pointer ${
                        isCurSelected
                          ? 'bg-amber-100/80 border-amber-500 text-slate-900 font-semibold shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            isCurSelected
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {['ก', 'ข', 'ค', 'ง'][optIdx]}
                        </span>
                        <span className={`${getOptionFontSize()} leading-relaxed`}>
                          {option.replace(/^[ก-ง]\.\s*/, '')}
                        </span>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isCurSelected
                            ? 'border-amber-600 bg-amber-500'
                            : 'border-slate-300'
                        }`}
                      >
                        {isCurSelected && (
                          <span className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons (Prev / Next) */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                disabled={currentIndex === 0}
                onClick={handlePrev}
                className="py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ข้อก่อนหน้า</span>
              </button>

              <button
                disabled={!isSelected}
                onClick={handleNext}
                className={`py-3.5 px-6 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
                  isSelected
                    ? currentIndex === QUIZ_QUESTIONS.length - 1
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>
                  {currentIndex === QUIZ_QUESTIONS.length - 1
                    ? 'ส่งคำตอบ & ดูผลคะแนน'
                    : 'ข้อถัดไป'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Real-time Result Modal */}
        {isFinished && (
          <ScoreResultModal
            student={student}
            score={finalScore}
            totalQuestions={QUIZ_QUESTIONS.length}
            userAnswers={selectedAnswers}
            questions={QUIZ_QUESTIONS}
            onRetake={handleRetake}
          />
        )}
      </div>
    </section>
  );
};
