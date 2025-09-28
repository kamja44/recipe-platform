import { Mail } from "lucide-react";
import { CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { PasswordField } from "./PasswordField";
import Link from "next/link";
import { Button } from "../ui/button";

interface LoginFormProps {
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  return (
    <CardContent>
      <form onSubmit={onSubmit} className="space-y-4">
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
  );
}
