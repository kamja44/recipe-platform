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
    // 여기서 인증 토큰을 헤더에 추가할 수 있음
    // const token = localStorage.getItem('token');
    // if(token){
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
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
    // 전역 에러 처리
    if (error.response?.status === 401) {
      // 인증 실패 처리
      console.error("인증 실패");
    }
    return Promise.reject(error);
  }
);
