import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              AI가 추천하는
              <span className="text-primary"> 맞춤 레시피</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              냉장고 속 재료만 알려주세요. AI가 당신만을 위한 특별한 레시피를
              추천해드립니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/recommend">
              <Button size="lg" className="text-lg px-8 py-6">
                🤖 AI 레시피 받기
              </Button>
            </Link>
            <Link href="/recipes">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                📖 레시피 둘러보기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            왜 AI Recipe를 선택해야 할까요?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            단순한 레시피 검색을 넘어, 개인화된 요리 경험을 제공합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🥗</span>
              </div>
              <CardTitle className="text-xl">스마트 재료 분석</CardTitle>
              <CardDescription className="text-base">
                냉장고에 있는 재료를 입력하면 AI가 최적의 조합을 찾아 레시피를
                추천합니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">👨‍🍳</span>
              </div>
              <CardTitle className="text-xl">커뮤니티 중심</CardTitle>
              <CardDescription className="text-base">
                요리 애호가들과 레시피를 공유하고, 후기와 개선 사항을
                나눠보세요.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <CardTitle className="text-xl">영양 분석</CardTitle>
              <CardDescription className="text-base">
                각 레시피의 칼로리와 영양소 정보를 제공하여 건강한 식단을
                도와드립니다.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground max-w-4xl mx-auto">
          <CardHeader className="text-center space-y-4 py-12">
            <CardTitle className="text-3xl md:text-4xl">
              지금 시작해보세요!
            </CardTitle>
            <CardDescription className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
              무료로 AI 레시피 추천을 받아보고, 새로운 요리의 세계를
              경험해보세요.
            </CardDescription>
            <div className="pt-4">
              <Link href="/recommend">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-6"
                >
                  무료로 시작하기 →
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
