"use client";

import { createContext, useEffect, useState } from "react";
import * as authApi from "@/lib/api/auth";
import { useMutation } from "@tanstack/react-query";

type User = authApi.User;

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Context 생성
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Provider 컴포넌트
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기화: localStorage에서 토큰 읽기
  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setIsLoading(false);
  }, []);

  // 로그인 Mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // 토큰 및 사용자 정보 저장
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.access_token);
      setUser(data.user);
    },
    onError: (error) => {
      console.error("로그인 실패", error);
      throw error;
    },
  });

  // 회원가입 Mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onError: (error) => {
      console.error("최원가입 실패: ", error);
      throw error;
    },
  });

  // 로그인 함수
  const login = async (email: string, password: string) => {
    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (error) {
      throw error;
    }
  };

  // 회원가입 함수
  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    try {
      await registerMutation.mutateAsync({ email, username, password });
      // 회원가입 성공 후 자동 로그인
      await login(email, password);
    } catch (error) {
      throw error;
    }
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
