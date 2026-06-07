import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">대출드림</h3>
            <p className="text-sm text-muted-foreground mb-4">
              프리미엄 대출 중개 서비스. 직장인, 사업자, 주부, 무직자 누구나 최적의 대출을 찾아드립니다.
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>상호: 대출드림대부중개 | 대표자: 홍길동</p>
              <p>사업자등록번호: 123-45-67890 | 대부중개업 등록번호: 2024-서울강남-0001</p>
              <p>주소: 서울특별시 강남구 테헤란로 123, 4층</p>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end justify-start">
            <div className="text-left md:text-right">
              <p className="text-sm font-medium mb-2">고객센터</p>
              <p className="text-3xl font-bold text-primary mb-2">1588-0000</p>
              <p className="text-sm text-muted-foreground mb-4">평일 09:00 - 18:00 (주말/공휴일 휴무)</p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                <Phone className="mr-2 h-4 w-4" />
                전화상담 신청
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t pt-8 text-xs text-muted-foreground">
          <p className="mb-2 font-medium">대출 시 유의사항</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>대출금리는 연 20% 이내이며, 연체이자율은 약정금리 + 연 3% (최대 연 20% 이내) 입니다.</li>
            <li>취급수수료 등 기타 부대비용은 없습니다. (단, 부동산 담보대출의 경우 근저당설정비용 등 발생 가능)</li>
            <li>과도한 빚은 당신에게 큰 불행을 안겨줄 수 있습니다. 대출 시 귀하의 신용등급이 하락할 수 있습니다.</li>
            <li>중개수수료를 요구하거나 받는 것은 불법입니다.</li>
          </ul>
          <p className="mt-6 text-center">&copy; 2024 대출드림. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
