export function Footer() {
  return (
    <>
      {/* Disclaimer */}
      <div className="bg-white border-t border-gray-200 py-5 md:py-6">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <p className="text-xs text-gray-500 leading-relaxed">
            대출금리 연 20% 이내 · 연체금리 약정이자율 +3%P 이내(연 20% 이내) · 2021.07.07 이후 신규·갱신 연장 계약 한정 · 만 19세 이상 · 제무 불이행 등록자 제외 · 수수료 없음 · 대출기간 12~60개월 · 예시 100만원 9920% 12개월 균등상환 총 1,111,609원
          </p>
          <p className="text-xs text-[#e00] font-semibold mt-3">
            중개수수료를 요구하거나 받는 것은 불법입니다. 과도한 빚은 당신에게 큰 불행을 안겨줄 수 있습니다.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1c1c1e] text-gray-400 py-8">
        <div className="max-w-5xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-6">
          <div className="text-xs leading-relaxed space-y-1.5" style={{ fontWeight: 500 }}>
            <p>회사명 : 대출드림 (주식회사 대출드림대부) / 대부중개등록번호 : 2024-금강원-2687(대부업)</p>
            <p>사업자번호 : 637-88-03205 / 대표자 : 최병환</p>
            <p>주소 : 경기도 성남시 성남대로194번길 72, 8이오 (다산동) / 전화번호 : 0504-8721-0804</p>
            <p>대부중개업등록번호 : 2024-금강원-2687(대부업)</p>
          </div>
          <div className="w-full md:w-auto flex-shrink-0">
            <a href="tel:050487210804">
              <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#1a73e8] text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-[#1557b0] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                전화 연결
              </button>
            </a>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 md:px-6 mt-6 border-t border-gray-700 pt-4">
          <p className="text-xs text-center text-gray-500">© 2026 대출드림</p>
        </div>
      </footer>
    </>
  );
}
