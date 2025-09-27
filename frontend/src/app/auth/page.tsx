"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, User } from "lucide-react";
import Link from "next/link";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { PasswordField } from "@/components/auth/PasswordField";

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
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <PasswordField
                    id="password"
                    label="비밀번호"
                    placeholder="비밀번호를 입력하세요"
                    required
                  />

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>로그인 상태 유지</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-primary hover:underline"
                    >
                      비밀번호 찾기
                    </Link>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "로그인 중..." : "로그인"}
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        또는
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button variant="outline" className="w-full">
                      구글
                    </Button>
                    <Button variant="outline" className="w-full">
                      카카오
                    </Button>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            {/* 회원가입 탭 */}
            <TabsContent value="signup">
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">이름</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="이름을 입력하세요"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">이메일</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="example@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <PasswordField
                    id="signup-password"
                    label="비밀번호"
                    placeholder="8자 이상 입력하세요"
                    required
                  />

                  <PasswordField
                    id="confirm-password"
                    label="비밀번호 확인"
                    placeholder="비밀번호를 다시 입력하세요"
                    required
                  />
                  <div className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded" required />
                    <span>
                      <Link
                        href="/terms"
                        className="text-primary hover:underline"
                      >
                        이용약관
                      </Link>
                      과{" "}
                      <Link
                        href="/privacy"
                        className="text-primary hover:underline"
                      >
                        개인정보처리방침
                      </Link>
                      에 동의합니다.
                    </span>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "가입 중..." : "회원가입"}
                  </Button>
                </form>
              </CardContent>
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
