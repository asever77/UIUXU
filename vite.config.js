import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Vite 설정 파일
 * - 개발 서버: localhost:5173
 * - 핫 리로드: 자동 활성화
 * - SCSS 자동 컴파일
 * - 프로덕션 빌드 최적화
 */
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    // 프로젝트 루트
    root: './',

    // Public 디렉토리 설정
    publicDir: 'src/assets',

    // 개발 서버 설정
    server: {
      port: 5173,
      open: '/src/page/index.html', // 개발 서버 시작 시 자동으로 열 페이지
      host: true, // 네트워크 접속 허용
      cors: true,
      hmr: {
        overlay: true // 에러 오버레이 표시
      }
    },

    // 빌드 설정
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: isDev, // 개발 모드에서만 소스맵 생성
      
      // 청크 크기 경고 제한
      chunkSizeWarningLimit: 1000,

      // Rollup 옵션
      rollupOptions: {
        input: {
          // HTML 진입점들
          main: resolve(__dirname, 'src/page/index.html'),
          accordion: resolve(__dirname, 'src/page/accordion.html'),
          button: resolve(__dirname, 'src/page/button.html'),
          dialog: resolve(__dirname, 'src/page/dialog.html'),
          dropdown: resolve(__dirname, 'src/page/dropdown.html'),
          tab: resolve(__dirname, 'src/page/tab.html'),
          tooltip: resolve(__dirname, 'src/page/tooltip.html'),
          form: resolve(__dirname, 'src/page/form.html'),
          // 필요한 다른 HTML 페이지들 추가...
        },
        output: {
          // 청크 파일명 패턴
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            // 파일 타입별 출력 경로 지정
            if (assetInfo.name.endsWith('.css')) {
              return 'assets/css/[name]-[hash][extname]';
            }
            if (/\.(png|jpe?g|svg|gif|webp)$/.test(assetInfo.name)) {
              return 'assets/img/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          }
        }
      },

      // 압축 설정
      minify: isDev ? false : 'terser',
      terserOptions: {
        compress: {
          // 프로덕션에서 console 제거
          drop_console: !isDev,
          drop_debugger: !isDev,
          pure_funcs: isDev ? [] : ['console.log', 'console.info', 'console.debug']
        },
        format: {
          comments: false // 주석 제거
        }
      }
    },

    // CSS 설정
    css: {
      preprocessorOptions: {
        scss: {
          // SCSS 전역 변수/믹스인 자동 임포트
          additionalData: `@use "sass:math";`,
          api: 'modern-compiler'
        }
      },
      devSourcemap: isDev // 개발 모드에서 CSS 소스맵
    },

    // 경로 별칭 설정
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@js': resolve(__dirname, 'src/assets/js'),
        '@css': resolve(__dirname, 'src/assets/css'),
        '@scss': resolve(__dirname, 'src/assets/scss'),
        '@img': resolve(__dirname, 'src/assets/img'),
        '@components': resolve(__dirname, 'src/assets/js/component'),
        '@utils': resolve(__dirname, 'src/assets/js/utils'),
        '@page': resolve(__dirname, 'src/page')
      }
    },

    // 최적화 설정
    optimizeDeps: {
      include: [
        'src/assets/js/uiuxu.common.js',
        'src/assets/js/utils/utils.js'
      ]
    },

    // 플러그인 설정
    plugins: [
      // HTML 변환 플러그인 (필요시)
    ],

    // 환경 변수 설정
    define: {
      __DEV__: isDev,
      __PROD__: !isDev
    }
  };
});
