import { defineConfig } from "vite";
import { resolve } from "path";

/**
 * Vite 라이브러리 빌드 설정 - Lite Version
 * Accordion + Tab만 포함
 */
export default defineConfig({
  build: {
    lib: {
      // 진입점 - Lite 버전
      entry: {
        index: resolve(__dirname, "src/index.lite.js"),
        // 개별 컴포넌트 (아코디언 + 탭만)
        accordion: resolve(__dirname, "src/assets/js/component/accordion.js"),
        tab: resolve(__dirname, "src/assets/js/component/tab.js"),
        // 유틸리티
        logger: resolve(__dirname, "src/assets/js/utils/logger.js"),
        errors: resolve(__dirname, "src/assets/js/utils/errors.js"),
        utils: resolve(__dirname, "src/assets/js/utils/utils.js"),
      },
      name: "UIUXULite",
      formats: ["es", "cjs", "umd"],
      fileName: (format, entryName) => {
        if (format === "es") return `${entryName}.esm.js`;
        if (format === "cjs") return `${entryName}.cjs`;
        return `${entryName}.umd.js`;
      },
    },

    rollupOptions: {
      external: [],
      output: {
        globals: {},
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith(".css")) {
            return "uiuxu-lite.css";
          }
          return "[name][extname]";
        },
      },
    },

    sourcemap: true,
    outDir: "dist-lite",
    emptyOutDir: true,

    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "sass:math";`,
        api: "modern-compiler",
      },
    },
  },

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
