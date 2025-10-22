# 🍞 Toast 컴포넌트 - 새로운 사용법 가이드

## ✨ Toast 객체 방식으로 업데이트 완료!

Toast 컴포넌트가 `Toast.show()` 방식으로 사용할 수 있도록 업데이트되었습니다.

## 📋 사용법

### 1. Import 방법

```javascript
// ES6 모듈
import Toast from "./toast.js";

// 또는 함수 방식도 계속 지원
import Toast, { toast } from "./toast.js";
```

### 2. 기본 사용법

#### 🔥 새로운 Toast 객체 방식 (권장)

```javascript
// 기본 토스트
Toast.show("안녕하세요!");

// 옵션과 함께
Toast.show("커스텀 토스트", {
  type: "success",
  delay: 3000,
  position: "top-right",
});
```

#### 📝 타입별 편의 함수

```javascript
Toast.success("성공했습니다!");
Toast.error("오류가 발생했습니다!");
Toast.warning("주의하세요!");
Toast.info("정보를 확인하세요.");
Toast.loading("처리 중..."); // 자동 숨김 없음
```

#### 🧹 모든 토스트 정리

```javascript
Toast.clear(); // 모든 토스트 제거
```

### 3. 고급 사용법

#### 🏗️ 인스턴스 생성 후 제어

```javascript
// 인스턴스 생성
const myToast = Toast.create("Hello World!");

// 설정 변경
myToast.setType("success");
myToast.setDelay(5000);

// 표시
myToast.show();

// 숨기기
myToast.hide();

// 완전 제거
myToast.destroy();
```

#### 🔄 Method Chaining (체이닝)

```javascript
const myToast = Toast.create("체이닝 예제");
myToast.setType("success").setDelay("long").show();
```

#### 🎯 콜백 함수 활용

```javascript
Toast.show("클릭 가능한 토스트", {
  closable: true,
  onClick: (toast) => {
    console.log("토스트 클릭됨!");
    toast.hide();
  },
  onShow: () => console.log("표시됨"),
  onHide: () => console.log("숨겨짐"),
});
```

## 🔄 하위 호환성

기존 함수 방식도 계속 지원됩니다:

```javascript
// 기존 방식 (계속 지원)
toast("메시지");
toast.success("성공!");
toast.error("에러!");
toast.clear();
```

## 🎨 사용 가능한 옵션

```javascript
Toast.show("메시지", {
  type: "default|success|error|warning|info", // 토스트 타입
  delay: 2000 | "short" | "long" | "never", // 지연 시간
  position: "top|bottom|center", // 표시 위치
  closable: true | false, // 닫기 버튼 표시
  pauseOnHover: true | false, // 호버 시 타이머 일시정지
  className: "custom-class", // 커스텀 CSS 클래스
  onClick: (toast) => {}, // 클릭 시 콜백
  onShow: (toast) => {}, // 표시 시 콜백
  onHide: (toast) => {}, // 숨김 시 콜백
});
```

## 🌟 주요 개선사항

1. **객체 방식**: `Toast.show()` 스타일로 깔끔한 API
2. **네임스페이스**: Toast 관련 모든 기능이 Toast 객체 안에 정리
3. **하위 호환성**: 기존 `toast()` 함수도 계속 지원
4. **메모리 관리**: Map 기반으로 효율적인 인스턴스 관리
5. **함수형**: 클래스에서 함수 방식으로 변경하여 성능 향상

## 🚀 사용 예시

### 간단한 알림

```javascript
Toast.success("저장되었습니다!");
```

### 로딩 표시 후 완료

```javascript
const loading = Toast.loading("업로드 중...");

// 업로드 완료 후
setTimeout(() => {
  loading.hide();
  Toast.success("업로드 완료!");
}, 3000);
```

### 사용자 상호작용

```javascript
Toast.show("계속하시겠습니까?", {
  delay: "never",
  closable: true,
  onClick: (toast) => {
    // 사용자 액션 처리
    performAction();
    toast.hide();
  },
});
```

---

**🎉 Toast 컴포넌트가 `Toast.show()` 방식으로 업데이트되었습니다!**

더욱 직관적이고 깔끔한 API로 토스트 알림을 구현해보세요!
