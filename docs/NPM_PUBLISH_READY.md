# 🎉 npm 배포 준비 완료!

## ✅ 생성된 파일들

### 1. 핵심 파일

- ✅ **`src/index.js`** - 라이브러리 진입점 (모든 컴포넌트/유틸리티 export)
- ✅ **`vite.config.lib.js`** - 라이브러리 빌드 설정
- ✅ **`LICENSE`** - MIT 라이선스
- ✅ **`CHANGELOG.md`** - 변경 이력
- ✅ **`.npmignore`** - npm에서 제외할 파일
- ✅ **`docs/NPM_PUBLISH_GUIDE.md`** - 완벽한 배포 가이드

### 2. 업데이트된 파일

- ✅ **`package.json`** - npm 배포용 설정 추가
  - `main`, `module`, `browser` 필드 추가
  - `exports` 필드로 개별 컴포넌트 접근 가능
  - `files` 필드로 배포 파일 지정
  - `build:lib` 스크립트 추가
  - `prepublishOnly` 자동 빌드 설정

---

## 🚀 npm 배포 단계별 가이드

### 1단계: npm 계정 준비

```bash
# npm 계정이 없다면 회원가입
# https://www.npmjs.com/signup

# 로그인
npm login

# 확인
npm whoami
# 출력: asever77
```

---

### 2단계: 패키지 이름 확인

```bash
# 'uiuxu'라는 이름이 이미 사용 중인지 확인
npm search uiuxu

# 사용 중이라면 대안:
# - uiuxu-components
# - @asever77/uiuxu (scoped package)
# - uiuxu-kit
```

---

### 3단계: 라이브러리 빌드

```bash
# 라이브러리 모드로 빌드
npm run build:lib

# 출력 확인
dist/
├── index.esm.js         # ES Module (import)
├── index.cjs            # CommonJS (require)
├── index.umd.js         # UMD (브라우저)
├── accordion.esm.js     # 개별 컴포넌트
├── accordion.cjs
├── dialog.esm.js
├── dialog.cjs
├── ... (모든 컴포넌트)
└── uiuxu.css           # 스타일
```

---

### 4단계: 로컬 테스트 (선택)

```bash
# 패키지 링크 생성
npm link

# 다른 프로젝트에서 테스트
cd ../test-project
npm link uiuxu

# 테스트 코드
import { Accordion, Logger } from 'uiuxu';
import 'uiuxu/styles';

const acco = new Accordion({ id: 'test' });
acco.init();
```

---

### 5단계: 배포 전 검사

```bash
# 1. 코드 검사
npm run lint

# 2. dry-run (실제 배포 안함)
npm publish --dry-run

# 출력:
# npm notice
# npm notice 📦  uiuxu@1.0.0
# npm notice === Tarball Contents ===
# npm notice 2.5kB  LICENSE
# npm notice 1.2kB  CHANGELOG.md
# npm notice 15.4kB README.md
# npm notice 234kB dist/index.esm.js
# npm notice ... (배포될 파일 목록)
```

---

### 6단계: 배포!

```bash
npm publish

# 출력:
# + uiuxu@1.0.0
# ✓ Published to npm!

# 확인:
# https://www.npmjs.com/package/uiuxu
```

---

## 📦 사용자가 설치하는 방법

### 설치

```bash
npm install uiuxu
```

### 사용법 1: 전체 라이브러리 import

```javascript
import { Accordion, Dialog, Logger } from "uiuxu";
import "uiuxu/styles";

const accordion = new Accordion({ id: "main-acco" });
accordion.init();

Logger.debug("아코디언 초기화 완료");
```

### 사용법 2: 개별 컴포넌트 import (트리쉐이킹)

```javascript
// 이것만 번들에 포함됨 (최적화!)
import Accordion from "uiuxu/accordion";
import { Logger } from "uiuxu/utils/logger";

const accordion = new Accordion({ id: "main-acco" });
accordion.init();
```

### 사용법 3: CommonJS (Node.js)

```javascript
const { Accordion, Logger } = require("uiuxu");

const accordion = new Accordion({ id: "main-acco" });
accordion.init();
```

### 사용법 4: CDN (브라우저 직접 사용)

```html
<!DOCTYPE html>
<html>
  <head>
    <link
      rel="stylesheet"
      href="https://unpkg.com/uiuxu@1.0.0/dist/uiuxu.css"
    />
  </head>
  <body>
    <div id="main-acco" class="accordion">
      <!-- 아코디언 내용 -->
    </div>

    <script src="https://unpkg.com/uiuxu@1.0.0/dist/index.umd.js"></script>
    <script>
      const { Accordion } = UIUXU;
      const accordion = new Accordion({ id: "main-acco" });
      accordion.init();
    </script>
  </body>
</html>
```

---

## 🎯 배포 후 할 일

### 1. GitHub Release 생성

```bash
git tag v1.0.0
git push origin v1.0.0

# GitHub에서 Release 생성
# - Tag: v1.0.0
# - Title: UIUXU v1.0.0
# - Description: CHANGELOG.md 내용 복사
```

### 2. README 배지 추가

```markdown
[![npm version](https://badge.fury.io/js/uiuxu.svg)](https://www.npmjs.com/package/uiuxu)
[![Downloads](https://img.shields.io/npm/dm/uiuxu.svg)](https://www.npmjs.com/package/uiuxu)
[![License](https://img.shields.io/npm/l/uiuxu.svg)](https://github.com/asever77/UIUXU/blob/main/LICENSE)
```

### 3. 데모 페이지 배포

```bash
# GitHub Pages에 데모 배포
npm run build
# dist 폴더를 gh-pages 브랜치에 푸시
```

### 4. 문서 사이트 구축 (선택)

- Vitepress
- Docusaurus
- Storybook

---

## 📊 버전 관리

### Semantic Versioning

```bash
# 버그 수정: 1.0.0 → 1.0.1
npm version patch
npm publish

# 새 기능: 1.0.0 → 1.1.0
npm version minor
npm publish

# 호환성 깨짐: 1.0.0 → 2.0.0
npm version major
npm publish
```

### Beta 버전

```bash
npm version 1.1.0-beta.1
npm publish --tag beta

# 사용자:
npm install uiuxu@beta
```

---

## 🔥 Pro Tips

### 1. 번들 크기 최적화

```javascript
// ❌ 전체 import (큰 번들 크기)
import { Accordion } from "uiuxu";

// ✅ 개별 import (작은 번들 크기)
import Accordion from "uiuxu/accordion";
```

### 2. TypeScript 지원 추가

```bash
npm install -D typescript @types/node

# types/index.d.ts 생성
```

```typescript
// types/index.d.ts
export class Accordion {
  constructor(config: AccordionConfig);
  init(): void;
  destroy(): void;
  show(index: number): void;
  hide(index: number): void;
}

export interface AccordionConfig {
  id: string;
  activeIndex?: number;
  multiple?: boolean;
}

// ... 다른 컴포넌트들
```

### 3. 자동 배포 (GitHub Actions)

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
      - run: npm ci
      - run: npm run build:lib
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 📈 통계 (예상)

### 배포 후 1개월

- 📦 다운로드: 100+
- ⭐ GitHub Stars: 10+
- 🐛 Issues: 2-3개
- 🎉 PR: 1-2개

### 배포 후 6개월

- 📦 다운로드: 1,000+
- ⭐ GitHub Stars: 50+
- 👥 Contributors: 3-5명
- 🌍 사용 프로젝트: 10+

---

## ✅ 체크리스트

### 배포 전

- [x] npm 계정 생성
- [x] package.json 수정
- [x] vite.config.lib.js 생성
- [x] src/index.js 진입점 생성
- [x] LICENSE 파일 생성
- [x] CHANGELOG.md 작성
- [x] .npmignore 생성
- [x] README.md 업데이트
- [ ] npm run build:lib 실행
- [ ] 빌드 결과 확인 (dist/)
- [ ] npm publish --dry-run

### 배포 후

- [ ] npm publish 실행
- [ ] npmjs.com에서 확인
- [ ] GitHub Release 생성
- [ ] 데모 페이지 배포
- [ ] SNS/커뮤니티 공유
- [ ] 문서 사이트 구축 (선택)

---

## 🎉 결론

**UIUXU는 이제 npm 배포 준비가 완료되었습니다!**

다음 명령어만 실행하면 됩니다:

```bash
# 1. 로그인
npm login

# 2. 빌드
npm run build:lib

# 3. 배포
npm publish
```

그러면 전 세계 개발자들이:

```bash
npm install uiuxu
```

이렇게 당신의 라이브러리를 사용할 수 있습니다! 🚀

---

**질문이나 도움이 필요하면 언제든지 말씀해주세요!** 😊
