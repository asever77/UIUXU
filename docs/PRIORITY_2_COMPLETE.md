# 🎯 우선순위 2번 완료: 에러 처리 표준화

## ✅ 완료된 작업

### 1. 새로 생성된 파일
- ✨ **`src/assets/js/utils/errors.js`** - 커스텀 에러 클래스 및 ErrorHandler (338줄)
- 📚 **`src/assets/js/utils/README_ERRORS.md`** - 에러 처리 가이드 (완벽한 문서화)

### 2. 수정된 파일 (4개)

#### A. `accordion.js`
- ✅ ErrorHandler import 추가
- ✅ constructor에 필수 파라미터 검증 추가
- ✅ DOM 요소 존재 검증 강화
- ✅ #show 메서드에 ElementNotFoundError 적용

#### B. `buttonSelection.js`
- ✅ ErrorHandler import 추가
- ✅ 필수 파라미터 검증으로 대체
- ✅ DOM 요소 검증 강화

#### C. `dialog.js`
- ✅ ErrorHandler import 추가
- ✅ buildDialog에 DOM 요소 검증 적용

#### D. `uiuxu.common.js`
- ✅ setupGlobalErrorHandler import 및 실행
- ✅ 전역 에러 핸들러 자동 설정

---

## 🎁 개선 효과

### 1. **체계적인 에러 분류**

**Before (기존):**
```javascript
if (!element) {
  console.error('Element not found');
  return;
}
```

**After (개선 후):**
```javascript
try {
  ErrorHandler.requireElement(element, selector, 'ComponentName');
} catch (error) {
  ErrorHandler.handle(error, 'ComponentName');
  return;
}
```

**장점:**
- ✅ 에러 타입별 명확한 구분
- ✅ 풍부한 컨텍스트 정보
- ✅ 일관된 에러 처리

---

### 2. **7가지 커스텀 에러 클래스**

| 에러 클래스 | 용도 | 사용 시점 |
|------------|------|-----------|
| **UIError** | 기본 에러 | 모든 커스텀 에러의 부모 |
| **ValidationError** | 유효성 검사 실패 | 필수 파라미터 없음, 잘못된 값 |
| **ElementNotFoundError** | DOM 요소 없음 | querySelector 실패 |
| **NetworkError** | 네트워크 실패 | fetch, AJAX 오류 |
| **InitializationError** | 초기화 실패 | 컴포넌트 초기화 실패 |
| **ConfigurationError** | 설정 오류 | 잘못된 옵션 조합 |
| **StateError** | 상태 오류 | 잘못된 상태 전환 |
| **TypeMismatchError** | 타입 불일치 | 예상과 다른 타입 |

---

### 3. **ErrorHandler 헬퍼 메서드**

#### 🔍 **requireParams** - 필수 파라미터 검증
```javascript
// Before
if (!options.id) {
  console.error('ID is required');
  return;
}

// After
ErrorHandler.requireParams(options, ['id'], 'ComponentName');
```

#### 🔍 **requireElement** - DOM 요소 검증
```javascript
// Before
const element = document.querySelector('.my-element');
if (!element) {
  console.error('Element not found');
  return;
}

// After
const element = document.querySelector('.my-element');
ErrorHandler.requireElement(element, '.my-element', 'ComponentName');
```

#### 🔍 **requireType** - 타입 검증
```javascript
// Before
if (typeof callback !== 'function') {
  console.error('callback must be a function');
  return;
}

// After
ErrorHandler.requireType(callback, 'function', 'callback');
```

#### 🔍 **validate** - 조건 검증
```javascript
// Before
if (items.length === 0) {
  console.error('At least one item is required');
  return;
}

// After
ErrorHandler.validate(
  items.length > 0,
  '최소 1개 이상의 아이템이 필요합니다',
  { itemCount: items.length }
);
```

---

### 4. **전역 에러 핸들러**

자동으로 다음 에러를 캐치합니다:

```javascript
// 처리되지 않은 에러
window.addEventListener('error', ...);

// 처리되지 않은 Promise rejection
window.addEventListener('unhandledrejection', ...);
```

**효과:**
- ✅ 놓친 에러 자동 포착
- ✅ 모든 에러 로그 기록
- ✅ 디버깅 용이성 향상

---

## 📊 실전 사용 예시

### 예시 1: 컴포넌트 초기화

```javascript
import { ErrorHandler } from '../utils/errors.js';

export default class MyComponent {
  constructor(options) {
    try {
      // 1. 필수 파라미터 검증
      ErrorHandler.requireParams(options, ['id', 'element'], 'MyComponent');
      
      // 2. 타입 검증
      ErrorHandler.requireType(options.callback, 'function', 'callback');
      
      // 3. DOM 요소 검증
      const element = document.querySelector(options.element);
      ErrorHandler.requireElement(element, options.element, 'MyComponent');
      
      // 4. 조건 검증
      ErrorHandler.validate(
        options.items.length > 0,
        '최소 1개 이상의 아이템이 필요합니다',
        { itemCount: options.items.length }
      );
      
      this.element = element;
      this.options = options;
      
    } catch (error) {
      ErrorHandler.handle(error, 'MyComponent');
      return;
    }
  }
}
```

### 예시 2: 네트워크 요청

```javascript
import { ErrorHandler, NetworkError } from '../utils/errors.js';

async loadData(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new NetworkError('데이터 로드 실패', {
        url: url,
        status: response.status
      });
    }
    
    return await response.json();
    
  } catch (error) {
    ErrorHandler.handle(error, 'MyComponent', {
      fallback: () => this.getCachedData()
    });
  }
}
```

### 예시 3: 상태 관리

```javascript
import { StateError } from '../utils/errors.js';

toggle() {
  if (this.#isAnimating) {
    throw new StateError('애니메이션 진행 중', {
      currentState: 'animating',
      attemptedAction: 'toggle'
    });
  }
  
  this.#isAnimating = true;
  // 토글 로직...
}
```

---

## 🎯 에러 정보 구조

모든 커스텀 에러는 다음 정보를 포함합니다:

```javascript
{
  name: 'ValidationError',           // 에러 타입
  message: 'ID는 필수입니다',         // 에러 메시지
  context: {                         // 컨텍스트 정보
    component: 'Accordion',
    received: undefined,
    expectedType: 'string'
  },
  timestamp: '2024-10-17T12:34:56.789Z',  // 발생 시각
  stack: '...'                       // 스택 트레이스
}
```

---

## 📈 통계

- ✅ **생성된 파일**: 2개
- ✅ **수정된 파일**: 4개
- ✅ **커스텀 에러 클래스**: 7종
- ✅ **ErrorHandler 메서드**: 6개
- ✅ **전역 에러 핸들러**: 2개 (error, unhandledrejection)
- ✅ **문서화**: 완벽한 가이드 제공

---

## 🎓 학습 포인트

### 1. **왜 커스텀 에러 클래스가 필요한가?**

**문제점:**
```javascript
// 모든 에러가 동일하게 처리됨
catch (error) {
  console.error(error.message);
}
```

**해결:**
```javascript
// 에러 타입에 따라 다르게 처리 가능
catch (error) {
  if (error instanceof NetworkError) {
    // 네트워크 재시도
  } else if (error instanceof ValidationError) {
    // 사용자에게 입력 오류 알림
  }
}
```

### 2. **컨텍스트 정보의 중요성**

**Before:**
```javascript
throw new Error('요소를 찾을 수 없습니다');
// 어떤 요소? 어디서? 왜?
```

**After:**
```javascript
throw new ElementNotFoundError('요소를 찾을 수 없습니다', {
  selector: '.my-element',
  component: 'Accordion',
  searchContext: 'initialization'
});
// 모든 정보가 명확함!
```

### 3. **에러 처리 vs 에러 무시**

```javascript
// ❌ Bad - 에러를 조용히 무시
try {
  doSomething();
} catch (error) {
  // 아무것도 안 함
}

// ✅ Good - 에러를 처리
try {
  doSomething();
} catch (error) {
  ErrorHandler.handle(error, 'MyComponent');
}

// ✅ Better - 대체 동작 제공
try {
  doSomething();
} catch (error) {
  ErrorHandler.handle(error, 'MyComponent', {
    fallback: () => doSomethingElse()
  });
}
```

---

## 🚀 다음 단계

**우선순위 3번: 메모리 누수 방지**

### 계획된 작업:
1. 🧹 이벤트 리스너 정리 (destroy 메서드)
2. 🔄 리소스 해제 패턴 구현
3. 📦 WeakMap/WeakSet 활용
4. 🎯 메모리 프로파일링 가이드

진행하시겠습니까?
