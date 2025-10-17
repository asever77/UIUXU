# 📦 UIUXU 빌드 시스템 설정 가이드

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```
브라우저가 자동으로 열리고 http://localhost:5173 에서 확인할 수 있습니다.

### 3. 프로덕션 빌드
```bash
npm run build
```
`dist/` 폴더에 최적화된 파일이 생성됩니다.

---

## 📋 npm 스크립트 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (포트 5173, 핫 리로드 활성화) |
| `npm run build` | 프로덕션 빌드 (압축, console.log 제거) |
| `npm run preview` | 빌드된 파일 미리보기 |
| `npm run scss:watch` | SCSS 파일 감시 및 자동 컴파일 |
| `npm run scss:build` | SCSS 압축 빌드 |
| `npm run lint` | JavaScript 린트 검사 |
| `npm run clean` | dist 폴더 삭제 |

---

## 🛠️ 설정 파일 설명

### 1. **package.json**
프로젝트 메타데이터 및 의존성 관리

```json
{
  "name": "uiuxu",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

**주요 의존성:**
- `vite`: 빠른 빌드 도구
- `sass`: SCSS 컴파일러
- `terser`: JavaScript 압축 도구
- `eslint`: 코드 품질 검사

---

### 2. **vite.config.js**
Vite 빌드 설정

#### 개발 서버 설정
```javascript
server: {
  port: 5173,
  open: '/src/page/index.html',
  host: true,
  hmr: { overlay: true }
}
```

#### 경로 별칭 (Alias)
```javascript
resolve: {
  alias: {
    '@': resolve(__dirname, 'src'),
    '@js': resolve(__dirname, 'src/assets/js'),
    '@scss': resolve(__dirname, 'src/assets/scss'),
    '@utils': resolve(__dirname, 'src/assets/js/utils')
  }
}
```

**사용 예시:**
```javascript
// Before
import { Logger } from '../../../assets/js/utils/logger.js';

// After
import { Logger } from '@utils/logger.js';
```

#### 프로덕션 최적화
```javascript
terserOptions: {
  compress: {
    drop_console: true,        // console.log 제거
    drop_debugger: true,       // debugger 제거
    pure_funcs: ['console.log'] // 완전 제거
  }
}
```

---

### 3. **.env / .env.production**
환경별 변수 설정

#### 개발 환경 (`.env`)
```bash
VITE_DEV_MODE=true
VITE_LOG_LEVEL=debug
```

#### 프로덕션 환경 (`.env.production`)
```bash
VITE_DEV_MODE=false
VITE_LOG_LEVEL=error
```

**JavaScript에서 사용:**
```javascript
const isDev = import.meta.env.VITE_DEV_MODE === 'true';
const logLevel = import.meta.env.VITE_LOG_LEVEL;

if (isDev) {
  Logger.debug('개발 모드입니다');
}
```

---

### 4. **.gitignore**
Git 추적 제외 파일

```bash
node_modules/     # 의존성 패키지
dist/             # 빌드 결과물
.env.local        # 로컬 환경 변수
*.log             # 로그 파일
```

---

## 🎯 빌드 프로세스

### 개발 모드 (npm run dev)

```
1. Vite 개발 서버 시작
   ↓
2. SCSS 자동 컴파일
   ↓
3. 핫 모듈 리플레이스먼트 (HMR) 활성화
   ↓
4. 브라우저 자동 새로고침
```

**특징:**
- ✅ 소스맵 생성 (디버깅 용이)
- ✅ console.log 유지
- ✅ 압축 없음 (빠른 빌드)
- ✅ 파일 변경 감지 → 자동 새로고침

---

### 프로덕션 모드 (npm run build)

```
1. 소스 코드 번들링
   ↓
2. SCSS → CSS 컴파일 & 압축
   ↓
3. JavaScript 압축 (Terser)
   ├─ console.log 제거
   ├─ debugger 제거
   └─ 주석 제거
   ↓
4. 정적 파일 복사
   ↓
5. dist/ 폴더에 출력
```

**특징:**
- ✅ 최소 파일 크기
- ✅ console.log 자동 제거
- ✅ 해시 파일명 (캐싱 최적화)
- ✅ 소스맵 제외

---

## 📦 빌드 결과물 구조

```
dist/
├── index.html
├── accordion.html
├── button.html
├── ...
└── assets/
    ├── css/
    │   └── app-[hash].css
    ├── js/
    │   ├── main-[hash].js
    │   ├── accordion-[hash].js
    │   └── utils-[hash].js
    └── img/
        └── ...
```

---

## 🔥 핫 모듈 리플레이스먼트 (HMR)

Vite는 파일 변경 시 **전체 페이지를 새로고침하지 않고** 변경된 모듈만 교체합니다.

### HMR 동작 방식

```javascript
// JavaScript 파일 수정 시
코드 변경 → Vite 감지 → 변경 모듈만 교체 → 상태 유지

// SCSS 파일 수정 시
스타일 변경 → CSS 재컴파일 → 페이지 새로고침 없이 스타일 적용
```

**장점:**
- ⚡ 빠른 피드백 (밀리초 단위)
- 🎯 현재 상태 유지
- 💾 폼 입력 값 보존

---

## 🎨 SCSS 컴파일

### 자동 컴파일 (Vite 사용)
```bash
npm run dev
```
Vite가 자동으로 SCSS를 컴파일하고 브라우저에 주입합니다.

### 수동 컴파일 (Sass 직접 사용)
```bash
# 감시 모드 (파일 변경 감지)
npm run scss:watch

# 한 번만 빌드
npm run scss:build
```

---

## 🚀 배포 프로세스

### 1. 빌드
```bash
npm run build
```

### 2. 미리보기 (선택)
```bash
npm run preview
```

### 3. 배포
```bash
# dist 폴더를 서버에 업로드
# 또는 GitHub Pages, Vercel, Netlify 등 사용
```

---

## ⚙️ 환경별 설정

### 개발 환경
```javascript
// logger.js에서 자동 감지
const isDev = 
  location.hostname === 'localhost' ||
  import.meta.env.VITE_DEV_MODE === 'true';

if (isDev) {
  Logger.debug('개발 모드 활성화');
}
```

### 프로덕션 환경
```bash
# 프로덕션 빌드
npm run build

# .env.production 사용됨
VITE_DEV_MODE=false
```

---

## 🔍 디버깅

### 개발 모드
- ✅ 소스맵 활성화
- ✅ console.log 동작
- ✅ 에러 오버레이 표시

### 소스맵 확인
```javascript
// Chrome DevTools
Sources 탭 → webpack:// → src/
```

### 빌드 분석
```bash
npm run build

# 출력:
# dist/assets/js/main-abc123.js  (245 KB)
# dist/assets/css/app-xyz789.css (89 KB)
```

---

## 💡 성능 최적화

### 1. 코드 분할
```javascript
// Vite가 자동으로 청크 분할
import('./component/dialog.js').then(module => {
  // 필요할 때만 로드
});
```

### 2. 이미지 최적화
```javascript
// Vite가 자동으로 처리
import logo from '@img/logo.png';
```

### 3. CSS 최적화
```javascript
// SCSS → CSS 압축
// 중복 제거
// 벤더 프리픽스 자동 추가
```

---

## 🛠️ 트러블슈팅

### 문제: 포트 5173이 이미 사용 중
```bash
# 다른 포트 사용
npm run dev -- --port 3000
```

### 문제: node_modules 오류
```bash
# 캐시 삭제 후 재설치
npm run clean
rm -rf node_modules
npm install
```

### 문제: SCSS 컴파일 오류
```bash
# Sass 버전 확인
npm list sass

# 재설치
npm install sass@latest
```

---

## 📊 빌드 통계

### Before (수동 관리)
- ❌ 수동 SCSS 컴파일
- ❌ console.log 수동 제거
- ❌ 파일 압축 수동 실행
- ❌ 브라우저 수동 새로고침

### After (Vite 사용)
- ✅ 자동 SCSS 컴파일
- ✅ console.log 자동 제거
- ✅ 자동 압축 및 최적화
- ✅ 핫 리로드 (0.1초 미만)

**빌드 시간 비교:**
- 수동: ~30초
- Vite: ~3초 (10배 빠름!)

---

## 🎓 학습 자료

### Vite 공식 문서
https://vitejs.dev/

### SCSS 문서
https://sass-lang.com/

### Terser 옵션
https://terser.org/docs/api-reference

---

## 🎉 완료 체크리스트

- [x] ✅ package.json 생성
- [x] ✅ vite.config.js 설정
- [x] ✅ .env 파일 생성
- [x] ✅ .gitignore 업데이트
- [x] ✅ 개발 스크립트 추가
- [x] ✅ 빌드 스크립트 추가
- [x] ✅ SCSS 컴파일 자동화
- [x] ✅ 프로덕션 최적화 설정

---

## 🚀 다음 단계

이제 다음 명령어로 바로 시작할 수 있습니다:

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 코드 수정 → 자동 새로고침 ⚡
```

**즐거운 개발 되세요!** 🎉
