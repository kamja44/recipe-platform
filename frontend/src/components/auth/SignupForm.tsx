import { Mail, User } from "lucide-react";
import { CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { PasswordField } from "./PasswordField";
import Link from "next/link";
import { Button } from "../ui/button";

interface SignupFormProps {
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function SignupForm({ onSubmit, isLoading }: SignupFormProps) {
  return (
    <CardContent>
      <form onSubmit={onSubmit} className="space-y-4">
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
            <Link href="/terms" className="text-primary hover:underline">
              이용약관
            </Link>
            과{" "}
            <Link href="/privacy" className="text-primary hover:underline">
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
  );
}
