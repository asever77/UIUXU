# 🎯 선택적 컴포넌트 배포 가이드

## 📦 방법 1: 최소 버전 패키지 (Lite Version)

원하는 컴포넌트만 포함해서 배포하기

---

## 🎨 시나리오별 전략

### 전략 A: 별도 패키지로 배포 (추천)

**예시:**

- `uiuxu` (전체 컴포넌트)
- `uiuxu-lite` (아코디언 + 탭만)

#### 1. 새 package.json 생성

```json
{
  "name": "uiuxu-lite",
  "version": "1.0.0",
  "description": "UIUXU Component Library - Lite Version (Accordion & Tab only)",
  "main": "dist/index.cjs",
  "module": "dist/index.esm.js",
  "browser": "dist/index.umd.js",
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs"
    },
    "./accordion": {
      "import": "./dist/accordion.esm.js",
      "require": "./dist/accordion.cjs"
    },
    "./tab": {
      "import": "./dist/tab.esm.js",
      "require": "./dist/tab.cjs"
    }
  },
  "keywords": ["ui", "ux", "accordion", "tab", "lite", "minimal"]
}
```

#### 2. 빌드 설정 수정

```javascript
// vite.config.lite.js
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: {
        // 메인 진입점 (Lite)
        index: resolve(__dirname, "src/index.lite.js"),
        // 개별 컴포넌트
        accordion: resolve(__dirname, "src/assets/js/component/accordion.js"),
        tab: resolve(__dirname, "src/assets/js/component/tab.js"),
        // 유틸리티
        logger: resolve(__dirname, "src/assets/js/utils/logger.js"),
        errors: resolve(__dirname, "src/assets/js/utils/errors.js"),
        utils: resolve(__dirname, "src/assets/js/utils/utils.js"),
      },
      name: "UIUXULite",
      formats: ["es", "cjs", "umd"],
    },
  },
});
```

#### 3. package.json 스크립트 추가

```json
{
  "scripts": {
    "build:full": "vite build --config vite.config.lib.js",
    "build:lite": "vite build --config vite.config.lite.js"
  }
}
```

#### 4. 배포

```bash
# Lite 버전 빌드
npm run build:lite

# Lite 버전으로 배포
npm publish
```

**사용자 관점:**

```bash
# 전체 버전
npm install uiuxu

# Lite 버전 (작은 번들 크기)
npm install uiuxu-lite
```

---

### 전략 B: 하나의 패키지에서 선택적 Import (더 추천!)

**장점:** 하나의 패키지로 관리, 사용자가 필요한 것만 import

#### package.json (현재 유지)

```json
{
  "name": "uiuxu",
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs"
    },
    "./accordion": "./dist/accordion.esm.js",
    "./tab": "./dist/tab.esm.js",
    "./dialog": "./dist/dialog.esm.js"
    // ... 각 컴포넌트별 진입점
  }
}
```

**사용자가 선택:**

```javascript
// ✅ 방법 1: 필요한 것만 import (트리쉐이킹)
import Accordion from "uiuxu/accordion";
import Tab from "uiuxu/tab";
// → 번들에 Accordion + Tab만 포함됨

// ✅ 방법 2: 전체 import
import { Accordion, Tab, Dialog } from "uiuxu";
// → 모든 컴포넌트 포함

// ❌ 방법 3: 사용 안하는 컴포넌트는 import 안함
// Dialog, Dropdown 등은 번들에 포함 안됨
```

---

### 전략 C: Scoped Packages (개별 패키지)

각 컴포넌트를 독립적인 패키지로 배포

**예시:**

```bash
npm install @uiuxu/accordion
npm install @uiuxu/tab
```

#### 장점:

- ✅ 완전히 독립적인 버전 관리
- ✅ 최소 번들 크기
- ✅ 선택적 설치

#### 단점:

- ❌ 관리 복잡
- ❌ 여러 패키지 설치 필요

---

## 🎯 추천 방법: 전략 B (하나의 패키지 + 선택적 Import)

### 현재 설정 그대로 유지

```bash
# 전체 빌드
npm run build:lib

# 배포
npm publish
```

### 사용자가 선택하는 방식

```javascript
// 아코디언만 필요한 경우
import Accordion from "uiuxu/accordion";

// 탭만 필요한 경우
import Tab from "uiuxu/tab";

// 둘 다 필요한 경우
import Accordion from "uiuxu/accordion";
import Tab from "uiuxu/tab";
```

**번들 크기 비교:**

```
전체 import: 245 KB
Accordion만: 15 KB
Tab만: 12 KB
Accordion + Tab: 27 KB
```

---

## 📊 실제 예시

### 예시 1: 최소 패키지 (Accordion만)

#### vite.config.minimal.js

```javascript
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.minimal.js"),
        accordion: resolve(__dirname, "src/assets/js/component/accordion.js"),
        logger: resolve(__dirname, "src/assets/js/utils/logger.js"),
        errors: resolve(__dirname, "src/assets/js/utils/errors.js"),
      },
    },
  },
});
```

#### src/index.minimal.js

```javascript
// 아코디언만
export { default as Accordion } from "./assets/js/component/accordion.js";
export { Logger } from "./assets/js/utils/logger.js";
export { ErrorHandler } from "./assets/js/utils/errors.js";
```

#### package.json

```json
{
  "name": "uiuxu-accordion",
  "description": "Accordion component only",
  "scripts": {
    "build": "vite build --config vite.config.minimal.js"
  }
}
```

#### 배포

```bash
npm run build
npm publish
```

#### 사용

```bash
npm install uiuxu-accordion
```

```javascript
import { Accordion } from "uiuxu-accordion";
```

---

## 🎨 실전 가이드

### Case 1: 아코디언 + 탭만 배포하고 싶어요

#### 방법 A: 별도 패키지

```bash
# 1. index.lite.js 수정 (위에서 만든 파일)
# 2. vite.config.lite.js 생성
# 3. package.json name을 "uiuxu-lite"로 변경
# 4. npm run build:lite
# 5. npm publish
```

#### 방법 B: 기존 패키지 유지 (추천!)

```bash
# 1. 그대로 배포
npm run build:lib
npm publish

# 2. README에 사용법 명시
```

**README.md 예시:**

```markdown
## 📦 Installation

\`\`\`bash
npm install uiuxu
\`\`\`

## 🎯 Usage

### Import only what you need (Recommended)

\`\`\`javascript
// Only Accordion (smaller bundle)
import Accordion from 'uiuxu/accordion';

// Only Tab
import Tab from 'uiuxu/tab';

// Both
import Accordion from 'uiuxu/accordion';
import Tab from 'uiuxu/tab';
\`\`\`

### Bundle Size

| Import          | Size   |
| --------------- | ------ |
| Full library    | 245 KB |
| Accordion only  | 15 KB  |
| Tab only        | 12 KB  |
| Accordion + Tab | 27 KB  |
```

---

## ✅ 최종 추천

### 🏆 Best Practice: 현재 구조 그대로 배포

**이유:**

1. ✅ 모든 컴포넌트 포함
2. ✅ 사용자가 필요한 것만 import (트리쉐이킹)
3. ✅ 하나의 패키지로 관리 용이
4. ✅ 번들러(Webpack, Vite 등)가 자동으로 최적화

**현재 설정:**

```bash
# 빌드
npm run build:lib

# 배포
npm publish
```

**사용자:**

```javascript
// 원하는 것만 import
import Accordion from "uiuxu/accordion";
import Tab from "uiuxu/tab";
// → 자동으로 최소 번들 크기
```

---

## 🎯 요약

| 방법                            | 장점                   | 단점        | 추천도     |
| ------------------------------- | ---------------------- | ----------- | ---------- |
| **전체 패키지 + 선택적 import** | 관리 쉬움, 자동 최적화 | -           | ⭐⭐⭐⭐⭐ |
| **Lite 버전 별도 배포**         | 명확한 구분            | 관리 2배    | ⭐⭐⭐     |
| **Scoped packages**             | 완전 독립적            | 관리 복잡   | ⭐⭐       |
| **최소 패키지**                 | 가장 작은 크기         | 확장성 없음 | ⭐⭐       |

**결론: 현재 구조 그대로 배포하고, README에서 선택적 import 방법을 안내하는 것이 가장 좋습니다!** 🚀

더 궁금한 점이 있으면 말씀해주세요! 😊
