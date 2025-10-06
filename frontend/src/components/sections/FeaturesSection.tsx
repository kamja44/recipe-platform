import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FeatureCard } from "@/types/common";

const features: FeatureCard[] = [
  {
    emoji: "🥗",
    title: "스마트 재료 분석",
    description:
      "냉장고에 있는 재료를 입력하면 AI가 최적의 조합을 찾아 레시피를 추천합니다.",
  },
  {
    emoji: "👨‍🍳",
    title: "커뮤니티 중심",
    description:
      "요리 애호가들과 레시피를 공유하고, 후기와 개선 사항을 나눠보세요.",
  },
  {
    emoji: "📊",
    title: "영양 분석",
    description:
      "각 레시피의 칼로리와 영양소 정보를 제공하여 건강한 식단을 도와드립니다.",
  },
];

export function FeaturesSection() {
  return (
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
        {features.map((feature, index) => (
          <Card
            key={index}
            className="text-center border-2 hover:border-primary/50 transition-colors"
          >
            <CardHeader>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">{feature.emoji}</span>
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
              <CardDescription className="text-base">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
