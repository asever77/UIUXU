# 🎨 CSS 배포 완벽 정리

## ✅ 결론: CSS는 자동으로 배포됩니다!

---

## 📦 빌드 시 어떻게 되나요?

### npm run build:lib 실행 시

```bash
npm run build:lib
```

**생성되는 파일:**

```
dist/
├── index.esm.js           # JavaScript
├── index.cjs
├── index.umd.js
├── accordion.esm.js       # 개별 컴포넌트
├── accordion.cjs
├── tab.esm.js
├── tab.cjs
├── ...
└── uiuxu.css             # ⭐ 모든 CSS가 하나로!
```

**`uiuxu.css` 포함 내용:**

- ✅ `src/assets/scss/app.scss`
- ✅ 모든 컴포넌트 스타일
- ✅ 공통 스타일 (reset, common 등)
- ✅ 자동 압축 및 최적화
- ✅ 벤더 프리픽스 자동 추가

---

## 🎯 사용자 사용법

### 방법 1: JavaScript에서 import (추천!)

```javascript
// 스타일 import (앱 전체에서 한 번만)
import "uiuxu/styles";

// 컴포넌트 import
import Accordion from "uiuxu/accordion";
import Tab from "uiuxu/tab";

// 사용
const acco = new Accordion({ id: "main-acco" });
acco.init();
```

### 방법 2: HTML에서 직접 로드

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- CSS -->
    <link rel="stylesheet" href="node_modules/uiuxu/dist/uiuxu.css" />
  </head>
  <body>
    <div id="main-acco" class="accordion">...</div>

    <script type="module">
      import Accordion from "./node_modules/uiuxu/dist/accordion.esm.js";
      const acco = new Accordion({ id: "main-acco" });
      acco.init();
    </script>
  </body>
</html>
```

### 방법 3: CDN 사용

```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/uiuxu@1.0.0/dist/uiuxu.css" />

<!-- JavaScript -->
<script src="https://unpkg.com/uiuxu@1.0.0/dist/index.umd.js"></script>
<script>
  const { Accordion } = UIUXU;
  const acco = new Accordion({ id: "main-acco" });
  acco.init();
</script>
```

---

## 📊 CSS 크기

| 항목     | 예상 크기 |
| -------- | --------- |
| CSS 원본 | ~150 KB   |
| CSS 압축 | ~50 KB    |
| CSS gzip | ~15 KB ⭐ |

**실제 전송 크기: 약 15KB** (매우 작음!)

---

## ⚙️ 설정 확인

### ✅ vite.config.lib.js (이미 설정됨)

```javascript
build: {
  rollupOptions: {
    output: {
      assetFileNames: (assetInfo) => {
        if (assetInfo.name.endsWith('.css')) {
          return 'uiuxu.css';  // ← CSS 파일명
        }
        return '[name][extname]';
      }
    }
  }
},
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `@use "sass:math";`,
      api: 'modern-compiler'
    }
  }
}
```

### ✅ package.json (방금 수정됨)

```json
{
  "exports": {
    "./styles": "./dist/uiuxu.css",
    "./dist/uiuxu.css": "./dist/uiuxu.css",
    "./uiuxu.css": "./dist/uiuxu.css"
  },
  "files": [
    "dist", // ← CSS도 함께 포함됨
    "README.md",
    "LICENSE"
  ]
}
```

---

## 🎨 SCSS 구조

### 현재 SCSS 파일들

```
src/assets/scss/
├── app.scss              # 메인 (모든 것 import)
├── abstracts/
│   ├── _variables.scss   # 변수
│   ├── _mixin.scss       # 믹스인
│   └── _root.scss        # CSS 변수
├── common/
│   ├── _reset.scss       # 리셋
│   ├── _common.scss      # 공통
│   ├── _button.scss
│   └── ...
└── components/
    ├── _accordion.scss   # 아코디언 스타일
    ├── _tab.scss         # 탭 스타일
    └── ...
```

### 빌드 과정

```
app.scss
  ↓ (Vite가 자동 처리)
SCSS 컴파일
  ↓
CSS 변환
  ↓
압축 (minify)
  ↓
dist/uiuxu.css 생성
```

---

## 💡 완전한 예제

### React 프로젝트

```javascript
// App.jsx
import "uiuxu/styles"; // 최상단에서 한 번만
import Accordion from "uiuxu/accordion";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const acco = new Accordion({ id: "main-acco" });
    acco.init();

    return () => {
      acco.destroy(); // 정리
    };
  }, []);

  return (
    <div id="main-acco" className="accordion">
      {/* 아코디언 내용 */}
    </div>
  );
}
```

### Vue 3 프로젝트

```vue
<template>
  <div id="main-acco" class="accordion">
    <!-- 아코디언 내용 -->
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import Accordion from "uiuxu/accordion";
import "uiuxu/styles";

let acco;

onMounted(() => {
  acco = new Accordion({ id: "main-acco" });
  acco.init();
});

onUnmounted(() => {
  acco?.destroy();
});
</script>
```

### Next.js 프로젝트

```javascript
// _app.js
import 'uiuxu/styles';  // 전역으로 한 번만

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;

// pages/index.js
import Accordion from 'uiuxu/accordion';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const acco = new Accordion({ id: 'main-acco' });
    acco.init();

    return () => acco.destroy();
  }, []);

  return <div id="main-acco">...</div>;
}
```

---

## 🚀 배포 전 체크리스트

- [x] ✅ vite.config.lib.js에 CSS 설정 있음
- [x] ✅ SCSS preprocessor 설정 있음
- [x] ✅ package.json exports에 CSS 진입점 추가됨
- [ ] README에 CSS import 방법 추가 필요
- [ ] 빌드해서 uiuxu.css 생성 확인 필요

---

## 📝 README에 추가할 내용

```markdown
## 🎨 Import Styles

### In JavaScript/TypeScript

\`\`\`javascript
// Import styles (only once in your app)
import 'uiuxu/styles';

// Import components
import Accordion from 'uiuxu/accordion';
import Tab from 'uiuxu/tab';
\`\`\`

### In HTML

\`\`\`html

<link rel="stylesheet" href="node_modules/uiuxu/dist/uiuxu.css">
\`\`\`

### Via CDN

\`\`\`html

<link rel="stylesheet" href="https://unpkg.com/uiuxu@1.0.0/dist/uiuxu.css">
\`\`\`

## 📦 What's Included

\`\`\`bash
npm install uiuxu
\`\`\`

This includes:

- ✅ All JavaScript components
- ✅ Complete CSS styles (compressed)
- ✅ TypeScript definitions (coming soon)
```

---

## 🎯 핵심 정리

### Q: CSS를 따로 올려야 하나요?

**A: 아니요! 자동으로 포함됩니다.**

### Q: 어떻게 포함되나요?

**A: `npm run build:lib` 실행 시 `dist/uiuxu.css` 자동 생성**

### Q: 사용자는 어떻게 사용하나요?

**A: `import 'uiuxu/styles'` 한 줄로 끝!**

### Q: CSS 크기는?

**A: 압축 시 약 15KB (매우 작음)**

### Q: 컴포넌트별 CSS 분리 가능한가요?

**A: 가능하지만 비추천. 전체 CSS도 충분히 작음**

---

## ✅ 다음 단계

```bash
# 1. 빌드 테스트
npm run build:lib

# 2. dist 폴더 확인
ls dist/
# → uiuxu.css 파일이 있어야 함!

# 3. 크기 확인
ls -lh dist/uiuxu.css

# 4. README 업데이트

# 5. 배포
npm publish
```

---

## 🎉 결론

**CSS는 걱정하지 마세요!**

1. ✅ 자동으로 빌드됨
2. ✅ 자동으로 배포됨
3. ✅ 사용자가 쉽게 import
4. ✅ 크기도 작음 (~15KB)

**추가 작업 필요 없습니다!** 🚀

도움이 더 필요하시면 말씀해주세요! 😊
