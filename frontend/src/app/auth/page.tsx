"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AuthHeader } from "@/components/auth/AuthHeader";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoginFormData, SignupFormData } from "@/types/auth";

export default function AuthPage() {
  const router = useRouter();
  const { login, register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 처리
  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      await login(data.email, data.password);
      router.push("/");
    } catch (error) {
      alert("로그인 실패: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입 처리
  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      await registerUser(data.email, data.username, data.password);
      alert("회원가입 및 로그인 성공!");
      router.push("/");
    } catch (error) {
      alert("회원가입 실패: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
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
              <LoginForm onSuccess={handleLogin} isLoading={isLoading} />
            </TabsContent>

            {/* 회원가입 탭 */}
            <TabsContent value="signup">
              <SignupForm onSuccess={handleSignup} isLoading={isLoading} />
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
