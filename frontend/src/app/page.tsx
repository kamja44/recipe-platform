import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            AI Recipe Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            재료를 입력하고 AI가 추천하는 맞춤 레시피를 받아보세요
          </p>
          <Button size="lg" className="mr-4">
            시작하기
          </Button>
          <Button variant="outline" size="lg">
            더 알아보기
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>🥗 재료 기반 추천</CardTitle>
              <CardDescription>
                냉장고에 있는 재료를 입력하면 AI가 최적의 레시피를 추천해드립니다
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>👨‍🍳 커뮤니티</CardTitle>
              <CardDescription>
                다른 사용자들과 레시피를 공유하고 평점과 후기를 남겨보세요
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📊 영양 분석</CardTitle>
              <CardDescription>
                각 레시피의 칼로리, 영양소 정보를 확인하고 건강한 식단을 관리하세요
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
