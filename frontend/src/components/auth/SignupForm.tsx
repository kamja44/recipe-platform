import { Mail, User } from "lucide-react";
import { CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { PasswordField } from "./PasswordField";
import Link from "next/link";
import { Button } from "../ui/button";
import { SignupFormData } from "@/types/auth";
import { useForm } from "react-hook-form";

interface SignupFormProps {
  onSuccess: (data: SignupFormData) => void;
  isLoading: boolean;
}

export function SignupForm({ onSuccess, isLoading }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = (data: SignupFormData) => {
    onSuccess(data);
  };
  return (
    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-name">이름</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="signup-name"
              type="text"
              placeholder="이름을 입력하세요"
              className="pl-10"
              {...register("username", {
                required: "이름을 입력해주세요",
                minLength: {
                  value: 2,
                  message: "이름은 최소 2자 이상이어야 합니다",
                },
              })}
            />
          </div>
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
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
              {...register("email", {
                required: "이메일을 입력해주세요",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "올바른 이메일 형식이 아닙니다",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">비밀번호</Label>
          <PasswordField
            id="signup-password"
            placeholder="8자 이상 입력하세요"
            {...register("password", {
              required: "비밀번호를 입력해주세요",
              minLength: {
                value: 8,
                message: "비밀번호는 최소 8자 이상이어야 합니다",
              },
            })}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">비밀번호 확인</Label>
          <PasswordField
            id="confirm-password"
            placeholder="비밀번호를 다시 입력하세요"
            {...register("confirmPassword", {
              required: "비밀번호 확인을 입력해주세요",
              validate: (value) =>
                value === password || "비밀번호가 일치하지 않습니다",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

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
