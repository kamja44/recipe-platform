"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AuthHeader } from "@/components/auth/AuthHeader";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: 실제 로그인 로직 구현
    setTimeout(() => {
      setIsLoading(false);
      alert("로그인 성공! (더미)");
    }, 1500);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: 실제 회원가입 로직 구현
    setTimeout(() => {
      setIsLoading(false);
      alert("회원가입 성공! (더미)");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 px-4">
      <div className="w-full max-w-md">
        <AuthHeader
          title="요리의 새로운 시작"
          description="AI와 함께하는 맞춤 레시피 여행"
        />

        <Card>
          <Tabs defaultValue="login" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">로그인</TabsTrigger>
                <TabsTrigger value="signup">회원가입</TabsTrigger>
              </TabsList>
            </CardHeader>

            {/* 로그인 탭 */}
            <TabsContent value="login">
              <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
            </TabsContent>

            {/* 회원가입 탭 */}
            <TabsContent value="signup">
              <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          AI Recipe와 함께 새로운 요리 여행을 시작하세요! 🚀
        </p>
      </div>
    </div>
  );
}
