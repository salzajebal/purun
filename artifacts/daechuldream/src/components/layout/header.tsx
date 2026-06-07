import { Link } from "wouter";

export function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 flex h-14 items-center justify-between">
        <Link href="/">
          <span className="text-lg font-bold text-gray-900 cursor-pointer">대출드림</span>
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
