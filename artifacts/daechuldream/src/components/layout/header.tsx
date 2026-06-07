import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href="/">
          <span className="text-xl font-bold text-primary cursor-pointer tracking-tight">
            대출드림
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button asChild variant="default" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Link href="#apply">한도조회</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
