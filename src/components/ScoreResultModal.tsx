import React, { useState } from 'react';
import { StudentInfo, QuizQuestion } from '../types/content';
import { LESSON_METADATA } from '../data/lessonData';
import {
  Award,
  Share2,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Camera,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Printer,
} from 'lucide-react';

interface ScoreResultModalProps {
  student: StudentInfo;
  score: number;
  totalQuestions: number;
  userAnswers: Record<number, number>;
  questions: QuizQuestion[];
  onRetake: () => void;
}

export const ScoreResultModal: React.FC<ScoreResultModalProps> = ({
  student,
  score,
  totalQuestions,
  userAnswers,
  questions,
  onRetake,
}) => {
  const [copied, setCopied] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const percentage = Math.round((score / totalQuestions) * 100);

  const getEvaluation = () => {
    if (percentage >= 80) return { label: 'ระดับดีเยี่ยม (ยอดเยี่ยมมาก!)', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' };
    if (percentage >= 70) return { label: 'ระดับดีมาก (เก่งมาก)', color: 'text-teal-700 bg-teal-100 border-teal-300' };
    if (percentage >= 50) return { label: 'ผ่านเกณฑ์ (ทำได้ดี)', color: 'text-amber-700 bg-amber-100 border-amber-300' };
    return { label: 'ควรทบทวนบทเรียนเพิ่มเติม', color: 'text-rose-700 bg-rose-100 border-rose-300' };
  };

  const evalStatus = getEvaluation();
  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopySummary = () => {
    const textToCopy = `📋 รายงานผลการทำแบบทดสอบวิชาสังคมศึกษา
รหัสวิชา: ${LESSON_METADATA.courseCode} ${LESSON_METADATA.courseName}
หน่วยการเรียนรู้: ${LESSON_METADATA.unitTitle}
ตัวชี้วัด: ส 3.1 ม.1/0 (วิเคราะห์ค่านิยมและพฤติกรรมการบริโภค)
---------------------------
ชื่อ-นามสกุล: ${student.fullName}
ชั้น: ${student.gradeClass} เลขที่: ${student.studentNo}
คะแนนที่ได้: ${score}/${totalQuestions} คะแนน (${percentage}%)
ผลการประเมิน: ${evalStatus.label}
วันที่ทำแบบทดสอบ: ${currentDate}
---------------------------
ส่งงานการบ้านผ่าน LINE เรียบร้อยครับ/ค่ะ`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-4 border-amber-300 overflow-hidden my-6">
        {/* Certificate Card Printable Area */}
        <div id="certificate-card" className="p-6 sm:p-8 bg-gradient-to-b from-amber-50/80 via-white to-amber-50/40">
          {/* Header of Certificate */}
          <div className="text-center pb-5 border-b-2 border-dashed border-amber-200 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-200/80 text-amber-900 rounded-full text-xs font-bold">
              <Award className="w-4 h-4 text-amber-700" />
              <span>บัตรรายงานผลคะแนนการเรียนรู้</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 pt-1">
              วิชาสังคมศึกษา รหัส {LESSON_METADATA.courseCode} ({LESSON_METADATA.gradeLevel})
            </h2>
            <p className="text-sm sm:text-base font-bold text-amber-800">
              เรื่อง {LESSON_METADATA.unitTitle}
            </p>
            <p className="text-xs text-slate-600 max-w-lg mx-auto">
              {LESSON_METADATA.indicator}
            </p>
          </div>

          {/* Student Profile Info */}
          <div className="my-5 p-4 bg-white rounded-2xl border border-amber-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-center sm:text-left">
            <div>
              <span className="text-xs text-slate-500 block">ชื่อ-นามสกุล ผู้เรียน:</span>
              <span className="text-base sm:text-lg font-bold text-slate-900">
                {student.fullName || 'นักเรียน ม.1'}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">ระดับชั้น:</span>
              <span className="text-base sm:text-lg font-bold text-amber-800">
                {student.gradeClass || 'ม.1'}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">เลขที่:</span>
              <span className="text-base sm:text-lg font-bold text-amber-800">
                {student.studentNo || '-'}
              </span>
            </div>
          </div>

          {/* Score Display Area */}
          <div className="text-center py-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl text-white shadow-md space-y-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-amber-100">
              คะแนนที่ทำได้ (Real-time Score)
            </span>
            <div className="flex items-center justify-center gap-2 font-mono">
              <span className="text-5xl sm:text-6xl font-black">{score}</span>
              <span className="text-2xl sm:text-3xl font-medium text-amber-200">
                / {totalQuestions}
              </span>
            </div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs sm:text-sm font-bold text-white">
              คิดเป็น {percentage}% · {evalStatus.label}
            </div>
          </div>

          {/* Submission Guidance via LINE (Highlighted Banner) */}
          <div className="mt-5 p-4 sm:p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-400 text-emerald-950 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Camera className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-extrabold text-emerald-900 flex items-center justify-center sm:justify-start gap-1.5">
                <span>📸 คำแนะนำสำหรับนักเรียน:</span>
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-emerald-800">
                ให้นักเรียน <strong className="underline decoration-emerald-500">แค็ปหน้าจอนี้ (Screenshot)</strong> ให้เห็นหัวข้อ ชื่อ-นามสกุล ชั้น เลขที่ และคะแนน แล้วส่งการบ้านผ่าน <strong className="text-emerald-950">Line ของคุณครู</strong> ได้เลยครับ!
              </p>
            </div>
          </div>

          <div className="mt-3 text-right text-xs text-slate-400">
            วันที่บันทึกผล: {currentDate}
          </div>
        </div>

        {/* Action Controls for Students */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-3 no-print">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleCopySummary}
              className="py-3 px-4 rounded-xl text-sm font-bold text-emerald-800 bg-white hover:bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>คัดลอกข้อความสำเร็จ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-emerald-700" />
                  <span>คัดลอกข้อความสรุปส่ง LINE</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="py-3 px-4 rounded-xl text-sm font-bold text-slate-800 bg-white hover:bg-slate-100 border-2 border-slate-300 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Printer className="w-4 h-4 text-slate-700" />
              <span>พิมพ์ / บันทึกภาพเอกสาร</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={() => setShowReview(!showReview)}
              className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{showReview ? 'ซ่อนเฉลยคำตอบ' : 'ดูเฉลยละเอียดและทบทวนความรู้'}</span>
              {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <button
              onClick={onRetake}
              className="py-3 px-5 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ทำแบบทดสอบใหม่</span>
            </button>
          </div>

          {/* Detailed Question Review Accordion */}
          {showReview && (
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-4 max-h-96 overflow-y-auto pr-1">
              <h5 className="text-sm font-bold text-slate-800">
                เฉลยและคำอธิบายละเอียด (ครบ 10 ข้อ):
              </h5>
              {questions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctAnswerIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-xl border text-xs sm:text-sm space-y-2 ${
                      isCorrect
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : 'bg-rose-50/70 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <span className="font-bold text-slate-800">
                          ข้อ {idx + 1}: {q.question}
                        </span>
                      </div>
                    </div>

                    <div className="pl-6 space-y-1 text-slate-600">
                      <div>
                        <span className="font-semibold">คำตอบที่คุณเลือก: </span>
                        <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                          {userAns !== undefined ? q.options[userAns] : 'ไม่ได้ตอบ'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div>
                          <span className="font-semibold text-emerald-800">คำตอบที่ถูกต้อง: </span>
                          <span className="text-emerald-800 font-bold">
                            {q.options[q.correctAnswerIndex]}
                          </span>
                        </div>
                      )}
                      <div className="p-2 bg-white/80 rounded-lg text-slate-700 mt-1.5 border border-slate-200/50">
                        <strong className="text-amber-800">💡 คำอธิบาย: </strong>
                        {q.explanation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
