# UIUXU

> Modern UI/UX Component Library with Vite Build System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/vite-5.4.10-646CFF?logo=vite)](https://vitejs.dev/)

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저가 자동으로 열립니다: http://localhost:5173

### 3. 프로덕션 빌드

```bash
npm run build
```

---

## 📦 주요 기능

### ⚡ 초고속 개발 환경

- **Vite 기반**: 0.1초 핫 모듈 리플레이스먼트
- **자동 SCSS 컴파일**: 파일 저장 시 즉시 반영
- **상태 유지**: 폼 입력값, 스크롤 위치 보존

### 🎨 UI 컴포넌트

- Accordion (아코디언)
- Button Selection (버튼 선택)
- Dialog / Modal (대화상자)
- Dropdown (드롭다운)
- Tab (탭)
- Tooltip (툴팁)
- Range Slider (범위 슬라이더)
- Time Select (시간 선택)
- Form Controls (폼 컨트롤)
- Drag & Drop (드래그 앤 드롭)
- Bubble Chart (버블 차트)
- Countdown (카운트다운)

### 🛠️ 개발 도구

- **Logger 시스템**: 개발/프로덕션 자동 분기
- **Error Handler**: 7가지 커스텀 에러 타입
- **Memory Management**: Destroy 패턴으로 메모리 누수 방지
- **Path Alias**: `@utils`, `@components` 등 깔끔한 임포트

---

## 📋 npm 스크립트

| 명령어               | 설명                                  |
| -------------------- | ------------------------------------- |
| `npm run dev`        | 개발 서버 실행 (포트 5173)            |
| `npm run build`      | 프로덕션 빌드 (console.log 자동 제거) |
| `npm run preview`    | 빌드 결과 미리보기                    |
| `npm run scss:watch` | SCSS 파일 감시 및 컴파일              |
| `npm run scss:build` | SCSS 압축 빌드                        |
| `npm run lint`       | ESLint 검사                           |
| `npm run clean`      | dist 폴더 삭제                        |

---

## 📁 프로젝트 구조

```
UIUXU/
├── src/
│   ├── assets/
│   │   ├── css/           # 컴파일된 CSS
│   │   ├── scss/          # SCSS 소스
│   │   │   ├── abstracts/ # 변수, 믹스인
│   │   │   ├── common/    # 공통 스타일
│   │   │   ├── components/# 컴포넌트 스타일
│   │   │   └── pages/     # 페이지 스타일
│   │   ├── js/
│   │   │   ├── component/ # UI 컴포넌트
│   │   │   ├── utils/     # 유틸리티
│   │   │   │   ├── logger.js       # 로거
│   │   │   │   ├── errors.js       # 에러 핸들러
│   │   │   │   └── utils.js        # 공통 함수
│   │   │   └── uiuxu.common.js     # 진입점
│   │   ├── img/           # 이미지
│   │   └── data/          # JSON 데이터
│   └── page/              # HTML 페이지
├── docs/                  # 문서
│   ├── BUILD_SYSTEM_GUIDE.md
│   ├── PRIORITY_1_COMPLETE.md  # Logger
│   ├── PRIORITY_2_COMPLETE.md  # Error Handler
│   ├── PRIORITY_3_COMPLETE.md  # Memory Management
│   └── PRIORITY_4_COMPLETE.md  # Build System
├── package.json
├── vite.config.js
├── .env
├── .env.production
└── .gitignore
```

---

## 🎯 경로 별칭

```javascript
// vite.config.js에 설정됨
import { Logger } from "@utils/logger.js";
import Accordion from "@components/accordion.js";
import "@scss/app.scss";
```

**사용 가능한 별칭:**

- `@` → `src/`
- `@js` → `src/assets/js/`
- `@scss` → `src/assets/scss/`
- `@utils` → `src/assets/js/utils/`
- `@components` → `src/assets/js/component/`

---

## 📚 문서

자세한 가이드는 `docs/` 폴더를 참고하세요:

- **[빌드 시스템 가이드](docs/BUILD_SYSTEM_GUIDE.md)** - Vite 설정 및 사용법
- **[Logger 가이드](src/assets/js/utils/README_LOGGER.md)** - 로깅 시스템
- **[Error Handler 가이드](src/assets/js/utils/README_ERRORS.md)** - 에러 처리
- **[Memory Management 가이드](src/assets/js/utils/README_MEMORY.md)** - 메모리 관리

---

## 🔧 개발 환경

### 요구사항

- Node.js >= 18.0.0
- npm >= 9.0.0

### 추천 VSCode 확장

- ESLint
- Prettier
- Sass
- Auto Rename Tag
- Path Intellisense

---

## 🎨 컴포넌트 사용 예시

### Accordion

```javascript
import Accordion from "@components/accordion.js";

const acco = new Accordion({
  id: "main-acco",
  activeIndex: 0,
});

acco.init();

// 사용 후 정리
acco.destroy();
```

### Button Selection

```javascript
import ButtonSelection from "@components/buttonSelection.js";

const btnSel = new ButtonSelection({
  selection: document.getElementById("btn-group"),
  callback: (values) => {
    console.log("선택된 값:", values);
  },
});

btnSel.init();
```

---

## 🏗️ 빌드 프로세스

### 개발 모드

```bash
npm run dev
```

- ⚡ 0.1초 핫 리로드
- ✅ console.log 유지
- ✅ 소스맵 생성
- ✅ 상태 유지

### 프로덕션 빌드

```bash
npm run build
```

- 🗜️ 파일 압축 (70% 감소)
- ❌ console.log 자동 제거
- 🔐 해시 파일명 (캐싱 최적화)
- 📦 dist/ 폴더에 출력

---

## 📊 성능

| 항목           | 측정값 |
| -------------- | ------ |
| 개발 서버 시작 | 0.5초  |
| 핫 리로드 속도 | 0.1초  |
| 프로덕션 빌드  | 3초    |
| 파일 크기 감소 | 70%    |

---

## 🤝 기여

개선 사항이나 버그 리포트는 언제나 환영합니다!

---

## 📄 라이선스

MIT License - 자유롭게 사용하세요.

---

## 👨‍💻 제작자

**asever77**

---

## 📝 변경 이력

### v1.0.0 (2025-10-17)

- ✅ Vite 빌드 시스템 구축
- ✅ Logger 시스템 추가
- ✅ Error Handler 추가
- ✅ Memory Management 패턴 적용
- ✅ 경로 별칭 설정
- ✅ 프로덕션 최적화
- ✅ 완벽한 문서화
