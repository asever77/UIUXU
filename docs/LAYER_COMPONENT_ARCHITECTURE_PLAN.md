# UIUXU : Unified LayerComponent & Cross-Framework Architecture Plan

> **UIUXU Philosophy**: **UX** (User Experience) + **UI** (User Interface) + **U** (You: Personalized Developer & User Ergonomics)  
> **Mission**: Build a unified, high-performance, WCAG-compliant Layer system usable across **React, Vue 3, and Vanilla HTML/JS**.

---

## 1. 개요 및 비전 (Overview & Vision)

현재 UIUXU 라이브러리에 존재하는 `Dialog`, `Dropdown`, `Tooltip`, `Toast` 컴포넌트는 개별적으로 DOM 제어 및 포커스, z-index를 관리하고 있습니다.  
이를 하나로 통합하는 **`LayerComponent` (통합 레이어 코어 엔진)**를 구축하고, **Cross-Framework (React / Vue / Vanilla HTML)** 지원 체계로 개편합니다.

```
                  ┌─────────────────────────────────────────┐
                  │          UIUXU Headless Core            │
                  │   - Layer Core Engine                   │
                  │   - Layer Stack & Z-Index Manager       │
                  │   - Positioning & Placement Matrix      │
                  │   - WCAG A11y & Focus Trap Engine       │
                  └────────────────────┬────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│  @uiuxu/vanilla  │          │   @uiuxu/react   │          │    @uiuxu/vue    │
│  (HTML data-*)   │          │  (React Hooks)   │          │ (Vue Composables)│
└──────────────────┘          └──────────────────┘          └──────────────────┘
```

---

## 2. 통합 `LayerComponent` 아키텍처 설계

### 2.1 4대 레이어 요소 통합 매트릭스 (Matrix)

| 구분 | Dialog / Modal | Dropdown | Tooltip | Toast |
| :--- | :--- | :--- | :--- | :--- |
| **기본 Z-Index Group** | `Group 3000` | `Group 2000` | `Group 1000` | `Group 4000` |
| **위치 계산 (Positioning)** | Center / BottomSheet / Full | Target relative (tl, bl, auto) | Target relative (top, bottom, side) | Fixed Container (top-right, bottom-center) |
| **생성 위치 (Teleport)** | `document.body` 또는 지정 Target | Trigger 부모 또는 Teleport Container | Trigger 부모 또는 Teleport Container | Global Toast Stack Area |
| **실행 이벤트 (Triggers)** | Click, Programmatic API | Click, Focus, Programmatic | Hover, Focus, Programmatic | Programmatic API, Timer |
| **A11y ARIA Role** | `dialog`, `alertdialog` | `menu`, `listbox` | `tooltip` | `status`, `alert` |
| **Focus Management** | Focus Trap 필수, Esc 닫기 | Outside Click 닫기, Arrow key 이동 | Non-modal, Focus 연동 | Screen Reader `aria-live` |

---

### 2.2 핵심 속성 및 콤포지션 설정 (Configuration Props)

```typescript
interface LayerConfig {
  // 1. 레이어 타입
  type: 'modal' | 'system' | 'dropdown' | 'tooltip' | 'toast';

  // 2. 위치 (Placement)
  placement?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'bottom-end' | 'auto';
  target?: HTMLElement | string | null; // Dropdown / Tooltip의 앵커 요소

  // 3. 생성 위치 (Teleport Node)
  teleportTo?: string | HTMLElement | false; // default: 'body'

  // 4. Z-Index 그룹 및 스택 관리
  zIndexGroup?: 'tooltip' | 'dropdown' | 'modal' | 'toast' | number; // 1000, 2000, 3000, 4000
  
  // 5. 트리거 및 이벤트
  trigger?: 'click' | 'hover' | 'focus' | 'manual';
  closeOnOutsideClick?: boolean;
  closeOnEsc?: boolean;

  // 6. 접근성 (A11y)
  role?: string;
  focusTrap?: boolean;
  returnFocus?: boolean;

  // 7. 생명주기 콜백
  onOpen?: () => void;
  onClose?: () => void;
}
```

---

### 2.3 Z-Index Stack Manager (전역 레이어 계층 관리자)

여러 개의 모달, 드롭다운, 토스트가 동시에 열릴 때 z-index 충돌을 방지하는 전역 싱글톤 관리자:

- **Group Base Z-Index**:
  - `Tooltip`: 1000 ~ 1999
  - `Dropdown`: 2000 ~ 2999
  - `Dialog / Modal`: 3000 ~ 3999
  - `Toast`: 4000 ~ 4999
- **Dynamic Active Index**: 각 그룹 내에서 활성화된 수에 따라 `baseZIndex + stackCount` 자동 계산.
- **ESC Key Handler Stack**: 가장 상위에 열린 레이어(Highest Z-Index Layer)부터 순차적으로 ESC 입력 시 Close 처리.

---

## 3. 프레임워크 공유 공용화 전략 (React / Vue / HTML)

### 3.1 왜 Headless Core + Adapter 패턴인가?
- **Web Components (Custom Elements)**는 Shadow DOM 스타일 캡슐화로 인해 SCSS 전역 테마 적용이 어렵고, SSR(Next.js, Nuxt)에서 환경 차이가 존재할 수 있습니다.
- **Headless Core Pattern** (Radix, Floating UI, Zag.js 방식)을 채택하면:
  1. **Core JS**: Pure JavaScript로 비즈니스 로직, 상태, A11y, Z-index 스택 관리.
  2. **HTML / Vanilla JS**: `data-ui-layer` 속성을 통해 브라우저에서 자동 바인딩.
  3. **React Wrapper**: `useLayer` 훅과 JSX 컴포넌트 제공.
  4. **Vue Wrapper**: `useLayer` Vue Composable과 Vue 컴포넌트 (`<Teleport>` 및 Slot 지원) 제공.

---

## 4. 단계별 실행 계획 (Action Plan)

### 📍 Step 1: Headless Layer Engine & Z-Index Manager 구축
- `src/assets/js/core/layerCore.js`: 위치 계산, 이벤트 바인딩, Focus Trap, ARIA 매핑 전용 엔진 구현.
- `src/assets/js/core/layerStack.js`: 전역 Z-Index 스택 및 ESC 키 이벤트 관리자 구현.

### 📍 Step 2: `LayerComponent` 베이스 구현 및 기존 컴포넌트 리팩토링
- 기존 `dialog.js`, `dropdown.js`, `tooltip.js`, `toast.js`를 `LayerComponent` 베이스 상속 또는 래핑 구조로 개편.
- 위치(Placement), 생성 위치(Teleport), Z-Index 그룹, 이벤트 트리거 4가지 축의 모듈화 완료.

### 📍 Step 3: Vanilla HTML Auto-Binding (`data-ui-layer`) 구현
- HTML 사용자를 위해 `data-ui-layer="dropdown"` 또는 `data-ui-layer="dialog"` 태그 선언만으로 자바스크립트가 자동 파싱하여 동작하도록 구현.
- `accordion.html`, `tab.html` 등 기존 샘플 페이지 적용 검증.

### 📍 Step 4: React 및 Vue 3 어댑터 패키지 설계
- React 컴포넌트 (`@uiuxu/react`) 래퍼 구축 (React Portal & Context 활용).
- Vue 3 컴포넌트 (`@uiuxu/vue`) 래퍼 구축 (Vue Composables & `<Teleport>` 활용).

### 📍 Step 5: 웹 접근성(WCAG / WAI-ARIA) 검증 및 문서화
- Screen Reader (NVDA, SenseReader) 호환성 체크.
- 키보드 전용 탐색 (Tab, Shift+Tab, Esc, Enter, Space) 검증.
- `docs/LAYER_COMPONENT_GUIDE.md` 가이드 작성.

---

## 5. UIUXU 브랜드 철학 담기

> **"UIUXU는 사용자 경험(UX), 인터페이스(UI), 그리고 개발자 및 사용자 자신(U)의 조화를 의미합니다."**

1. **U (User-Centric A11y)**: 장애 유무에 상관없이 누구나 자유롭게 탐색할 수 있는 완전한 접근성 표준 준수.
2. **UX (Seamless Interactivity)**: 반응 속도 0.1초 미만의 매끄러운 위치 배치(Floating)와 시각적 애니메이션.
3. **UI (Harmonious Visual Systems)**: 다크모드, 글래스모피즘, 정교한 z-index 시각 계층 구조.
4. **Developer Ergonomics (U)**: React, Vue, Vanilla HTML 어디서든 동일한 사용 경험을 제공하는 직관적인 API 디자인.
