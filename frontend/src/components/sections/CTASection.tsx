import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CTASection as CTASectionType } from "@/types/common";

const ctaData: CTASectionType = {
  title: "지금 시작해보세요!",
  description:
    "무료로 AI 레시피 추천을 받아보고, 새로운 요리의 세계를 경험해보세요.",
  buttonText: "무료로 시작하기 →",
  buttonHref: "/recommend",
};

export function CTASection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <Card className="bg-primary text-primary-foreground max-w-4xl mx-auto">
        <CardHeader className="text-center space-y-4 py-12">
          <CardTitle className="text-3xl md:text-4xl">
            {ctaData.title}
          </CardTitle>
          <CardDescription className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
            {ctaData.description}
          </CardDescription>
          <div className="pt-4">
            <Link href={ctaData.buttonHref}>
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6"
              >
                {ctaData.buttonText}
              </Button>
            </Link>
          </div>
        </CardHeader>
      </Card>
    </section>
  );
}
