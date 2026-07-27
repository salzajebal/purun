import { useState, useEffect, useRef } from "react";
import { useSubmitApplication, useGetKakaoLink } from "@workspace/api-client-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const PURPLE = "#5B4BFF";

/* ── 실시간 신청현황 + 고객 대출후기 ── */
const LOAN_PRODUCTS = [
  "대학생대출", "무직자대출", "직장,사업자대출", "소액대출",
  "통신연체대출", "주부대출", "저신용자대출", "긴급생활비대출",
];
const LAST_NAMES = ["최","김","이","박","정","강","조","윤","장","임","오","한","신","류","권","허","남","배","서","문"];
const STATUSES: { label: string; color: string }[] = [
  { label: "신청대기", color: "#555" },
  { label: "신청대기", color: "#555" },
  { label: "신청대기", color: "#555" },
  { label: "신청대기", color: "#555" },
  { label: "조회진행", color: "#1a73e8" },
  { label: "대출완료", color: "#00a651" },
];
const REVIEWS = [
  "안녕하세요 40대 남성입니다",
  "장난아니네요 여기 정말 추천드립니다 .",
  "후기 남깁니다 !!",
  "다른곳 다안되는데 여기만 되는게 참신하네요 …",
  "팀장님 너무 고맙습니다 !",
  "연체 이력있어도 대출이 가능한건 처음알았습니다...",
  "신용불량자인데 대출이 되네요",
  "급하게 돈이 필요했는데 바로 해결됐습니다",
  "상담원분이 정말 친절하시네요",
  "다른곳에서 거절당했는데 여기서 됐어요",
  "빠른 상담 감사합니다",
  "처음 대출받아보는데 친절하게 안내해주셨어요",
  "금리도 괜찮고 한도도 충분해요",
  "여기 진짜 친절하고 빠르네요",
  "소액이지만 바로 됐어요 감사합니다",
  "무직자인데도 가능하다니 놀랐어요",
  "상담사분이 처음부터 끝까지 도와주셨어요",
  "생각보다 금리가 낮아서 좋았어요",
];

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function rnd<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

interface AppEntry { id: number; name: string; date: string; product: string; status: typeof STATUSES[0]; }
let _idCounter = 100;
function makeEntry(): AppEntry {
  return { id: _idCounter++, name: `${rnd(LAST_NAMES)}**`, date: todayStr(), product: rnd(LOAN_PRODUCTS), status: rnd(STATUSES) };
}
function makeInitial(n: number): AppEntry[] { return Array.from({ length: n }, makeEntry); }

/* ── LiveSection ── */
function LiveSection() {
  const [entries, setEntries] = useState<AppEntry[]>(() => makeInitial(15));
  const [reviews, setReviews] = useState<string[]>(() => [...REVIEWS].sort(() => Math.random() - 0.5));
  const [newEntryId, setNewEntryId] = useState<number | null>(null);
  const reviewIdx = useRef(0);

  useEffect(() => {
    const t = setInterval(() => {
      const e = makeEntry();
      setNewEntryId(e.id);
      setEntries(prev => [e, ...prev.slice(0, 14)]);
      setTimeout(() => setNewEntryId(null), 800);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      reviewIdx.current = (reviewIdx.current + 1) % REVIEWS.length;
      setReviews(prev => [REVIEWS[reviewIdx.current], ...prev.slice(0, 12)]);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-10 md:py-14 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-0.5" style={{ fontWeight: 600 }}>신용하락 전혀 없는, 안심한도조회</p>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900">실시간 <span style={{ color: "#e00" }}>대출상담</span></h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <div className="py-2.5 px-4 text-center text-white text-sm font-bold" style={{ background: "#5B4BFF" }}>실시간 신청현황</div>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: "#4a3aee", color: "#e8e5ff" }}>
                    <th className="py-2 px-3 text-left font-semibold">신청인</th>
                    <th className="py-2 px-3 text-left font-semibold">신청일</th>
                    <th className="py-2 px-3 text-left font-semibold">대출상품</th>
                    <th className="py-2 px-3 text-center font-semibold">상담현황</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e, i) => (
                    <tr key={e.id} className="border-t border-gray-100 transition-all duration-500"
                      style={{ background: e.id === newEntryId ? "#f0f4ff" : i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td className="py-2 px-3 font-semibold text-gray-800">{e.name}</td>
                      <td className="py-2 px-3 text-gray-500">{e.date}</td>
                      <td className="py-2 px-3 text-gray-700">{e.product}</td>
                      <td className="py-2 px-3 text-center font-bold" style={{ color: e.status.color }}>{e.status.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-full lg:w-[300px] flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900">고객 대출후기</h3>
              <span className="text-xs" style={{ color: PURPLE, fontWeight: 600 }}>대출후기</span>
            </div>
            <div className="space-y-2 overflow-hidden" style={{ maxHeight: 480 }}>
              {reviews.map((r, i) => (
                <div key={`${r}-${i}`} className="flex items-start gap-2 transition-all duration-500"
                  style={{ opacity: i === 0 ? 1 : Math.max(0.4, 0.92 - i * 0.05) }}>
                  <span className="inline-block text-white text-[10px] font-bold rounded px-1.5 py-0.5 flex-shrink-0 mt-0.5"
                    style={{ background: "#e00", letterSpacing: "-0.5px" }}>H인기글</span>
                  <p className="text-xs text-gray-700 leading-relaxed" style={{ fontWeight: 500 }}>{r}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── OX Toggle Button ── */
function OXToggle({ label, value, onChange }: { label: string; value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-600">{label}</p>
      <div className="flex gap-2">
        <button type="button" onClick={() => onChange(true)}
          className="w-12 h-10 rounded-full border-2 text-sm font-bold transition-all duration-150"
          style={{ borderColor: value === true ? PURPLE : "#e5e7eb", background: value === true ? PURPLE : "#f9fafb", color: value === true ? "#fff" : "#888" }}>
          O
        </button>
        <button type="button" onClick={() => onChange(false)}
          className="w-12 h-10 rounded-full border-2 text-sm font-bold transition-all duration-150"
          style={{ borderColor: value === false ? "#ef4444" : "#e5e7eb", background: value === false ? "#ef4444" : "#f9fafb", color: value === false ? "#fff" : "#888" }}>
          X
        </button>
      </div>
    </div>
  );
}

/* ── 비대면 상담 신청 폼 ── */
function ConsultationForm() {
  const [name, setName] = useState("");
  const [phoneMiddle, setPhoneMiddle] = useState("");
  const [phoneLast, setPhoneLast] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [welfare, setWelfare] = useState<boolean | null>(null);
  const [insurance, setInsurance] = useState<boolean | null>(null);
  const [disability, setDisability] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitApplication = useSubmitApplication();

  const phoneMiddleRef = useRef<HTMLInputElement>(null);
  const phoneLastRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name || name.trim().length < 2) e.name = "이름을 정확히 입력해주세요.";
    if (!phoneMiddle || phoneMiddle.length < 3 || !phoneLast || phoneLast.length < 4) e.phone = "연락처를 정확히 입력해주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const phone = `010-${phoneMiddle}-${phoneLast}`;
    const extras: string[] = [];
    if (birthYear || birthMonth || birthDay)
      extras.push(`생년월일: ${birthYear || "????"}년 ${birthMonth || "??"}월 ${birthDay || "??"}일`);
    if (welfare !== null) extras.push(`기초/의료수급자: ${welfare ? "O" : "X"}`);
    if (insurance !== null) extras.push(`사대보험: ${insurance ? "O" : "X"}`);
    if (disability !== null) extras.push(`장애인등록: ${disability ? "O" : "X"}`);

    submitApplication.mutate(
      { data: { name: name.trim(), phone, job_type: "기타", loan_amount: loanAmount || undefined, credit_score: creditScore || undefined, message: extras.join(" / ") || undefined } },
      { onSuccess: () => setDone(true), onError: () => alert("오류가 발생했습니다. 다시 시도해주세요.") }
    );
  };

  return (
    <section id="apply" className="py-14 md:py-20" style={{ background: "#f8f9fa" }}>
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm font-bold mb-2" style={{ color: PURPLE }}>무직자 · 저신용자 · 연체자도 유연하게 가능</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">비대면 상담 신청</h2>
          <p className="text-sm text-gray-500">아래 정보를 입력하시면 전문 상담원이 빠르게 연락드립니다.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Green top bar */}
          <div className="h-1.5 w-full" style={{ background: PURPLE }} />

          {done ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "#eeebff" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={PURPLE} strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">상담 신청이 완료됐습니다!</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">전문 상담원이 확인 후<br />빠르게 연락드리겠습니다.</p>
              <button onClick={() => { setDone(false); setName(""); setPhoneMiddle(""); setPhoneLast(""); setBirthYear(""); setBirthMonth(""); setBirthDay(""); setLoanAmount(""); setCreditScore(""); setWelfare(null); setInsurance(null); setDisability(null); }}
                className="w-full py-3 rounded-xl text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors font-semibold">
                추가 신청하기
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-5">
              {/* 이름 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">이름</label>
                <input type="text" value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
                  placeholder="홍길동"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors" />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* 연락처 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">연락처</label>
                <div className="flex items-center gap-2">
                  <div className="w-16 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-500 bg-gray-50 text-center font-semibold select-none">010</div>
                  <span className="text-gray-400 font-bold">-</span>
                  <input type="tel" value={phoneMiddle} maxLength={4}
                    ref={phoneMiddleRef}
                    onChange={e => { const v = e.target.value.replace(/\D/g, ""); setPhoneMiddle(v); setErrors(p => ({ ...p, phone: "" })); if (v.length === 4) phoneLastRef.current?.focus(); }}
                    placeholder="0000"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors text-center" />
                  <span className="text-gray-400 font-bold">-</span>
                  <input type="tel" value={phoneLast} maxLength={4}
                    ref={phoneLastRef}
                    onChange={e => { const v = e.target.value.replace(/\D/g, ""); setPhoneLast(v); setErrors(p => ({ ...p, phone: "" })); }}
                    placeholder="0000"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors text-center" />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* 생년월일 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">생년월일</label>
                <div className="flex items-center gap-2">
                  <input type="tel" value={birthYear} maxLength={4}
                    onChange={e => setBirthYear(e.target.value.replace(/\D/g, ""))}
                    placeholder="1990"
                    className="w-20 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors text-center" />
                  <span className="text-gray-500 text-sm font-semibold">년</span>
                  <span className="text-gray-400 font-bold">-</span>
                  <input type="tel" value={birthMonth} maxLength={2}
                    onChange={e => setBirthMonth(e.target.value.replace(/\D/g, ""))}
                    placeholder="01"
                    className="w-14 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors text-center" />
                  <span className="text-gray-500 text-sm font-semibold">월</span>
                  <span className="text-gray-400 font-bold">-</span>
                  <input type="tel" value={birthDay} maxLength={2}
                    onChange={e => setBirthDay(e.target.value.replace(/\D/g, ""))}
                    placeholder="01"
                    className="w-14 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors text-center" />
                  <span className="text-gray-500 text-sm font-semibold">일</span>
                </div>
              </div>

              {/* 희망대출금액 + 신용점수 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">희망대출금액</label>
                  <select value={loanAmount} onChange={e => setLoanAmount(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors appearance-none">
                    <option value="">선택</option>
                    <option value="100만원 이하">100만원 이하</option>
                    <option value="100만~300만원">100만~300만원</option>
                    <option value="300만~1,000만원">300만~1,000만원</option>
                    <option value="1,000만~3,000만원">1,000만~3,000만원</option>
                    <option value="3,000만원 이상">3,000만원 이상</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">신용점수</label>
                  <select value={creditScore} onChange={e => setCreditScore(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors appearance-none">
                    <option value="">선택</option>
                    <option value="942점~1000점">942점 ~ 1000점 (1등급)</option>
                    <option value="891점~941점">891점 ~ 941점 (2등급)</option>
                    <option value="832점~890점">832점 ~ 890점 (3등급)</option>
                    <option value="768점~831점">768점 ~ 831점 (4등급)</option>
                    <option value="698점~767점">698점 ~ 767점 (5등급)</option>
                    <option value="630점~697점">630점 ~ 697점 (6등급)</option>
                    <option value="530점~629점">530점 ~ 629점 (7등급)</option>
                    <option value="454점~529점">454점 ~ 529점 (8등급)</option>
                    <option value="335점~453점">335점 ~ 453점 (9등급)</option>
                    <option value="0점~334점">0점 ~ 334점 (10등급)</option>
                  </select>
                </div>
              </div>

              {/* OX 토글 */}
              <div>
                <div className="h-px bg-gray-100 mb-4" />
                <div className="flex gap-6 flex-wrap">
                  <OXToggle label="기초/의료수급자" value={welfare} onChange={setWelfare} />
                  <OXToggle label="사대보험" value={insurance} onChange={setInsurance} />
                  <OXToggle label="장애인등록" value={disability} onChange={setDisability} />
                </div>
              </div>

              {/* Submit */}
              <button onClick={handleSubmit} disabled={submitApplication.isPending}
                className="w-full py-4 rounded-2xl text-white text-base font-black tracking-wide transition-all duration-150 hover:opacity-90 disabled:opacity-60 mt-2"
                style={{ background: PURPLE, boxShadow: "0 4px 20px rgba(91,75,255,0.30)" }}>
                {submitApplication.isPending ? "신청 중..." : "상담 신청하기 →"}
              </button>

              <p className="text-center text-xs text-gray-400 pb-1">
                ◯ 입력하신 정보는 안전하게 암호화되어 전송됩니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Home ── */
export function Home() {
  const { data: kakaoData } = useGetKakaoLink();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f3f3fb", fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-14 md:py-20 text-center" style={{ background: "#f3f3fb" }}>
          <div className="max-w-2xl mx-auto px-4 md:px-6 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border" style={{ borderColor: PURPLE, color: PURPLE, background: "#eeebff" }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: PURPLE }} />
              금융감독원 정식 등록
            </div>
            <h1 className="text-[32px] md:text-5xl font-black leading-tight text-gray-900">
              푸른파이낸셜<br />
              <span style={{ color: PURPLE }}>누구나 가능한</span> 맞춤 대출
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed" style={{ fontWeight: 500 }}>
              직장인·사업자·주부·무직자 누구나<br />
              1분 만에 대출 가능 여부를 확인하세요
            </p>
            <div className="flex items-center justify-center gap-10 pt-2">
              <div>
                <p className="text-2xl font-black" style={{ color: PURPLE }}>5,000만</p>
                <p className="text-xs text-gray-500 mt-0.5 font-semibold">최대 한도</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="text-2xl font-black" style={{ color: PURPLE }}>6.9%~</p>
                <p className="text-xs text-gray-500 mt-0.5 font-semibold">최저 금리</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="text-2xl font-black" style={{ color: PURPLE }}>당일</p>
                <p className="text-xs text-gray-500 mt-0.5 font-semibold">입금</p>
              </div>
            </div>
            <a href="#apply">
              <button className="mt-2 px-8 py-3.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-opacity"
                style={{ background: PURPLE }}>
                무료 한도조회 →
              </button>
            </a>
          </div>
        </section>

        {/* 실시간 신청현황 + 고객 대출후기 */}
        <LiveSection />

        {/* Trust Badges */}
        <section className="bg-white border-t border-b border-gray-200 py-3 md:py-4">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-0">
              {[
                { icon: "shield", label: "선입금 절대 없음" },
                { icon: "phone", label: "100% 비대면" },
                { icon: "lock", label: "개인정보 보호" },
                { icon: "bolt", label: "당일 심사·입금" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-center gap-1.5 text-sm text-gray-600 py-1" style={{ fontWeight: 600 }}>
                  {item.icon === "shield" && <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                  {item.icon === "phone" && <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                  {item.icon === "lock" && <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                  {item.icon === "bolt" && <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 비대면 상담 신청 */}
        <ConsultationForm />

        {/* Products */}
        <section className="py-10 md:py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <p className="text-xs font-bold mb-1 tracking-widest" style={{ color: PURPLE }}>PRODUCTS</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-8" style={{ fontWeight: 800 }}>맞춤 대출 상품</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { badge: "연체자", title: "푸른파이낸셜 연체자", sub: "1개월 이상 연체 지속 중인 분", limit: "최대 2,000만", rate: "연 9.9%~", term: "12~60개월" },
                { badge: "저신용자", title: "푸른파이낸셜 저신용자", sub: "신용등급 7등급 이하", limit: "최대 1,500만", rate: "연 12.9%~", term: "12~48개월" },
                { badge: "주부", title: "푸른파이낸셜 주부", sub: "만 19세 이상 주부", limit: "최대 1,000만", rate: "연 14.9%~", term: "12~36개월" },
                { badge: "무직자", title: "푸른파이낸셜 무직자", sub: "만 19세 이상 누구나", limit: "최대 500만", rate: "연 17.9%~", term: "12~24개월" },
              ].map((prod) => (
                <div key={prod.badge} className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-sm transition-shadow">
                  <p className="text-xs font-semibold mb-1.5" style={{ color: PURPLE }}>{prod.badge}</p>
                  <h3 className="text-lg font-bold text-gray-900 mb-0.5" style={{ fontWeight: 800 }}>{prod.title}</h3>
                  <p className="text-xs text-gray-500 mb-5" style={{ fontWeight: 500 }}>{prod.sub}</p>
                  <div className="flex gap-6 mb-5">
                    <div><p className="text-xs text-gray-500 mb-1 font-semibold">한도</p><p className="text-base text-gray-900 font-bold">{prod.limit}</p></div>
                    <div><p className="text-xs text-gray-500 mb-1 font-semibold">금리</p><p className="text-base text-gray-900 font-bold">{prod.rate}</p></div>
                    <div><p className="text-xs text-gray-500 mb-1 font-semibold">상환</p><p className="text-base text-gray-900 font-bold">{prod.term}</p></div>
                  </div>
                  <a href="#apply">
                    <button className="w-full py-2.5 rounded text-white text-sm font-bold hover:opacity-90 transition-opacity" style={{ background: PURPLE }}>신청하기</button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dark Section */}
        <section className="py-10 md:py-14 bg-[#1c1c1e]">
          <div className="max-w-5xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-8 md:gap-12">
            <div className="flex-shrink-0">
              <h2 className="text-2xl font-bold text-white leading-snug" style={{ fontWeight: 800 }}>
                이런 고민,<br />푸른파이낸셜이<br />해결합니다
              </h2>
            </div>
            <div className="flex-[2] space-y-4">
              {[
                "급하게 자금이 필요한데 입금이 늦어지고 있어요",
                "서류가 많아서 중간에 포기하게 돼요",
                "여러 곳에서 상담받았지만 번번이 부결이에요",
                "연체 이력 때문에 어디서도 안 받아줘요",
                "소득이 없어 신청 자체가 막혀 있어요",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4 border-b border-gray-700 pb-4">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white" style={{ background: PURPLE }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="text-sm text-gray-300" style={{ fontWeight: 500 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-10 md:py-14 bg-[#f3f3fb]">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
              {[
                { label: "선입금 없음", desc: "선입금 요구 없음", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={PURPLE} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
                { label: "100% 비대면", desc: "방문 없이 모바일 완료", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={PURPLE} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> },
                { label: "정보 보호", desc: "법적 기준 안전 관리", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={PURPLE} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
                { label: "당일 입금", desc: "심사 완료 즉시 입금", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={PURPLE} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
              ].map((f) => (
                <div key={f.label} className="flex flex-col items-center gap-2 md:gap-3">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center" style={{ background: "#e8e5ff" }}>{f.icon}</div>
                  <p className="text-xs md:text-sm text-gray-800 font-bold">{f.label}</p>
                  <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="py-10 md:py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <p className="text-xs font-bold mb-1 tracking-widest" style={{ color: PURPLE }}>REVIEWS</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-8" style={{ fontWeight: 800 }}>고객 후기</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "믿을 수 있는 곳이에요", highlight: "정식 등록 업체라", content: " 걱정 없이 진행했습니다. 상담도 진심하고 만족합니다.", meta: "김** 님 · 45세 · 주부" },
                { title: "간편하게 해결했어요", highlight: "급한 생활자금이", content: " 필요했는데, 복잡한 절차 없이 빠르게 받았습니다.", meta: "이** 님 · 37세 · 무직" },
                { title: "다른 곳에서 안 됐는데", highlight: "여러 번 거절당한", content: " 뒤 여기서 가능하다고 해서 놀랐습니다.", meta: "박** 님 · 38세 · 직장인" },
                { title: "속도가 빠르네요", highlight: "오전에 신청하고", content: " 오후에 입금까지 완료. 정말 빨랐습니다.", meta: "최** 님 · 54세 · 사업자" },
              ].map((r) => (
                <div key={r.title} className="border border-gray-200 rounded-lg p-5">
                  <h4 className="text-base text-gray-900 mb-2" style={{ fontWeight: 800 }}>{r.title}</h4>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    <span style={{ color: PURPLE, fontWeight: 600 }}>{r.highlight}</span>{r.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-3 font-medium">{r.meta}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* KakaoTalk Float */}
      <div className="fixed bottom-5 right-4 md:right-5 z-50">
        {kakaoData?.kakao_link ? (
          <a href={kakaoData.kakao_link} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full shadow-lg px-3 py-2 md:px-4 md:py-2.5 text-sm font-bold"
            style={{ background: "#FAE100", color: "#3C1E1E" }}>
            <span className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "#3C1E1E" }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#FAE100" d="M12 3C6.48 3 2 6.72 2 11.28c0 2.88 1.62 5.43 4.1 7.02l-.71 2.64c-.11.43.16.43.34.31l2.56-1.74c.7.13 1.42.2 1.71.2 5.52 0 10-3.72 10-8.43S17.52 3 12 3z"/>
              </svg>
            </span>
            카카오톡 상담
          </a>
        ) : (
          <button className="flex items-center gap-2 rounded-full shadow-lg px-3 py-2 md:px-4 md:py-2.5 text-sm font-bold cursor-default"
            style={{ background: "#FAE100", color: "#3C1E1E" }}>
            <span className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "#3C1E1E" }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#FAE100" d="M12 3C6.48 3 2 6.72 2 11.28c0 2.88 1.62 5.43 4.1 7.02l-.71 2.64c-.11.43.16.43.34.31l2.56-1.74c.7.13 1.42.2 1.71.2 5.52 0 10-3.72 10-8.43S17.52 3 12 3z"/>
              </svg>
            </span>
            카카오톡 상담
          </button>
        )}
      </div>
    </div>
  );
}
