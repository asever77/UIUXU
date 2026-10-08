# Lego-like Layer Core & Tailwind CSS Multi-Framework Implementation Plan

> **UIUXU Philosophy**: **UX** (User Experience) + **UI** (User Interface) + **U** (You: Lego-like developer & user ergonomics)  
> **Goal**: Build a headless, modular `LayerCore` engine where React/Vue pass props and HTML uses `data-*` attributes, with full Tailwind CSS compatibility across all environments.

---

## 1. 개요 및 설계 방향 (Overview & Key Concepts)

### 🧩 1.1 "레고(Lego)" 블록형 코어 구조
각 레이어(Dropdown, Tooltip, Dialog, Toast)는 **동일한 Headless Engine (`LayerCore`)** 위에서 조합됩니다.
- **Headless Engine**: 화면 스타일을 강제하지 않고 **위치 계산(Floating), Z-Index 스택, A11y(ARIA, Focus Trap), 상태(`data-ui-state`)**만 제어합니다.
- **1:1 매핑 규칙**:
  - React/Vue: Props로 전달 (`<Layer placement="bottom-start" trigger="click">`)
  - HTML: `data-*` 속성으로 전달 (`<button data-ui-layer="dropdown" data-ui-placement="bottom-start" data-ui-trigger="click">`)

### 🎨 1.2 Tailwind CSS 호환성 및 스타일링 조화 의견
> **질문**: *"HTML에서 테일윈드를 쓰면 문제가 되지 않을까?"*  
> **답변**: **전혀 문제되지 않으며, 오히려 최고의 조합입니다!**

- **이유**:
  1. **Vite 빌드 통합**: Vite 환경에서 Tailwind CSS를 통합하면, 개발 모드 및 빌드 시 하나의 `dist/uiuxu.css`로 자동 컴파일되므로 HTML, React, Vue 모두 완벽히 동일한 테일윈드 유틸리티 클래스를 사용할 수 있습니다.
  2. **Headless `data-ui-state` + Tailwind Variant 결합**:
     Tailwind CSS는 `data-[ui-state=open]:` 과 같은 attribute 기반 스타일링을 기본 지원합니다.
     - 예시 HTML:
       ```html
       <div data-ui-panel="my-dd"
            class="hidden data-[ui-state=open]:block bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-4 transition-all border border-slate-200">
         드롭다운 콘텐츠
       </div>
       ```
  3. **Preset SCSS와 Tailwind의 공존**:
     기존 SCSS 기반의 완성형 클래스(`.ui-dropdown`, `.ui-dialog`)도 유지하면서, 테일윈드로 커스텀 스타일링을 입힐 수 있는 **두 가지 트랙(Preset Theme vs Unstyled Utility)**을 모두 제공할 수 있습니다.

---

## 2. 사용자 검토 및 서명 필요 항목 (User Review Required)

> [!IMPORTANT]
> **1. HTML 파서 동작 방식 선택**
> HTML 페이지 로드 시 `document.querySelectorAll('[data-ui-layer]')`를 자동으로 파싱하여 레이어로 등록하는 **Auto-Init 엔진**을 도입합니다. (페이지 이동/동적 DOM 추가 시 `UIUXU.init()` 재호출 지원)
> 
> **2. Tailwind CSS 설치 방식**
> Vite 5 환경에 맞추어 Tailwind CSS v3 (PostCSS 기반) 또는 v4 (`@tailwindcss/vite`)를 프로젝트에 도입하여 `src/assets/css/uiuxu.css` 및 SCSS와 병행 빌드되도록 설정하고자 합니다.

---

## 3. 상세 사양 및 매핑 정의 (Specifications & Mapping)

### 3.1 Prop <-> `data-*` Attribute 1:1 매핑표

| 제어 기능 | React / Vue Prop | HTML `data-*` Attribute | 허용 값 예시 |
| :--- | :--- | :--- | :--- |
| **레이어 종류** | `type` | `data-ui-layer` | `"dropdown" \| "tooltip" \| "dialog" \| "toast"` |
| **위치 배치** | `placement` | `data-ui-placement` | `"top" \| "bottom" \| "left" \| "right" \| "bottom-start" \| "auto"` |
| **앵커 타겟** | `target` | `data-ui-target` | `"#trigger-btn"` 또는 타겟 selector |
| **실행 이벤트** | `trigger` | `data-ui-trigger` | `"click" \| "hover" \| "focus" \| "manual"` |
| **Z-Index 그룹** | `zIndexGroup` | `data-ui-z-index` | `"tooltip"(1000) \| "dropdown"(2000) \| "modal"(3000) \| "toast"(4000)` |
| **Teleport 마운트** | `teleportTo` | `data-ui-teleport` | `"body" \| "#app" \| "false"` |
| **상태 표시 (JS자동)** | `state` | `data-ui-state` | `"open" \| "closed"` (CSS/Tailwind 연동용) |

---

## 4. 변경 예정 코드 구조 (Proposed Code Changes)

```
src/
├── assets/
│   ├── js/
│   │   ├── core/
│   │   │   ├── layerCore.js        # [NEW] 레고형 Headless 코어 엔진
│   │   │   ├── layerPosition.js    # [NEW] Floating 위치 계산 유틸리티
│   │   │   ├── layerStack.js       # [NEW] Z-index 그룹 & ESC 스택 관리자
│   │   │   └── layerAutoInit.js    # [NEW] HTML data-* 속성 자동 파서
│   │   ├── component/
│   │   │   ├── dialog.js           # [MODIFY] LayerCore 기반 상속/래핑
│   │   │   ├── dropdown.js         # [MODIFY] LayerCore 기반 상속/래핑
│   │   │   ├── tooltip.js          # [MODIFY] LayerCore 기반 상속/래핑
│   │   │   └── toast.js            # [MODIFY] LayerCore 기반 상속/래핑
│   │   └── index.js                # UIUXU 통합 내보내기
│   ├── scss/                       # SCSS 테마
│   └── css/                        # Tailwind + SCSS 빌드 결과물
```

---

## 5. 단계별 실행 일정 (Phased Strategy)

### 📍 Phase 1: `LayerCore` & `LayerStack` 모듈 개발
- Pure JS 기반 레고형 Headless 엔진 (`layerCore.js`) 작성
- Floating Positioning 유틸리티 및 전역 Z-Index 스택 관리자 (`layerStack.js`) 작성

### 📍 Phase 2: HTML Auto-Parser (`data-ui-layer`) 구현
- `data-ui-layer`, `data-ui-placement`, `data-ui-trigger` 속성 자동 감지 및 인스턴스화
- 돔 바인딩 유틸리티 작성

### 📍 Phase 3: 기존 Component Refactoring
- `dropdown.js`, `dialog.js`, `tooltip.js`, `toast.js`를 `LayerCore` 인스턴스 호환으로 개편

### 📍 Phase 4: Tailwind CSS 통합 설정
- Tailwind CSS 패키지 추가 및 `vite.config.js` PostCSS/Tailwind 빌드 연동
- HTML 및 샘플 페이지에 Tailwind 유틸리티 및 `data-[ui-state=open]` 스타일 적용 예시 제공

### 📍 Phase 5: 검증 및 테스트 (HTML, React/Vue 호환성)
- 키보드 전용 탐색 (Tab, Esc), Screen Reader ARIA 검증
- HTML 페이지 테스트 (`dropdown.html`, `accordion.html` 등)

---

## 6. 검증 계획 (Verification Plan)

### 수동 검증 (Manual Verification)
1. **HTML 페이지 동적 테스트**:
   - `src/page/dropdown.html`에서 `data-ui-layer="dropdown"` 및 `data-ui-placement="bottom-end"` 적용 후 클릭 및 포커스 동작 확인
2. **Tailwind CSS 적용 테스트**:
   - `data-[ui-state=open]:block` 및 `data-[ui-state=closed]:hidden` 스타일이 정상 반응하는지 애니메이션 포함 확인
3. **Z-Index 스택 & ESC 테스트**:
   - Dropdown 위에서 Modal이 열릴 때 Modal이 3000대 Z-index로 상위에 뜨고, ESC 입력 시 Modal -> Dropdown 순으로 닫히는지 확인
