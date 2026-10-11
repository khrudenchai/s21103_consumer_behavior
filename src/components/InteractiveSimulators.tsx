import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, Store, Globe, RefreshCw, ShoppingCart, HelpCircle } from 'lucide-react';
import { AudioButton } from './AudioButton';

export const InteractiveSimulators: React.FC = () => {
  // --- Game 1: Need vs Want ---
  const initialItems = [
    { id: 1, name: 'อาหารกลางวัน 5 หมู่ และน้ำดื่มสะอาด', type: 'need', icon: '🍱', reason: 'ปัจจัย 4 จำเป็นต่อการมีชีวิตและการเจริญเติบโต' },
    { id: 2, name: 'ชานมไข่มุกหวานร้อยแก้วใหญ่พิเศษ', type: 'want', icon: '🧋', reason: 'ตอบสนองความอยากชั่วคราว กินบ่อยอาจเสี่ยงต่อสุขภาพ' },
    { id: 3, name: 'ยาสามัญประจำบ้านและชุดปฐมพยาบาล', type: 'need', icon: '💊', reason: 'ปัจจัย 4 ขาดไม่ได้เมื่อเจ็บป่วยหรือเกิดอุบัติเหตุ' },
    { id: 4, name: 'รองเท้าแตะแบรนด์เนมตามกระแสอินฟลูเอนเซอร์', type: 'want', icon: '👟', reason: 'เป็นสินค้าแฟชั่น ถ้ามีรองเท้าใช้งานได้อยู่แล้วก็ยังไม่จำเป็น' },
    { id: 5, name: 'สมุด ปากกา อุปกรณ์การเรียนจำเป็น', type: 'need', icon: '📚', reason: 'จำเป็นต่อการศึกษาเพื่อพัฒนาตนเอง' },
    { id: 6, name: 'กล่องสุ่มโมเดลการ์ตูนตัวลับ', type: 'want', icon: '🧸', reason: 'ความพึงพอใจส่วนตัว ควรซื้อเมื่อมีเงินเก็บเหลือหลังจ่ายสิ่งจำเป็นแล้ว' },
  ];

  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [scoreNeedWant, setScoreNeedWant] = useState(0);
  const [completedNeedWant, setCompletedNeedWant] = useState(false);

  const handleSelectType = (selectedType: 'need' | 'want') => {
    const currentItem = initialItems[currentItemIndex];
    const isCorrect = selectedType === currentItem.type;

    if (isCorrect) {
      setScoreNeedWant((prev) => prev + 1);
      setFeedback({
        isCorrect: true,
        message: `ถูกต้อง! ${currentItem.name} คือ "${selectedType === 'need' ? 'ความจำเป็น (Need)' : 'ความอยากได้ (Want)'}" เพราะ ${currentItem.reason}`,
      });
    } else {
      setFeedback({
        isCorrect: false,
        message: `ยังไม่ใช่นะครับ! ${currentItem.name} จัดเป็น "${currentItem.type === 'need' ? 'ความจำเป็น (Need)' : 'ความอยากได้ (Want)'}" เพราะ ${currentItem.reason}`,
      });
    }

    setTimeout(() => {
      if (currentItemIndex < initialItems.length - 1) {
        setCurrentItemIndex((prev) => prev + 1);
        setFeedback(null);
      } else {
        setCompletedNeedWant(true);
      }
    }, 2000);
  };

  const handleResetGame = () => {
    setCurrentItemIndex(0);
    setScoreNeedWant(0);
    setFeedback(null);
    setCompletedNeedWant(false);
  };

  // --- Simulator 2: Community Money Flow ---
  const [selectedSpendChoice, setSelectedSpendChoice] = useState<'community' | 'foreign'>('community');

  return (
    <section id="interactive" className="py-12 bg-amber-50/50 border-y border-amber-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-200/60 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>ห้องทดลองคิดอินเทอร์แอคทีฟ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            จำลองสถานการณ์การบริโภคจริง
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            ฝึกคิด วิเคราะห์ และเห็นผลกระทบของพฤติกรรมการบริโภคด้วยตนเอง
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Need vs Want Sorter Game */}
          <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚖️</span>
                  <h3 className="text-base font-bold text-slate-900">
                    เกมแยกแยะ: ความจำเป็น (Need) vs ความอยากได้ (Want)
                  </h3>
                </div>
                <AudioButton
                  id="game-need-want-intro"
                  textToRead="เกมแยกแยะความจำเป็นกับความอยากได้ ให้นักเรียนเลือกว่าสิ่งของที่ปรากฏจัดเป็นความจำเป็นตามปัจจัยสี่ หรือเป็นความต้องการทางอารมณ์"
                  variant="compact"
                />
              </div>

              <p className="text-xs text-slate-500 mt-2">
                ทดสอบความเข้าใจเรื่องหลักการบริโภคที่ดี (ข้อที่ {currentItemIndex + 1}/{initialItems.length})
              </p>

              {!completedNeedWant ? (
                <div className="mt-6 text-center space-y-4">
                  <div className="py-8 px-4 bg-amber-50/60 rounded-2xl border border-amber-200/70">
                    <span className="text-5xl block mb-2">{initialItems[currentItemIndex].icon}</span>
                    <h4 className="text-lg font-bold text-slate-800">
                      {initialItems[currentItemIndex].name}
                    </h4>
                  </div>

                  {feedback && (
                    <div
                      className={`p-3 rounded-xl text-xs sm:text-sm font-medium flex items-start gap-2 text-left ${
                        feedback.isCorrect
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {feedback.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                      <span>{feedback.message}</span>
                    </div>
                  )}

                  {/* Tablet Friendly Big Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      disabled={!!feedback}
                      onClick={() => handleSelectType('need')}
                      className="py-3.5 px-4 rounded-xl text-sm sm:text-base font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-300 disabled:opacity-50 transition-all active:scale-95 cursor-pointer shadow-xs"
                    >
                      🟢 ความจำเป็น (Need)
                    </button>
                    <button
                      disabled={!!feedback}
                      onClick={() => handleSelectType('want')}
                      className="py-3.5 px-4 rounded-xl text-sm sm:text-base font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 disabled:opacity-50 transition-all active:scale-95 cursor-pointer shadow-xs"
                    >
                      🟡 ความอยากได้ (Want)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-8 py-8 px-4 text-center bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
                  <span className="text-4xl">🎉</span>
                  <h4 className="text-lg font-bold text-emerald-900">เก่งมาก! ทำครบทุกข้อแล้ว</h4>
                  <p className="text-sm text-emerald-800">
                    คุณตอบถูกไป {scoreNeedWant} จากทั้งหมด {initialItems.length} ข้อ
                  </p>
                  <p className="text-xs text-slate-600">
                    จำไว้เสมอว่า: เมื่อเงินมีจำกัด ให้เลือก "ความจำเป็น" ก่อน "ความอยากได้" เสมอ!
                  </p>
                  <button
                    onClick={handleResetGame}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-800 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>เล่นใหม่อีกรอบ</span>
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>คะแนนสะสม: {scoreNeedWant} คะแนน</span>
              <span>หมวด: หลักการบริโภคที่ดี</span>
            </div>
          </div>

          {/* Card 2: Community Money Flow Simulator (ตัวชี้วัด ส.3.1 ม.1/2) */}
          <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  <h3 className="text-base font-bold text-slate-900">
                    เส้นทางเงิน 100 บาท: ผลต่อชุมชนและประเทศ
                  </h3>
                </div>
                <AudioButton
                  id="money-flow-intro"
                  textToRead="แบบจำลองเส้นทางเงินหนึ่งร้อยบาท เมื่อเราซื้อสินค้าในชุมชน เงินจะหมุนเวียนสร้างรายได้ให้คนในท้องถิ่น แต่ถ้าซื้อสินค้านำเข้าฟุ่มเฟือย เงินส่วนใหญ่จะไหลออกนอกประเทศ"
                  variant="compact"
                />
              </div>

              <p className="text-xs text-slate-500 mt-2">
                ทดลองเลือกวิธีใช้เงิน 100 บาท เพื่อสังเกตผลกระทบตามตัวชี้วัด ส.3.1 ม.1/2
              </p>

              {/* Segmented Choice Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setSelectedSpendChoice('community')}
                  className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    selectedSpendChoice === 'community'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Store className="w-4 h-4 inline-block mr-1.5" />
                  ซื้อของที่ตลาดชุมชน
                </button>
                <button
                  onClick={() => setSelectedSpendChoice('foreign')}
                  className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    selectedSpendChoice === 'foreign'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Globe className="w-4 h-4 inline-block mr-1.5" />
                  ซื้อแบรนด์นอกฟุ่มเฟือย
                </button>
              </div>

              {/* Simulation Result Diagram */}
              {selectedSpendChoice === 'community' ? (
                <div className="mt-5 space-y-3 p-4 bg-emerald-50/70 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span>🟢 ผลกระทบเชิงบวกต่อชุมชน (Local Multiplier Effect)</span>
                    <span>เงินหมุนเวียน ~190 บาท</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-emerald-100">
                      <span className="font-bold text-emerald-700">ก้าวที่ 1:</span>
                      <span>เงิน 100 บาทไปถึงมือแม่ค้าขายผักและผลไม้ในชุมชน</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-emerald-100">
                      <span className="font-bold text-emerald-700">ก้าวที่ 2:</span>
                      <span>แม่ค้านำ 60 บาทไปซื้อผลผลิตจากสวนของเกษตรกรในหมู่บ้าน</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-emerald-100">
                      <span className="font-bold text-emerald-700">ก้าวที่ 3:</span>
                      <span>เกษตรกรนำเงินไปจ้างแรงงานท้องถิ่นและซื้อของใช้ในอำเภอ</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-emerald-900 pt-1">
                    🌟 สรุป: เงินไม่รั่วไหลออกนอกประเทศ ชุมชนมีรายได้เข้มแข็ง เกิดการจ้างงานต่อเนื่อง
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-3 p-4 bg-rose-50/70 rounded-xl border border-rose-200">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-800">
                    <span>🔴 ผลกระทบเชิงลบต่อเศรษฐกิจชุมชนและประเทศ</span>
                    <span>เงินไหลออกนอกประเทศ ~85 บาท</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-rose-100">
                      <span className="font-bold text-rose-700">ก้าวที่ 1:</span>
                      <span>เงิน 100 บาทถูกจ่ายเพื่อซื้อสินค้าฟุ่มเฟือยนำเข้า</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-rose-100">
                      <span className="font-bold text-rose-700">ก้าวที่ 2:</span>
                      <span>กำไรส่วนใหญ่ (85 บาท) ไหลออกไปยังบริษัทต่างประเทศ</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-rose-100">
                      <span className="font-bold text-rose-700">ก้าวที่ 3:</span>
                      <span>ร้านค้าในชุมชนไม่มีคนซื้อ ขาดรายได้ ปิดตัวลง</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-rose-900 pt-1">
                    ⚠️ สรุป: เงินตราไหลออกนอกประเทศ เสี่ยงขาดดุลการค้า และเศรษฐกิจชุมชนซบเซา
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>การประยุกต์ใช้: ปรัชญาเศรษฐกิจพอเพียง</span>
              <span>ตัวชี้วัด ส.3.1 ม.1/2</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
