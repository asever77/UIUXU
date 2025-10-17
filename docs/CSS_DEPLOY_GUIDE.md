# 🎨 CSS 배포 가이드

## 📦 CSS는 어떻게 배포되나요?

### ✅ 자동으로 함께 배포됩니다!

Vite 라이브러리 빌드 시 **SCSS → CSS 자동 변환 및 포함**됩니다.

---

## 🔍 현재 설정 분석

### vite.config.lib.js 설정

```javascript
// CSS 파일 생성 설정
assetFileNames: (assetInfo) => {
  if (assetInfo.name.endsWith('.css')) {
    return 'uiuxu.css';  // ← 모든 CSS가 하나로 합쳐짐
  }
  return '[name][extname]';
}

// SCSS 자동 컴파일
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `@use "sass:math";`,
      api: 'modern-compiler'
    }
  }
}
```

---

## 📦 빌드 결과

### npm run build:lib 실행 시

```
dist/
├── index.esm.js           # JavaScript (ES Module)
├── index.cjs              # JavaScript (CommonJS)
├── index.umd.js           # JavaScript (UMD)
├── accordion.esm.js       # 개별 컴포넌트
├── accordion.cjs
├── ...
└── uiuxu.css             # ⭐ 모든 스타일이 하나로!
```

**`uiuxu.css` 내용:**

- ✅ app.scss의 모든 스타일
- ✅ 모든 컴포넌트 스타일
- ✅ 압축 및 최적화됨
- ✅ 프리픽스 자동 추가

---

## 🎯 사용자가 사용하는 방법

### 방법 1: CSS 파일 직접 import (추천)

```javascript
// JavaScript
import Accordion from "uiuxu/accordion";

// CSS
import "uiuxu/dist/uiuxu.css";
// 또는
import "uiuxu/uiuxu.css";
```

### 방법 2: HTML에서 직접 로드

```html
<!-- CSS -->
<link rel="stylesheet" href="node_modules/uiuxu/dist/uiuxu.css" />

<!-- JavaScript -->
<script type="module">
  import { Accordion } from "uiuxu";
</script>
```

### 방법 3: CDN 사용

```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/uiuxu@1.0.0/dist/uiuxu.css" />

<!-- JavaScript -->
<script src="https://unpkg.com/uiuxu@1.0.0/dist/index.umd.js"></script>
```

---

## 🔧 package.json 수정 (CSS 진입점 추가)

### 현재 package.json에 CSS export 추가 필요

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs"
    },
    "./accordion": {
      "import": "./dist/accordion.esm.js",
      "require": "./dist/accordion.cjs"
    },
    // ⭐ CSS 진입점 추가
    "./styles": "./dist/uiuxu.css",
    "./dist/uiuxu.css": "./dist/uiuxu.css",
    "./uiuxu.css": "./dist/uiuxu.css"
  },
  "files": ["dist", "README.md", "LICENSE"]
}
```

---

## 📝 README에 추가할 내용

```markdown
## 📦 Installation

\`\`\`bash
npm install uiuxu
\`\`\`

## 🎨 Import Styles

### Method 1: JavaScript Import (Recommended)

\`\`\`javascript
// Import component
import Accordion from 'uiuxu/accordion';

// Import styles
import 'uiuxu/styles';
// or
import 'uiuxu/dist/uiuxu.css';
\`\`\`

### Method 2: HTML Link

\`\`\`html

<link rel="stylesheet" href="node_modules/uiuxu/dist/uiuxu.css">
\`\`\`

### Method 3: CDN

\`\`\`html

<link rel="stylesheet" href="https://unpkg.com/uiuxu@1.0.0/dist/uiuxu.css">
\`\`\`

## 💡 Complete Example

\`\`\`javascript
// Import styles (only once in your app)
import 'uiuxu/styles';

// Import components
import Accordion from 'uiuxu/accordion';
import Tab from 'uiuxu/tab';

// Use components
const accordion = new Accordion({ id: 'main-acco' });
accordion.init();

const tab = new Tab({ id: 'main-tab' });
tab.init();
\`\`\`
```

---

## 🎨 CSS 분리 배포 (선택사항)

### 컴포넌트별 CSS 분리하고 싶다면?

#### vite.config.lib.js 수정

```javascript
build: {
  rollupOptions: {
    output: {
      assetFileNames: (assetInfo) => {
        if (assetInfo.name.endsWith('.css')) {
          // 컴포넌트별 CSS 파일 생성
          return 'css/[name].css';
        }
        return '[name][extname]';
      }
    }
  },
  // CSS 코드 분할
  cssCodeSplit: true
}
```

#### 결과

```
dist/
├── index.esm.js
├── accordion.esm.js
├── tab.esm.js
└── css/
    ├── accordion.css      # 아코디언 전용 CSS
    ├── tab.css            # 탭 전용 CSS
    └── common.css         # 공통 CSS
```

#### 사용

```javascript
// 아코디언만 사용 시
import Accordion from "uiuxu/accordion";
import "uiuxu/css/accordion.css"; // 아코디언 CSS만
```

---

## 🎯 권장 방식

### ⭐ 방식 1: 모든 CSS를 하나로 (현재 설정 - 추천!)

**장점:**

- ✅ 관리 쉬움
- ✅ HTTP 요청 1번
- ✅ 전체 스타일 일관성

**단점:**

- ❌ 번들 크기 약간 큼 (하지만 gzip으로 압축하면 크게 차이 없음)

```javascript
import "uiuxu/styles"; // 한 번만
import Accordion from "uiuxu/accordion";
import Tab from "uiuxu/tab";
```

---

### 방식 2: 컴포넌트별 CSS 분리

**장점:**

- ✅ 필요한 CSS만 로드
- ✅ 번들 크기 최소화

**단점:**

- ❌ 관리 복잡
- ❌ HTTP 요청 여러 번
- ❌ 공통 스타일 중복 가능

```javascript
import "uiuxu/css/accordion.css";
import Accordion from "uiuxu/accordion";
```

---

## 📊 CSS 크기 비교

### 현재 SCSS 구조

```scss
// app.scss
@forward "abstracts/index"; // 변수, 믹스인
@forward "common/index"; // 리셋, 공통
@forward "components/index"; // 모든 컴포넌트
@forward "pages/index"; // 페이지별
```

### 예상 CSS 크기

| 항목        | 크기 (압축 전) | 크기 (gzip) |
| ----------- | -------------- | ----------- |
| 전체 CSS    | 150 KB         | 20 KB       |
| Accordion만 | 5 KB           | 1 KB        |
| Tab만       | 4 KB           | 0.8 KB      |
| 공통 스타일 | 50 KB          | 8 KB        |

**결론:** 전체 CSS도 gzip 압축 시 매우 작음!

---

## 🔥 실전 예제

### 예제 1: Next.js 프로젝트

```javascript
// _app.js
import "uiuxu/styles"; // 전역으로 한 번만

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

// pages/index.js
import Accordion from "uiuxu/accordion";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const acco = new Accordion({ id: "main-acco" });
    acco.init();
  }, []);

  return <div id="main-acco">...</div>;
}
```

---

### 예제 2: Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- CSS -->
    <link rel="stylesheet" href="node_modules/uiuxu/dist/uiuxu.css" />
  </head>
  <body>
    <div id="main-acco" class="accordion">
      <!-- 아코디언 내용 -->
    </div>

    <script type="module">
      import Accordion from "./node_modules/uiuxu/dist/accordion.esm.js";

      const acco = new Accordion({ id: "main-acco" });
      acco.init();
    </script>
  </body>
</html>
```

---

### 예제 3: Vue 3

```vue
<template>
  <div id="main-acco">
    <!-- 아코디언 내용 -->
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import Accordion from "uiuxu/accordion";
import "uiuxu/styles";

onMounted(() => {
  const acco = new Accordion({ id: "main-acco" });
  acco.init();
});
</script>
```

---

## ✅ 체크리스트

### 빌드 시 확인사항

- [x] ✅ vite.config.lib.js에 CSS 설정 있음
- [x] ✅ SCSS preprocessor 설정 있음
- [x] ✅ assetFileNames에서 CSS 파일명 지정
- [ ] package.json exports에 CSS 진입점 추가 필요
- [ ] README에 CSS import 방법 안내 필요

---

## 🚀 최종 수정사항

### 1. package.json 수정 (CSS export 추가)

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs"
    },
    "./styles": "./dist/uiuxu.css",
    "./dist/uiuxu.css": "./dist/uiuxu.css"
  }
}
```

### 2. README 업데이트

CSS import 방법 추가

### 3. 빌드 & 확인

```bash
npm run build:lib

# dist 폴더 확인
ls dist/
# → uiuxu.css 파일이 있어야 함!
```

---

## 💡 결론

### CSS는 자동으로 배포됩니다!

1. ✅ **빌드 시 자동 생성**: `npm run build:lib` → `dist/uiuxu.css`
2. ✅ **npm 배포 시 포함**: `files: ["dist"]`
3. ✅ **사용자가 import**: `import 'uiuxu/styles'`

**별도 작업 필요 없음!** 단, package.json에 CSS export만 추가하면 됩니다! 🎉

---

**다음 할 일:**

1. package.json에 CSS export 추가
2. README에 CSS import 방법 추가
3. 빌드해서 uiuxu.css 생성 확인

도움이 더 필요하시면 말씀해주세요! 😊
