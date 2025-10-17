# 📦 UIUXU를 npm 패키지로 배포하기

## 🎯 목표

현재 UIUXU 컴포넌트 라이브러리를 npm에 등록하여 다른 개발자들이:

```bash
npm install uiuxu
```

이렇게 설치해서 사용할 수 있게 만들기!

---

## ✅ 현재 상태 분석

### 배포 가능 여부: **완벽하게 가능!** ✅

**이유:**

- ✅ 모듈화된 컴포넌트 구조
- ✅ ES6 모듈 시스템 (import/export)
- ✅ 독립적인 유틸리티 (Logger, ErrorHandler)
- ✅ SCSS 스타일 포함
- ✅ Vite 빌드 시스템 구축됨

---

## 📋 npm 패키지 등록 완벽 가이드

### 1단계: npm 계정 준비

```bash
# 1. npm 계정이 없다면 회원가입
# https://www.npmjs.com/signup

# 2. 터미널에서 로그인
npm login

# 입력 항목:
# Username: asever77
# Password: ********
# Email: your-email@example.com

# 로그인 확인
npm whoami
# 출력: asever77
```

---

### 2단계: package.json 수정

현재 package.json을 npm 배포용으로 수정합니다:

```json
{
  "name": "uiuxu",
  "version": "1.0.0",
  "description": "Modern UI/UX Component Library with Vite Build System",
  "type": "module",
  "author": "asever77",
  "license": "MIT",

  // ⭐ npm 배포에 필수 필드들
  "main": "dist/index.cjs", // CommonJS 진입점 (Node.js)
  "module": "dist/index.esm.js", // ES Module 진입점 (번들러)
  "browser": "dist/index.umd.js", // 브라우저 UMD 빌드
  "types": "dist/index.d.ts", // TypeScript 타입 정의 (선택)

  // 현대적인 exports 필드 (Node.js 12+)
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./accordion": {
      "import": "./dist/accordion.esm.js",
      "require": "./dist/accordion.cjs"
    },
    "./button-selection": {
      "import": "./dist/buttonSelection.esm.js",
      "require": "./dist/buttonSelection.cjs"
    },
    "./dialog": {
      "import": "./dist/dialog.esm.js",
      "require": "./dist/dialog.cjs"
    },
    "./dropdown": {
      "import": "./dist/dropdown.esm.js",
      "require": "./dist/dropdown.cjs"
    },
    "./tab": {
      "import": "./dist/tab.esm.js",
      "require": "./dist/tab.cjs"
    },
    "./tooltip": {
      "import": "./dist/tooltip.esm.js",
      "require": "./dist/tooltip.cjs"
    },
    "./utils/logger": {
      "import": "./dist/logger.esm.js",
      "require": "./dist/logger.cjs"
    },
    "./utils/errors": {
      "import": "./dist/errors.esm.js",
      "require": "./dist/errors.cjs"
    },
    "./styles": "./dist/uiuxu.css",
    "./package.json": "./package.json"
  },

  // npm에 포함할 파일들 (중요!)
  "files": ["dist", "README.md", "LICENSE", "CHANGELOG.md"],

  "keywords": [
    "ui",
    "ux",
    "components",
    "javascript",
    "scss",
    "vite",
    "accordion",
    "dialog",
    "modal",
    "dropdown",
    "tooltip",
    "button-selection",
    "ui-library",
    "component-library",
    "frontend"
  ],

  "repository": {
    "type": "git",
    "url": "https://github.com/asever77/UIUXU.git"
  },

  "bugs": {
    "url": "https://github.com/asever77/UIUXU/issues"
  },

  "homepage": "https://github.com/asever77/UIUXU#readme",

  // peer dependencies (사용자가 설치해야 할 것들)
  "peerDependencies": {},

  // 개발 의존성 (패키지에 포함 안됨)
  "devDependencies": {
    "vite": "^5.4.10",
    "sass": "^1.79.5",
    "terser": "^5.36.0",
    "eslint": "^9.13.0",
    "rimraf": "^6.0.1"
  },

  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:lib": "vite build --config vite.config.lib.js",
    "preview": "vite preview",
    "prepublishOnly": "npm run build:lib",
    "lint": "eslint src/**/*.js"
  },

  "publishConfig": {
    "access": "public"
  },

  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

---

### 3단계: 라이브러리 빌드 설정

`vite.config.lib.js` 파일을 생성합니다 (이미 생성됨!):

**핵심 개념:**

- **라이브러리 모드**: 웹 앱이 아닌 재사용 가능한 라이브러리로 빌드
- **멀티 포맷**: ES Module, CommonJS, UMD 모두 생성
- **개별 진입점**: 각 컴포넌트를 독립적으로 import 가능

---

### 4단계: 진입점 파일 생성

사용자가 `import UIUXU from 'uiuxu'` 형태로 사용할 수 있게 진입점을 만듭니다:

```javascript
// src/index.js (새로 생성)

// 컴포넌트들
export { default as Accordion } from "./assets/js/component/accordion.js";
export { default as ButtonSelection } from "./assets/js/component/buttonSelection.js";
export { default as Dialog } from "./assets/js/component/dialog.js";
export { default as Dropdown } from "./assets/js/component/dropdown.js";
export { default as Tab } from "./assets/js/component/tab.js";
export { default as Tooltip } from "./assets/js/component/tooltip.js";
export { default as RangeSlider } from "./assets/js/component/rangeSlider.js";
export { default as TimeSelect } from "./assets/js/component/timeSelect.js";
export { default as Countdown } from "./assets/js/component/countdown.js";
export { default as Drag } from "./assets/js/component/drag.js";
export { default as Form } from "./assets/js/component/form.js";
export { default as ChartBubble } from "./assets/js/component/chart_bubble.js";

// 유틸리티들
export { Logger } from "./assets/js/utils/logger.js";
export {
  UIError,
  ValidationError,
  ElementNotFoundError,
  NetworkError,
  InitializationError,
  ConfigurationError,
  StateError,
  ErrorHandler,
} from "./assets/js/utils/errors.js";

export * from "./assets/js/utils/utils.js";

// 버전 정보
export const version = "1.0.0";
```

---

### 5단계: README.md 작성

npm 페이지에 표시될 README를 작성합니다:

```markdown
# UIUXU

> Modern UI/UX Component Library

[![npm version](https://badge.fury.io/js/uiuxu.svg)](https://www.npmjs.com/package/uiuxu)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📦 설치

\`\`\`bash
npm install uiuxu
\`\`\`

## 🚀 사용법

### 전체 라이브러리 import

\`\`\`javascript
import { Accordion, Dialog, Logger } from 'uiuxu';
import 'uiuxu/styles';

const accordion = new Accordion({ id: 'main-acco' });
accordion.init();
\`\`\`

### 개별 컴포넌트 import (트리쉐이킹)

\`\`\`javascript
import Accordion from 'uiuxu/accordion';
import { Logger } from 'uiuxu/utils/logger';

const accordion = new Accordion({ id: 'main-acco' });
accordion.init();
\`\`\`

## 📚 컴포넌트

- **Accordion** - 접을 수 있는 아코디언
- **Dialog** - 모달 대화상자
- **ButtonSelection** - 버튼 그룹 선택
- **Dropdown** - 드롭다운 메뉴
- **Tab** - 탭 인터페이스
- **Tooltip** - 툴팁
- **RangeSlider** - 범위 슬라이더
- **TimeSelect** - 시간 선택기
- **Countdown** - 카운트다운
- **Drag** - 드래그 앤 드롭
- **Form** - 폼 컨트롤
- **ChartBubble** - 버블 차트

## 🛠️ 유틸리티

- **Logger** - 개발/프로덕션 자동 분기 로깅
- **ErrorHandler** - 7가지 커스텀 에러 타입
- **Utils** - 공통 유틸리티 함수

## 📖 문서

자세한 문서는 [GitHub](https://github.com/asever77/UIUXU)를 참고하세요.

## 📄 라이선스

MIT © asever77
\`\`\`

---

### 6단계: LICENSE 파일 생성
```

MIT License

Copyright (c) 2025 asever77

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```

---

### 7단계: .npmignore 생성

npm에 포함하지 않을 파일들을 지정합니다:

```

# .npmignore

# 소스 파일 (빌드 결과물만 배포)

src/
docs/
.vscode/

# 개발 파일

_.log
.env
.env._
vite.config.js
vite.config.lib.js

# 테스트

tests/
\*.test.js

# Git

.git/
.gitignore

# 기타

node_modules/
.DS_Store

````

---

### 8단계: 빌드 및 테스트

```bash
# 1. 라이브러리 빌드
npm run build:lib

# 출력 확인:
dist/
├── index.esm.js        # ES Module (import)
├── index.cjs           # CommonJS (require)
├── index.umd.js        # UMD (브라우저)
├── accordion.esm.js    # 개별 컴포넌트
├── dialog.esm.js
├── ...
└── uiuxu.css          # 스타일

# 2. 빌드 결과 확인
ls dist/

# 3. 로컬 테스트 (선택)
npm link
# 다른 프로젝트에서:
npm link uiuxu
````

---

### 9단계: 버전 관리

```bash
# 현재 버전 확인
npm version

# 버전 업데이트
npm version patch   # 1.0.0 → 1.0.1 (버그 수정)
npm version minor   # 1.0.0 → 1.1.0 (새 기능)
npm version major   # 1.0.0 → 2.0.0 (호환성 깨짐)
```

---

### 10단계: npm에 배포!

```bash
# 1. 최종 확인
npm run lint        # 코드 검사
npm run build:lib   # 빌드

# 2. 배포
npm publish

# 출력:
# + uiuxu@1.0.0
# ✓ Published to npm!

# 3. 배포 확인
# https://www.npmjs.com/package/uiuxu
```

---

## 🎯 배포 후 사용 방법

### 사용자 입장

```bash
# 설치
npm install uiuxu
```

```javascript
// 사용법 1: 전체 import
import { Accordion, Dialog, Logger } from 'uiuxu';
import 'uiuxu/styles';

const acco = new Accordion({ id: 'main' });
acco.init();

// 사용법 2: 개별 import (최적화)
import Accordion from 'uiuxu/accordion';
const acco = new Accordion({ id: 'main' });
acco.init();

// 사용법 3: CommonJS (Node.js)
const { Accordion } = require('uiuxu');

// 사용법 4: 브라우저 직접 사용 (CDN)
<script src="https://unpkg.com/uiuxu@1.0.0/dist/index.umd.js"></script>
<script>
  const acco = new UIUXU.Accordion({ id: 'main' });
  acco.init();
</script>
```

---

## 📊 배포 전략

### 전략 1: Monolithic Package (단일 패키지)

```bash
npm install uiuxu
```

**장점:**

- ✅ 간단한 설치
- ✅ 버전 관리 용이
- ✅ 일관된 API

**단점:**

- ❌ 번들 크기 큰 편
- ❌ 사용 안하는 컴포넌트도 포함

---

### 전략 2: Scoped Packages (개별 패키지)

```bash
npm install @uiuxu/accordion
npm install @uiuxu/dialog
npm install @uiuxu/button-selection
```

**장점:**

- ✅ 필요한 것만 설치
- ✅ 번들 크기 최소화
- ✅ 독립적 버전 관리

**단점:**

- ❌ 설치 번거로움
- ❌ 버전 호환성 관리 복잡

---

### 전략 3: 하이브리드 (추천!)

```bash
# 전체 설치
npm install uiuxu

# 그러나 트리쉐이킹으로 사용한 것만 번들링
import Accordion from 'uiuxu/accordion';  // 이것만 번들에 포함
```

**장점:**

- ✅ 간단한 설치
- ✅ 자동 최적화 (트리쉐이킹)
- ✅ 최고의 DX (개발 경험)

---

## 🔍 배포 체크리스트

### 필수 항목

- [ ] npm 계정 생성 및 로그인
- [ ] package.json의 name이 npm에 없는 고유한 이름인지 확인
- [ ] package.json의 main, module, exports 필드 설정
- [ ] vite.config.lib.js 생성 및 설정
- [ ] src/index.js 진입점 생성
- [ ] README.md 작성
- [ ] LICENSE 파일 생성
- [ ] .npmignore 생성
- [ ] npm run build:lib 성공 확인
- [ ] dist/ 폴더 내용 확인

### 권장 항목

- [ ] CHANGELOG.md 작성
- [ ] 예제 프로젝트 생성
- [ ] TypeScript 타입 정의 (.d.ts)
- [ ] 단위 테스트 작성
- [ ] CI/CD 설정 (GitHub Actions)
- [ ] 문서 사이트 구축
- [ ] 데모 페이지 배포

---

## 💡 Pro Tips

### 1. 패키지 이름 중복 확인

```bash
npm search uiuxu

# 이미 존재하면:
# - uiuxu-components
# - @asever77/uiuxu
# - uiuxu-kit
```

### 2. 로컬 테스트

```bash
# 패키지 링크 생성
npm link

# 다른 프로젝트에서 테스트
cd ../test-project
npm link uiuxu
```

### 3. 배포 전 dry-run

```bash
npm publish --dry-run

# 실제로 배포 안하고 결과만 확인
```

### 4. Beta 버전 배포

```bash
npm version 1.0.0-beta.1
npm publish --tag beta

# 사용자:
npm install uiuxu@beta
```

### 5. 자동 배포 (GitHub Actions)

```yaml
# .github/workflows/publish.yml
name: Publish to npm

on:
  push:
    tags:
      - "v*"

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          registry-url: "https://registry.npmjs.org"
      - run: npm install
      - run: npm run build:lib
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 🎉 요약

1. **준비**: npm 계정, package.json 수정
2. **빌드 설정**: vite.config.lib.js 생성
3. **진입점**: src/index.js 생성
4. **문서**: README.md, LICENSE
5. **빌드**: npm run build:lib
6. **배포**: npm publish

**결과:**

```bash
npm install uiuxu
```

이제 전 세계 개발자들이 당신의 라이브러리를 사용할 수 있습니다! 🚀

---

질문이나 도움이 필요하면 언제든 말씀해주세요! 😊
