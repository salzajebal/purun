import { Link } from "wouter";
import logoSrc from "../../assets/logo.png";

export function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 md:px-6 flex h-14 items-center justify-between">
        <Link href="/">
          <span className="flex items-center cursor-pointer select-none">
            <img src={logoSrc} alt="푸른파이낸셜" className="h-10 w-auto object-contain" />
          </span>
        </Link>
        <a href="#apply">
          <button className="bg-[#5B4BFF] text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#4a3aee] transition-colors">
            한도조회
          </button>
        </a>
      </div>
    </header>
  );
}
