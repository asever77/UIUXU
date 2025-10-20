# 메모리 누수 방지 가이드

## 📚 개요

JavaScript에서 메모리 누수는 주로 **이벤트 리스너, 타이머, 클로저, DOM 참조**가 제대로 정리되지 않을 때 발생합니다. 이 가이드는 UIUXU 프로젝트에서 메모리 누수를 방지하는 방법을 설명합니다.

---

## 🚨 **메모리 누수가 발생하는 경우**

### 1. **이벤트 리스너 미제거**
```javascript
// ❌ Bad - 이벤트 리스너가 제거되지 않음
class MyComponent {
  init() {
    this.button = document.querySelector('.btn');
    this.button.addEventListener('click', () => {
      console.log('clicked');
    });
  }
}
// 컴포넌트가 파괴되어도 이벤트 리스너는 남아있음!
```

### 2. **타이머 미제거**
```javascript
// ❌ Bad - 타이머가 계속 실행됨
class MyComponent {
  init() {
    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }
}
// interval이 계속 실행되며 메모리를 점유
```

### 3. **DOM 참조 유지**
```javascript
// ❌ Bad - DOM이 제거되어도 참조가 남아있음
class MyComponent {
  init() {
    this.elements = document.querySelectorAll('.item');
  }
}
// DOM이 제거되어도 this.elements가 참조를 유지
```

### 4. **클로저로 인한 메모리 유지**
```javascript
// ❌ Bad - 클로저가 큰 객체를 계속 참조
function createHandler(largeData) {
  return function() {
    console.log(largeData.length); // largeData가 계속 메모리에 유지됨
  };
}
```

---

## ✅ **올바른 패턴: Destroy 메서드 구현**

### 기본 패턴

```javascript
export default class MyComponent {
  constructor(options) {
    this.options = options;
    this.element = null;
    this.listeners = []; // 이벤트 리스너 추적
    this.timers = []; // 타이머 추적
  }

  init() {
    this.element = document.querySelector(this.options.selector);
    this.#setupEventListeners();
    this.#startTimers();
  }

  #setupEventListeners() {
    // 바인딩된 함수 저장 (제거할 수 있도록)
    this.handleClick = this.#handleClick.bind(this);
    this.handleKeyDown = this.#handleKeyDown.bind(this);

    // 이벤트 리스너 등록
    this.element.addEventListener('click', this.handleClick);
    this.element.addEventListener('keydown', this.handleKeyDown);

    // 추적을 위해 저장 (선택사항)
    this.listeners.push({
      element: this.element,
      event: 'click',
      handler: this.handleClick
    });
  }

  #handleClick(e) {
    // 클릭 처리
  }

  #handleKeyDown(e) {
    // 키보드 처리
  }

  #startTimers() {
    // 타이머 시작
    this.intervalId = setInterval(() => {
      this.update();
    }, 1000);

    this.timeoutId = setTimeout(() => {
      this.initialize();
    }, 100);

    // 추적을 위해 저장
    this.timers.push(this.intervalId, this.timeoutId);
  }

  /**
   * 컴포넌트를 파괴하고 모든 리소스를 정리합니다.
   */
  destroy() {
    try {
      // 1. 이벤트 리스너 제거
      if (this.element && this.handleClick) {
        this.element.removeEventListener('click', this.handleClick);
        this.element.removeEventListener('keydown', this.handleKeyDown);
      }

      // 2. 타이머 제거
      if (this.intervalId) clearInterval(this.intervalId);
      if (this.timeoutId) clearTimeout(this.timeoutId);

      // 3. DOM 참조 제거
      this.element = null;

      // 4. 콜백/클로저 참조 제거
      this.options.callback = null;

      // 5. 배열/컬렉션 정리
      this.listeners = [];
      this.timers = [];

      logger.info('MyComponent destroyed successfully', null, 'MyComponent');
      
    } catch (error) {
      logger.error('Destroy failed', error, 'MyComponent');
    }
  }
}
```

---

## 🎯 **실전 예제: Accordion**

### Accordion의 destroy 구현

```javascript
export default class Accordion {
  constructor(opt) {
    // ... 초기화 코드
    this.handleToggle = this.#handleToggle.bind(this);
  }

  init() {
    this.#initializeAccordionItems();
  }

  #initializeAccordionItems() {
    this.#acco_btns.forEach(button => {
      button.addEventListener('click', this.handleToggle);
    });
  }

  /**
   * Accordion 파괴 및 리소스 정리
   */
  destroy() {
    try {
      // 1. 이벤트 리스너 제거
      if (this.#acco_btns) {
        this.#acco_btns.forEach(button => {
          button.removeEventListener('click', this.handleToggle);
        });
      }

      // 2. 다른 컴포넌트 정리
      if (this.#arrowNavigator?.destroy) {
        this.#arrowNavigator.destroy();
      }

      // 3. 참조 제거
      this.#acco = null;
      this.#acco_items = null;
      this.#acco_btns = null;
      this.#arrowNavigator = null;

      logger.info(`Accordion "${this.#id}" destroyed`, null, 'Accordion');
      
    } catch (error) {
      logger.error('Accordion destroy failed', error, 'Accordion');
    }
  }
}
```

### 사용 예시

```javascript
// 컴포넌트 생성 및 초기화
UI.exe.acco = new UX.Accordion({ id: 'main-acco' });
UI.exe.acco.init();

// 페이지 전환 또는 컴포넌트 제거 시
UI.exe.acco.destroy();
UI.exe.acco = null; // 참조도 제거
```

---

## 🔍 **이벤트 리스너 패턴**

### 패턴 1: 바인딩 함수 저장
```javascript
class MyComponent {
  constructor() {
    // 바인딩된 함수를 저장하여 제거 가능하게 만듦
    this.handleClick = this.#handleClick.bind(this);
  }

  init() {
    this.button.addEventListener('click', this.handleClick);
  }

  #handleClick(e) {
    // 이벤트 처리
  }

  destroy() {
    // 동일한 함수 참조로 제거 가능
    this.button.removeEventListener('click', this.handleClick);
  }
}
```

### 패턴 2: AbortController 사용 (모던 방식)
```javascript
class MyComponent {
  constructor() {
    this.controller = new AbortController();
  }

  init() {
    // signal 옵션으로 이벤트 등록
    this.button.addEventListener('click', this.handleClick, {
      signal: this.controller.signal
    });

    this.button.addEventListener('keydown', this.handleKeyDown, {
      signal: this.controller.signal
    });
  }

  destroy() {
    // 한 번에 모든 이벤트 제거!
    this.controller.abort();
  }
}
```

### 패턴 3: 이벤트 위임 (Delegation)
```javascript
class MyComponent {
  init() {
    // 부모 요소에 하나의 이벤트만 등록
    this.container = document.querySelector('.container');
    this.handleClick = this.#handleClick.bind(this);
    this.container.addEventListener('click', this.handleClick);
  }

  #handleClick(e) {
    // 실제 클릭된 요소 확인
    const button = e.target.closest('.btn');
    if (button) {
      // 버튼 클릭 처리
    }
  }

  destroy() {
    // 하나만 제거하면 됨
    this.container.removeEventListener('click', this.handleClick);
  }
}
```

---

## ⏱️ **타이머 관리**

### 패턴: 타이머 추적 및 정리

```javascript
class MyComponent {
  constructor() {
    this.timers = {
      intervals: [],
      timeouts: []
    };
  }

  startPolling() {
    const intervalId = setInterval(() => {
      this.poll();
    }, 5000);
    
    this.timers.intervals.push(intervalId);
  }

  delayedInit() {
    const timeoutId = setTimeout(() => {
      this.initialize();
    }, 1000);
    
    this.timers.timeouts.push(timeoutId);
  }

  destroy() {
    // 모든 interval 제거
    this.timers.intervals.forEach(id => clearInterval(id));
    this.timers.intervals = [];

    // 모든 timeout 제거
    this.timers.timeouts.forEach(id => clearTimeout(id));
    this.timers.timeouts = [];
  }
}
```

---

## 🗺️ **WeakMap/WeakSet 활용**

DOM 요소와 데이터를 연결할 때 사용하면 자동으로 가비지 컬렉션됩니다.

```javascript
// 일반 Map (메모리 누수 가능)
const regularMap = new Map();
const element = document.querySelector('.item');
regularMap.set(element, { data: 'some data' });
// element가 DOM에서 제거되어도 Map에 남아있음

// WeakMap (자동 정리)
const weakMap = new WeakMap();
const element2 = document.querySelector('.item2');
weakMap.set(element2, { data: 'some data' });
// element2가 DOM에서 제거되면 자동으로 WeakMap에서도 제거됨
```

### 실전 활용

```javascript
class ComponentManager {
  constructor() {
    // WeakMap으로 DOM 요소와 컴포넌트 인스턴스 연결
    this.instances = new WeakMap();
  }

  register(element, component) {
    this.instances.set(element, component);
  }

  get(element) {
    return this.instances.get(element);
  }

  // destroy 메서드 불필요 - 자동으로 정리됨
}
```

---

## 📊 **메모리 프로파일링**

### Chrome DevTools로 메모리 누수 확인

1. **Chrome DevTools 열기** (F12)
2. **Performance 탭** 또는 **Memory 탭** 선택
3. **Heap snapshot** 촬영

```javascript
// 테스트 코드
for (let i = 0; i < 100; i++) {
  const acco = new Accordion({ id: `acco-${i}` });
  acco.init();
  // acco.destroy(); // 이 줄을 주석 처리하고 메모리 확인
}
```

### 메모리 누수 체크리스트

- [ ] 모든 `addEventListener`에 대응하는 `removeEventListener`가 있는가?
- [ ] 모든 `setInterval`/`setTimeout`이 정리되는가?
- [ ] DOM 참조가 `destroy`에서 `null`로 설정되는가?
- [ ] 콜백 함수 참조가 정리되는가?
- [ ] WeakMap/WeakSet을 사용할 수 있는 경우가 있는가?

---

## ✅ **베스트 프랙티스**

### 1. **항상 destroy 메서드 구현**
```javascript
export default class MyComponent {
  destroy() {
    // 리소스 정리
  }
}
```

### 2. **바인딩 함수는 constructor에서 한 번만**
```javascript
constructor() {
  // ✅ Good - 한 번만 바인딩
  this.handleClick = this.#handleClick.bind(this);
}

init() {
  // ❌ Bad - 매번 새로운 함수 생성
  this.button.addEventListener('click', this.handleClick.bind(this));
}
```

### 3. **이벤트 위임 활용**
```javascript
// ✅ Good - 하나의 이벤트 리스너로 여러 요소 처리
container.addEventListener('click', (e) => {
  if (e.target.matches('.btn')) {
    // 처리
  }
});
```

### 4. **AbortController 사용 (최신 브라우저)**
```javascript
constructor() {
  this.controller = new AbortController();
}

init() {
  element.addEventListener('click', handler, {
    signal: this.controller.signal
  });
}

destroy() {
  this.controller.abort(); // 한 번에 모두 제거
}
```

### 5. **명확한 생명주기 관리**
```javascript
class MyComponent {
  init() { /* 초기화 */ }
  update() { /* 업데이트 */ }
  destroy() { /* 정리 */ }
}
```

---

## 🎓 **실전 시나리오**

### 시나리오 1: SPA (Single Page Application)
```javascript
// 페이지 전환 시
function navigateToPage(newPage) {
  // 1. 현재 페이지 컴포넌트 정리
  if (currentPage.components) {
    currentPage.components.forEach(component => {
      component.destroy();
    });
  }

  // 2. 새 페이지 로드
  loadPage(newPage);
}
```

### 시나리오 2: 동적 컴포넌트 생성/제거
```javascript
class ComponentFactory {
  constructor() {
    this.activeComponents = [];
  }

  create(type, options) {
    const component = new ComponentTypes[type](options);
    component.init();
    this.activeComponents.push(component);
    return component;
  }

  remove(component) {
    component.destroy();
    const index = this.activeComponents.indexOf(component);
    if (index > -1) {
      this.activeComponents.splice(index, 1);
    }
  }

  removeAll() {
    this.activeComponents.forEach(component => component.destroy());
    this.activeComponents = [];
  }
}
```

---

## 📝 **변경 이력**

- **2024-10-17**: 메모리 관리 가이드 최초 작성
- Accordion, ButtonSelection에 destroy 메서드 추가
- 이벤트 리스너 패턴 문서화
