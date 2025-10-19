# 에러 처리 가이드

## 📚 개요

UIUXU 프로젝트의 표준화된 에러 처리 시스템입니다. 일관된 에러 처리를 통해 디버깅을 쉽게 하고, 사용자에게 더 나은 경험을 제공합니다.

---

## 🎯 에러 타입

### 1. **ValidationError** - 유효성 검사 실패
**언제 사용하나요?**
- 필수 파라미터가 없을 때
- 잘못된 값이 전달되었을 때
- 옵션 검증 실패 시

**예시:**
```javascript
import { ValidationError, ErrorHandler } from '../utils/errors.js';

// 방법 1: 직접 throw
if (!options.id) {
  throw new ValidationError('ID는 필수입니다', { 
    received: options.id,
    component: 'MyComponent'
  });
}

// 방법 2: ErrorHandler 사용 (권장)
ErrorHandler.requireParams(options, ['id', 'type'], 'MyComponent');
```

---

### 2. **ElementNotFoundError** - DOM 요소를 찾을 수 없음
**언제 사용하나요?**
- `querySelector`로 요소를 찾지 못했을 때
- 필수 DOM 요소가 없을 때

**예시:**
```javascript
import { ElementNotFoundError, ErrorHandler } from '../utils/errors.js';

// 방법 1: 직접 throw
const element = document.querySelector('.my-element');
if (!element) {
  throw new ElementNotFoundError('요소를 찾을 수 없습니다', {
    selector: '.my-element'
  });
}

// 방법 2: ErrorHandler 사용 (권장)
const element = document.querySelector('.my-element');
ErrorHandler.requireElement(element, '.my-element', 'MyComponent');
```

---

### 3. **NetworkError** - 네트워크 요청 실패
**언제 사용하나요?**
- fetch 실패 시
- AJAX 요청 실패 시
- 파일 로딩 실패 시

**예시:**
```javascript
import { NetworkError } from '../utils/errors.js';

fetch('/api/data')
  .then(response => {
    if (!response.ok) {
      throw new NetworkError('데이터 로드 실패', {
        url: '/api/data',
        status: response.status,
        statusText: response.statusText
      });
    }
    return response.json();
  })
  .catch(error => {
    ErrorHandler.handle(error, 'MyComponent');
  });
```

---

### 4. **StateError** - 잘못된 상태
**언제 사용하나요?**
- 애니메이션 진행 중 중복 실행 방지
- 초기화되지 않은 컴포넌트 사용 시
- 잘못된 상태 전환 시

**예시:**
```javascript
import { StateError } from '../utils/errors.js';

toggle() {
  if (this.#isAnimating) {
    throw new StateError('애니메이션 진행 중입니다', {
      currentState: 'animating',
      attemptedAction: 'toggle'
    });
  }
  
  this.#isAnimating = true;
  // 애니메이션 로직...
}
```

---

### 5. **TypeMismatchError** - 타입 불일치
**언제 사용하나요?**
- 콜백이 함수가 아닐 때
- 배열이 아닌 값이 전달되었을 때
- 숫자가 필요한데 문자열이 전달되었을 때

**예시:**
```javascript
import { TypeMismatchError, ErrorHandler } from '../utils/errors.js';

// 방법 1: 직접 throw
if (typeof callback !== 'function') {
  throw new TypeMismatchError('callback은 함수여야 합니다', {
    expected: 'function',
    received: typeof callback
  });
}

// 방법 2: ErrorHandler 사용 (권장)
ErrorHandler.requireType(callback, 'function', 'callback');
ErrorHandler.requireType(items, 'array', 'items');
```

---

### 6. **InitializationError** - 초기화 실패
**언제 사용하나요?**
- 컴포넌트 초기화 실패 시
- 필수 설정이 누락되었을 때

**예시:**
```javascript
import { InitializationError } from '../utils/errors.js';

init() {
  if (!this.element || !this.options) {
    throw new InitializationError('초기화 실패', {
      component: 'MyComponent',
      reason: 'Missing required properties',
      hasElement: !!this.element,
      hasOptions: !!this.options
    });
  }
}
```

---

### 7. **ConfigurationError** - 잘못된 설정
**언제 사용하나요?**
- 서로 충돌하는 옵션이 함께 사용될 때
- 유효하지 않은 설정값일 때

**예시:**
```javascript
import { ConfigurationError } from '../utils/errors.js';

if (options.singleOpen && options.multipleExpanded) {
  throw new ConfigurationError(
    'singleOpen과 multipleExpanded는 함께 사용할 수 없습니다',
    {
      conflictingOptions: ['singleOpen', 'multipleExpanded'],
      singleOpen: options.singleOpen,
      multipleExpanded: options.multipleExpanded
    }
  );
}
```

---

## 🛠️ ErrorHandler 유틸리티

### 기본 사용법

```javascript
import { ErrorHandler } from '../utils/errors.js';

// 에러 처리
try {
  // 위험한 코드
  doSomething();
} catch (error) {
  ErrorHandler.handle(error, 'MyComponent');
  // 에러를 로그하고 조용히 실패
}

// 에러를 다시 던지기
try {
  doSomething();
} catch (error) {
  ErrorHandler.handle(error, 'MyComponent', { rethrow: true });
}

// 대체 동작 제공
try {
  loadData();
} catch (error) {
  ErrorHandler.handle(error, 'MyComponent', {
    fallback: () => {
      // 대체 동작
      loadDefaultData();
    }
  });
}
```

---

### 헬퍼 메서드

#### 1. **requireParams** - 필수 파라미터 검증
```javascript
// 단일 파라미터
ErrorHandler.requireParams(options, ['id'], 'MyComponent');

// 여러 파라미터
ErrorHandler.requireParams(options, ['id', 'type', 'callback'], 'MyComponent');

// 없으면 ValidationError 발생
```

#### 2. **requireElement** - DOM 요소 검증
```javascript
const element = document.querySelector('.my-element');
ErrorHandler.requireElement(element, '.my-element', 'MyComponent');

// 없으면 ElementNotFoundError 발생
```

#### 3. **requireType** - 타입 검증
```javascript
ErrorHandler.requireType(callback, 'function', 'callback');
ErrorHandler.requireType(items, 'array', 'items');
ErrorHandler.requireType(name, 'string', 'name');
ErrorHandler.requireType(count, 'number', 'count');

// 타입이 맞지 않으면 TypeMismatchError 발생
```

#### 4. **validate** - 조건 검증
```javascript
ErrorHandler.validate(
  items.length > 0,
  '최소 1개 이상의 아이템이 필요합니다',
  { itemCount: items.length }
);

// 조건이 false면 ValidationError 발생
```

#### 5. **promiseHandler** - Promise 에러 처리
```javascript
loadContent({ src: './page.html' })
  .then(result => {
    // 성공
  })
  .catch(ErrorHandler.promiseHandler('MyComponent', () => {
    // 실패 시 대체 동작
    loadDefaultContent();
  }));
```

---

## 🎯 실전 예제

### 컴포넌트 초기화 패턴

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
      this.element = document.querySelector(options.element);
      ErrorHandler.requireElement(this.element, options.element, 'MyComponent');
      
      // 4. 조건 검증
      ErrorHandler.validate(
        options.items.length > 0,
        '최소 1개 이상의 아이템이 필요합니다',
        { itemCount: options.items.length }
      );
      
      this.options = options;
      
    } catch (error) {
      // 에러 처리 및 로그
      ErrorHandler.handle(error, 'MyComponent');
      return; // 초기화 중단
    }
  }
}
```

---

### 안전한 DOM 조작 패턴

```javascript
import { ErrorHandler } from '../utils/errors.js';

toggle() {
  try {
    // 1. 요소 존재 확인
    const button = document.querySelector(`#${this.id}`);
    ErrorHandler.requireElement(button, `#${this.id}`, 'MyComponent');
    
    // 2. 상태 확인
    if (this.#isAnimating) {
      throw new StateError('애니메이션 진행 중', {
        state: 'animating'
      });
    }
    
    // 3. 안전한 실행
    this.#isAnimating = true;
    this.performToggle(button);
    
  } catch (error) {
    ErrorHandler.handle(error, 'MyComponent');
  }
}
```

---

### 네트워크 요청 패턴

```javascript
import { ErrorHandler, NetworkError } from '../utils/errors.js';

async loadData(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new NetworkError('데이터 로드 실패', {
        url: url,
        status: response.status,
        statusText: response.statusText
      });
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    ErrorHandler.handle(error, 'MyComponent', {
      fallback: () => {
        // 캐시된 데이터 사용
        return this.getCachedData();
      }
    });
  }
}
```

---

## 📊 전역 에러 핸들러

애플리케이션 시작 시 자동으로 설정됩니다:

```javascript
// uiuxu.common.js에서 자동 실행
import { setupGlobalErrorHandler } from './utils/errors.js';

setupGlobalErrorHandler();
```

### 기능:
- ✅ 처리되지 않은 에러 자동 캐치
- ✅ 처리되지 않은 Promise rejection 캐치
- ✅ 모든 에러를 logger로 기록

---

## ✅ 베스트 프랙티스

### 1. **항상 컴포넌트 이름을 명시하세요**
```javascript
// Good ✅
ErrorHandler.handle(error, 'Accordion');

// Bad ❌
ErrorHandler.handle(error);
```

### 2. **충분한 컨텍스트 정보를 제공하세요**
```javascript
// Good ✅
throw new ValidationError('ID는 필수입니다', {
  component: 'Accordion',
  received: options.id,
  expectedType: 'string'
});

// Bad ❌
throw new ValidationError('ID는 필수입니다');
```

### 3. **적절한 에러 타입을 사용하세요**
```javascript
// Good ✅
if (!element) {
  throw new ElementNotFoundError('...', {...});
}

// Bad ❌
if (!element) {
  throw new Error('...');
}
```

### 4. **ErrorHandler 헬퍼를 활용하세요**
```javascript
// Good ✅
ErrorHandler.requireParams(options, ['id'], 'MyComponent');

// Bad ❌
if (!options.id) {
  throw new ValidationError('ID 필요', {...});
}
```

### 5. **에러를 조용히 무시하지 마세요**
```javascript
// Good ✅
try {
  doSomething();
} catch (error) {
  ErrorHandler.handle(error, 'MyComponent');
}

// Bad ❌
try {
  doSomething();
} catch (error) {
  // 아무것도 안 함
}
```

---

## 🔍 디버깅 팁

### 에러 정보 확인
```javascript
// 에러 객체의 모든 정보 확인
try {
  // ...
} catch (error) {
  console.log(error.toJSON()); // UIError의 경우
  console.log(error.context);   // 컨텍스트 정보
  console.log(error.stack);     // 스택 트레이스
}
```

### 프로덕션 vs 개발 환경
- **개발 환경**: 모든 에러가 콘솔에 표시됨
- **프로덕션**: Error 레벨만 표시됨 (logger 설정에 따름)

---

## 📝 변경 이력

- **2024-10-17**: 에러 처리 시스템 구축
- 커스텀 에러 클래스 7종 추가
- ErrorHandler 유틸리티 추가
- 전역 에러 핸들러 추가
