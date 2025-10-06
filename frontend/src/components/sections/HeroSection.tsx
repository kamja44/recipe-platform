import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
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
  );
}
