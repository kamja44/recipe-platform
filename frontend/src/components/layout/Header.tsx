import Link from "next/link";
import { Button } from "../ui/button";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl">🍳</span>
          <span className="font-bold text-xl">AI Recipe</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            홈
          </Link>
          <Link
            href="/recipes"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            레시피
          </Link>
          <Link
            href="/recommend"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            AI 추천
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <Link href="/auth">
            <Button variant="ghost" size="sm">
              로그인
            </Button>
          </Link>
          <Link href="/auth">
            <Button size="sm">회원가입</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
