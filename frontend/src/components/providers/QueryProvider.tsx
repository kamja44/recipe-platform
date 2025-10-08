"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  // useState로 QueryClient를 컴포넌트 내부에서 생성 => 서버-클라이언트 간 상태 불일치 방지
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분간 데이터를 fresh 상태로 유지
            refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 재조회 비활성화
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
