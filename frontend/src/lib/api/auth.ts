import { apiClient } from "./client";

// 로그인 요청 DTO
export interface LoginRequest {
  email: string;
  password: string;
}

// 회원가입 요청 DTO
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

// 로그인 응답
export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
}

// 사용자 정보 응답
export interface User {
  id: number;
  email: string;
  username: string;
}

// 로그인 API
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/users/login", data);
  return response.data;
};

// 회원가입 API
export const register = async (data: RegisterRequest): Promise<User> => {
  const response = await apiClient.post<User>("/users/register", data);
  return response.data;
};

// 내 정보 조회 API (토큰 검증용)
export const getMe = async (): Promise<User> => {
  const response = await apiClient.get<User>("/users/me");
  return response.data;
};
