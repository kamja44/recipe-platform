import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  // Cloudflare 관련 옵션만 유지
  cloudflare: {
    // 설정 검증 비활성화 여부 (기본 false)
    dangerousDisableConfigValidation: false,
  },

  // default는 비워둬야 함 (함수 실행 옵션 없음)
  default: {},
};

export default config;
