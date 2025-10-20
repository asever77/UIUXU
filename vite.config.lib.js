import { defineConfig } from "vite";
import { resolve } from "path";

/**
 * Vite 라이브러리 빌드 설정
 * npm 패키지로 배포하기 위한 설정
 */
export default defineConfig({
  build: {
    lib: {
      // 진입점
      entry: {
        index: resolve(__dirname, "src/assets/js/uiuxu.common.js"),

        // 개별 컴포넌트 진입점 (component/ 폴더)
        accordion: resolve(__dirname, "src/assets/js/component/accordion.js"),
        buttonSelection: resolve(
          __dirname,
          "src/assets/js/component/buttonSelection.js"
        ),
        chartBubble: resolve(
          __dirname,
          "src/assets/js/component/chart_bubble.js"
        ),
        countdown: resolve(__dirname, "src/assets/js/component/countdown.js"),
        dialog: resolve(__dirname, "src/assets/js/component/dialog.js"),
        drag: resolve(__dirname, "src/assets/js/component/drag.js"),
        dropdown: resolve(__dirname, "src/assets/js/component/dropdown.js"),
        listIA: resolve(__dirname, "src/assets/js/component/listIA.js"),
        nav: resolve(__dirname, "src/assets/js/component/nav.js"),
        rangeSlider: resolve(
          __dirname,
          "src/assets/js/component/rangeSlider.js"
        ),
        roulette: resolve(__dirname, "src/assets/js/component/roulette.js"),
        scrollEvent: resolve(
          __dirname,
          "src/assets/js/component/scrollEvent.js"
        ),
        tab: resolve(__dirname, "src/assets/js/component/tab.js"),
        timeSelect: resolve(__dirname, "src/assets/js/component/timeSelect.js"),
        toggleController: resolve(
          __dirname,
          "src/assets/js/component/toggleController.js"
        ),
        tooltip: resolve(__dirname, "src/assets/js/component/tooltip.js"),
        wheelPicker: resolve(
          __dirname,
          "src/assets/js/component/wheelPicker.js"
        ),

        // 유틸리티 (utils/ 폴더)
        errors: resolve(__dirname, "src/assets/js/utils/errors.js"),
        logger: resolve(__dirname, "src/assets/js/utils/logger.js"),
        utils: resolve(__dirname, "src/assets/js/utils/utils.js"),
      },
      name: "UIUXU",
      formats: ["es", "cjs", "umd"],
      fileName: (format, entryName) => {
        if (format === "es") return `${entryName}.esm.js`;
        if (format === "cjs") return `${entryName}.cjs`;
        return `${entryName}.umd.js`;
      },
    },

    rollupOptions: {
      // 외부 의존성 (사용자가 직접 설치해야 함)
      external: [],

      output: {
        // 전역 변수 이름 (UMD 빌드용)
        globals: {
          // 예: vue: 'Vue'
        },

        // 에셋 파일명
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith(".css")) {
            return "uiuxu.css";
          }
          return "[name][extname]";
        },
      },
    },

    // 소스맵 생성
    sourcemap: true,

    // 출력 디렉토리
    outDir: "dist",
    emptyOutDir: true,

    // 압축 설정
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  // CSS 설정
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "sass:math";`,
        api: "modern-compiler",
      },
    },
  },

  // 경로 별칭
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@js": resolve(__dirname, "src/assets/js"),
      "@scss": resolve(__dirname, "src/assets/scss"),
      "@utils": resolve(__dirname, "src/assets/js/utils"),
      "@components": resolve(__dirname, "src/assets/js/component"),
    },
  },
});
