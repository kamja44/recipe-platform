import axios from "axios";

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초 타임아웃
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (추후 JWT 토큰 추가 예정)
apiClient.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰 가져오기
    const token = localStorage.getItem("access_token");

    // 토큰이 있으면 Authorization 헤덩 ㅔ추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized - 인증 실패
    if (error.response?.status === 401) {
      console.error("인증 실패: 토큰이 만료되었거나 유효하지 않습니다.");
    }

    // 토큰 제거
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    // 로그인 페이지로 리다이렉트
    window.location.href = "/auth";

    return Promise.reject(error);
  }
);
