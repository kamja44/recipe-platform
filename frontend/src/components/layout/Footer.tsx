import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🍳</span>
              <span className="font-bold text-lg">AI Recipe</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI가 추천하는 맞춤 레시피로 더 맛있는 요리를 만들어보세요.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">서비스</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="/recommend"
                  className="hover:text-foreground transition-colors"
                >
                  AI 추천
                </a>
              </li>
              <li>
                <Link
                  href="/recipes"
                  className="hover:text-foreground transition-colors"
                >
                  레시피 모음
                </Link>
              </li>
              <li>
                <a
                  href="/community"
                  className="hover:text-foreground transition-colors"
                >
                  커뮤니티
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">고객지원</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="/help"
                  className="hover:text-foreground transition-colors"
                >
                  도움말
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  문의하기
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="hover:text-foreground transition-colors"
                >
                  자주 묻는 질문
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">정보</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  회사 소개
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  개인정보처리방침
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  이용약관
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 AI Recipe Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
