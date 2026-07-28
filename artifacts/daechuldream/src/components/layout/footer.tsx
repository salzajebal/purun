export function Footer() {
  return (
    <>
      {/* Disclaimer */}
      <div className="bg-white border-t border-gray-200 py-5 md:py-6">
        <div className="max-w-5xl mx-auto px-4 md:px-6 text-xs text-gray-500 leading-relaxed space-y-2">
          <p>금리 연 20% 이내 (연체이자율 포함 연 20% 이내)(단, 2021.7.7부터 체결·갱신·연장되는 계약에 한함), 취급수수료 없음, 중도상환 수수료 없음, 중개수수료 없음, 추가비용 없음.</p>
          <p>상환기간 : 12개월 ~ 60개월 / 총 대출 비용 예시 : 100만원을 12개월 기간 동안 최대 금리 연 20% 적용하여 원리금균등상환방법으로 이용하는 경우 총 상환금액 1,111,614원 (단, 대출상품 및 상환방법 등 대출계약 내용에 따라 달라질 수 있습니다). 채무의 조기상환수수료 등 조기상환조건 없음.</p>
          <p className="text-[#e00] font-semibold">과도한 빚은 당신에게 큰 불행을 안겨줄 수 있습니다. 중개수수료를 요구하거나 받는 것은 불법입니다. 대출 시 귀하의 신용등급이 하락할 수 있습니다.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1c1c1e] text-gray-400 py-8">
        <div className="max-w-5xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-6">
          <div className="text-xs leading-relaxed space-y-1.5" style={{ fontWeight: 500 }}>
            <p>회사명 : 유앤에스 파이낸셜대부중개 / 대표자 : 정의선</p>
            <p>사업자등록번호 : 648-20-02701</p>
            <p>대부중개업등록번호 : 2026-부산기장-0003 (대부중개업)</p>
            <p>주소 : 부산광역시 기장군 일광읍 해송2로 10, 일광역 유림노르웨이아침 306호</p>
            <p>전화번호 : 010-2451-3130</p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 md:px-6 mt-6 border-t border-gray-700 pt-4">
          <p className="text-xs text-center text-gray-500">© 2026 푸른파이낸셜</p>
        </div>
      </footer>
    </>
  );
}
