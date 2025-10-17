# Logger 유틸리티 사용 가이드

## 📚 개요

UIUXU 프로젝트의 통합 로거 시스템입니다. 개발/프로덕션 환경을 자동으로 감지하고, 로그 레벨을 관리하며, 일관된 포맷으로 로그를 출력합니다.

## 🚀 사용법

### 기본 사용

```javascript
import { logger } from '../utils/logger.js';

// Debug 레벨 (개발 중 상세 정보)
logger.debug('디버그 메시지', data, 'ComponentName');

// Info 레벨 (일반 정보)
logger.info('정보 메시지', data, 'ComponentName');

// Warning 레벨 (경고)
logger.warn('경고 메시지', data, 'ComponentName');

// Error 레벨 (에러)
logger.error('에러 메시지', error, 'ComponentName');

// Success 레벨 (성공 메시지)
logger.success('성공 메시지', data, 'ComponentName');
```

### 컴포넌트별 사용 예시

```javascript
// Accordion 컴포넌트에서
import { logger } from '../utils/logger.js';

export default class Accordion {
  constructor(opt) {
    logger.debug('Accordion initialized', opt, 'Accordion');
  }
  
  show(target) {
    if (!target) {
      logger.warn('Target not found', target, 'Accordion');
      return;
    }
    logger.info('Accordion opened', target, 'Accordion');
  }
}
```

## ⚙️ 환경 설정

### 자동 감지

Logger는 다음 조건에서 자동으로 개발 모드를 활성화합니다:

1. **URL에 `?debug` 파라미터가 있는 경우**
   ```
   http://localhost:3000/page.html?debug
   ```

2. **hostname이 localhost인 경우**
   - `localhost`
   - `127.0.0.1`
   - `*.local` (로컬 도메인)

3. **localStorage에 설정이 있는 경우**
   ```javascript
   localStorage.setItem('dev-mode', 'true');
   ```

### 수동 제어

#### 개발 모드 토글
```javascript
// 브라우저 콘솔에서
logger.toggleDevMode();
```

#### 로그 레벨 설정
```javascript
// 브라우저 콘솔에서
logger.setLogLevel('warn');  // debug, info, warn, error, none 중 선택
```

사용 가능한 레벨:
- `debug`: 모든 로그 출력 (기본값)
- `info`: info, warn, error만 출력
- `warn`: warn, error만 출력
- `error`: error만 출력
- `none`: 로그 출력 안 함

## 🎨 출력 형식

```
[시간] [컴포넌트명] 메시지
[14:23:45.123] [Accordion] Accordion initialized {id: "main-acco", ...}
```

## 🔍 고급 기능

### 그룹 로그

```javascript
logger.group('데이터 처리');
logger.debug('Step 1', data1);
logger.debug('Step 2', data2);
logger.groupEnd();

// 또는 접혀있는 그룹
logger.group('상세 정보', true);
```

### 테이블 로그

```javascript
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
];
logger.table(users, '사용자 목록');
```

## 📊 프로덕션 환경

프로덕션 환경에서는:
- ✅ **error** 레벨만 자동으로 출력됩니다
- ⚠️ debug, info, warn은 출력되지 않습니다
- 🔧 URL에 `?debug` 추가하면 강제로 활성화할 수 있습니다

## 🛠️ 마이그레이션 가이드

### 기존 코드를 Logger로 변경

#### Before (기존)
```javascript
console.log('데이터:', data);
console.error('에러 발생:', error);
console.warn('경고!');
```

#### After (변경 후)
```javascript
import { logger } from '../utils/logger.js';

logger.debug('데이터', data, 'ComponentName');
logger.error('에러 발생', error, 'ComponentName');
logger.warn('경고!', null, 'ComponentName');
```

## 💡 베스트 프랙티스

1. **항상 컴포넌트 이름을 명시하세요**
   ```javascript
   // Good ✅
   logger.debug('초기화 완료', data, 'Accordion');
   
   // Bad ❌
   logger.debug('초기화 완료', data);
   ```

2. **적절한 로그 레벨을 사용하세요**
   - `debug`: 디버깅용 상세 정보
   - `info`: 일반적인 정보 (사용자 액션, 상태 변경)
   - `warn`: 잠재적 문제 (권장하지 않는 사용법)
   - `error`: 실제 에러 상황

3. **민감한 정보는 로그하지 마세요**
   ```javascript
   // Bad ❌
   logger.debug('로그인 정보', { password: '1234' });
   
   // Good ✅
   logger.debug('로그인 시도', { username: user.name });
   ```

4. **에러 객체는 두 번째 파라미터로 전달하세요**
   ```javascript
   try {
     // 작업
   } catch (error) {
     logger.error('작업 실패', error, 'ComponentName');
   }
   ```

## 🔧 문제 해결

### 로그가 보이지 않아요
1. 개발 모드가 활성화되었는지 확인: `console.log(logger.isDevelopment)`
2. 로그 레벨 확인: `console.log(logger.logLevel)`
3. URL에 `?debug` 추가해보세요

### 프로덕션에서 로그를 완전히 제거하고 싶어요
빌드 시스템에서 다음 설정 추가:
```javascript
// vite.config.js 예시
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
}
```

## 📝 변경 이력

- **2024-10-17**: Logger 유틸리티 최초 생성
- 기존 console.log/error/warn을 logger로 마이그레이션 완료
