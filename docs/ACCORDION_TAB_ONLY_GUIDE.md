# 🎯 아코디언 + 탭만 배포하기

## 3가지 방법 비교

---

## 방법 1: 현재 패키지 그대로 배포 (⭐⭐⭐⭐⭐ 추천!)

### 장점

- ✅ **가장 간단함** - 추가 작업 없음
- ✅ **관리 용이** - 하나의 패키지만 관리
- ✅ **사용자가 선택** - 원하는 것만 import
- ✅ **자동 최적화** - 번들러가 트리쉐이킹

### 방법

```bash
# 1. 현재 그대로 빌드
npm run build:lib

# 2. 배포
npm publish
```

### 사용자 관점

```javascript
// ✅ 아코디언만 사용
import Accordion from "uiuxu/accordion";
// → 번들에 Accordion만 포함됨 (약 15KB)

// ✅ 탭만 사용
import Tab from "uiuxu/tab";
// → 번들에 Tab만 포함됨 (약 12KB)

// ✅ 둘 다 사용
import Accordion from "uiuxu/accordion";
import Tab from "uiuxu/tab";
// → 번들에 두 개만 포함됨 (약 27KB)

// ❌ 전체 import (비추천)
import { Accordion, Tab } from "uiuxu";
// → 모든 컴포넌트 포함됨 (약 245KB)
```

### README.md에 추가할 내용

```markdown
## 📦 Installation

\`\`\`bash
npm install uiuxu
\`\`\`

## 🎯 Usage

### ⭐ Recommended: Import only what you need

\`\`\`javascript
// Accordion only (15KB)
import Accordion from 'uiuxu/accordion';

const acco = new Accordion({ id: 'main-acco' });
acco.init();

// Tab only (12KB)
import Tab from 'uiuxu/tab';

const tab = new Tab({ id: 'main-tab' });
tab.init();
\`\`\`

### Bundle Size Comparison

| Import Method                                | Bundle Size |
| -------------------------------------------- | ----------- |
| \`import Accordion from 'uiuxu/accordion'\`  | 15 KB       |
| \`import Tab from 'uiuxu/tab'\`              | 12 KB       |
| Both Accordion + Tab                         | 27 KB       |
| Full library \`import { ... } from 'uiuxu'\` | 245 KB      |
```

---

## 방법 2: Lite 버전 별도 배포 (⭐⭐⭐)

### 장점

- ✅ 명확한 구분 (Full vs Lite)
- ✅ 패키지 크기 작음

### 단점

- ❌ 두 개의 패키지 관리
- ❌ 추가 작업 필요

### 설정 파일 (이미 생성됨!)

- ✅ `src/index.lite.js` - Lite 진입점
- ✅ `vite.config.lite.js` - Lite 빌드 설정

### 방법

```bash
# 1. Lite 버전 빌드
npm run build:lite

# 2. package.json 이름 변경 (임시)
{
  "name": "uiuxu-lite",
  "description": "UIUXU Component Library - Lite Version (Accordion & Tab only)",
  "main": "dist-lite/index.cjs",
  "module": "dist-lite/index.esm.js",
  "exports": {
    ".": {
      "import": "./dist-lite/index.esm.js",
      "require": "./dist-lite/index.cjs"
    },
    "./accordion": "./dist-lite/accordion.esm.js",
    "./tab": "./dist-lite/tab.esm.js"
  }
}

# 3. 배포
npm publish
```

### 사용자 관점

```bash
# 전체 버전
npm install uiuxu

# Lite 버전 (더 작음)
npm install uiuxu-lite
```

```javascript
// uiuxu-lite 사용
import { Accordion, Tab } from "uiuxu-lite";
```

---

## 방법 3: Scoped Package (⭐⭐)

### 개별 컴포넌트를 독립 패키지로

```bash
npm install @uiuxu/accordion
npm install @uiuxu/tab
```

### 장점

- ✅ 완전히 독립적
- ✅ 가장 작은 번들

### 단점

- ❌ 관리가 매우 복잡
- ❌ 여러 패키지 설치 필요

---

## 🎯 실전 가이드: 방법 1로 진행 (추천!)

### 1단계: 빌드

```bash
npm run build:lib
```

### 2단계: README 업데이트

```markdown
## 🎯 Optimized Usage

Import only the components you need to minimize bundle size:

\`\`\`javascript
// ✅ Best Practice: Individual imports
import Accordion from 'uiuxu/accordion';
import Tab from 'uiuxu/tab';

// ❌ Avoid: Full library import
import { Accordion, Tab } from 'uiuxu'; // Includes all components
\`\`\`

### Bundle Size Impact

- **Individual import**: ~15KB per component
- **Full import**: ~245KB (all components)
```

### 3단계: 배포

```bash
npm publish
```

### 4단계: 사용자에게 안내

```markdown
## 📦 Installation & Usage

\`\`\`bash
npm install uiuxu
\`\`\`

### Accordion Component

\`\`\`javascript
import Accordion from 'uiuxu/accordion';
import 'uiuxu/styles'; // Optional: Include styles

const accordion = new Accordion({ id: 'my-accordion' });
accordion.init();
\`\`\`

### Tab Component

\`\`\`javascript
import Tab from 'uiuxu/tab';

const tab = new Tab({ id: 'my-tab' });
tab.init();
\`\`\`

### Multiple Components

\`\`\`javascript
import Accordion from 'uiuxu/accordion';
import Tab from 'uiuxu/tab';
import { Logger } from 'uiuxu/utils/logger';

const accordion = new Accordion({ id: 'main-acco' });
const tab = new Tab({ id: 'main-tab' });

accordion.init();
tab.init();

Logger.info('Components initialized');
\`\`\`
```

---

## 📊 비교표

| 방법                    | 관리 난이도       | 번들 최적화     | 사용자 편의성   | 추천도     |
| ----------------------- | ----------------- | --------------- | --------------- | ---------- |
| **방법 1: 현재 그대로** | ⭐ 쉬움           | ⭐⭐⭐⭐⭐ 자동 | ⭐⭐⭐⭐⭐ 최고 | ⭐⭐⭐⭐⭐ |
| 방법 2: Lite 버전       | ⭐⭐⭐ 중간       | ⭐⭐⭐⭐ 좋음   | ⭐⭐⭐ 좋음     | ⭐⭐⭐     |
| 방법 3: Scoped          | ⭐⭐⭐⭐⭐ 어려움 | ⭐⭐⭐⭐⭐ 최고 | ⭐⭐ 불편       | ⭐⭐       |

---

## 💡 Pro Tip: Tree Shaking이란?

현대 번들러(Webpack, Vite, Rollup)는 **사용하지 않는 코드를 자동으로 제거**합니다.

### 예시

```javascript
// 사용자 코드
import Accordion from "uiuxu/accordion";
// → 번들러가 Accordion만 포함시킴

// Dialog, Dropdown 등은 자동으로 제외됨!
```

### 조건

1. ✅ ES Module 사용 (`import/export`)
2. ✅ 개별 진입점 제공 (`exports` 필드)
3. ✅ 부작용 없는 코드

**우리 패키지는 이미 모두 충족!** 🎉

---

## ✅ 최종 결론

### 🏆 방법 1 (현재 그대로 배포)를 추천합니다!

**이유:**

1. ✅ **관리가 제일 쉬움** - 하나의 패키지만 관리
2. ✅ **자동 최적화** - 번들러가 알아서 처리
3. ✅ **유연성** - 사용자가 필요한 것만 선택
4. ✅ **확장성** - 나중에 컴포넌트 추가 가능
5. ✅ **업계 표준** - Material-UI, Ant Design 등이 사용하는 방식

### 실행 명령

```bash
# 빌드
npm run build:lib

# 배포
npm publish
```

### 사용자 안내 (README.md)

```markdown
## 💡 Bundle Size Optimization

Import components individually to minimize bundle size:

\`\`\`javascript
// ✅ Recommended (15KB)
import Accordion from 'uiuxu/accordion';

// ❌ Not recommended (245KB)
import { Accordion } from 'uiuxu';
\`\`\`
```

---

## 🚀 바로 실행하기

```bash
# 1. 현재 설정 그대로 빌드
npm run build:lib

# 2. 배포
npm publish

# 끝! 완료!
```

사용자가 알아서 필요한 것만 import하면 자동으로 최적화됩니다! 🎉

---

**질문이나 추가 도움이 필요하면 말씀해주세요!** 😊
