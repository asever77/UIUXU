# 🍞 Toast 컴포넌트 - 클래스 방식으로 복원 완료!

## ✨ 클래스 방식으로 되돌렸습니다!

Toast 컴포넌트가 다시 **클래스 방식**으로 되돌려졌습니다.

## 📋 사용법

### 1. Import 방법

```javascript
// ES6 모듈
import Toast, { toast } from "./toast.js";

// 또는 named import
import { Toast, toast } from "./toast.js";
```

### 2. 기본 사용법

#### 🏗️ 클래스 방식 (기본)

```javascript
// 기본 토스트
const myToast = new Toast("안녕하세요!");
myToast.show();

// 옵션과 함께
const customToast = new Toast("커스텀 토스트", {
  type: "success",
  delay: 3000,
  position: "top-right",
});
customToast.show();

// Method Chaining
new Toast("체이닝 예제").setType("success").setDelay("long").show();
```

#### 📝 편의 함수 방식 (간단한 사용)

```javascript
toast("기본 토스트");
toast.success("성공했습니다!");
toast.error("오류가 발생했습니다!");
toast.warning("주의하세요!");
toast.info("정보를 확인하세요.");
toast.loading("처리 중..."); // 자동 숨김 없음
```

#### 🧹 모든 토스트 정리

```javascript
toast.clear(); // 모든 토스트 제거
```

### 3. 고급 사용법

#### 🎯 Method Chaining

```javascript
const myToast = new Toast("Hello World!")
  .setType("success")
  .setDelay(5000)
  .setPosition("bottom");

myToast.show();

// 또는 한 줄로
new Toast("원라이너").setType("info").show();
```

#### 🔄 동적 제어

```javascript
const myToast = new Toast("동적 토스트", {
  delay: "never",
  closable: true,
});

myToast.show();

// 나중에 메시지 변경
setTimeout(() => {
  myToast.setMessage("메시지가 바뀌었습니다!").setType("success");
}, 2000);

// 수동으로 숨기기
setTimeout(() => {
  myToast.hide();
}, 5000);
```

#### 🎯 콜백 함수 활용

```javascript
const interactiveToast = new Toast("클릭해보세요!", {
  closable: true,
  onClick: (toast) => {
    console.log("토스트 클릭됨!");
    toast.setMessage("클릭되었습니다!").setType("success");
  },
  onShow: () => console.log("표시됨"),
  onHide: () => console.log("숨겨짐"),
});

interactiveToast.show();
```

## 🎨 사용 가능한 옵션

```javascript
new Toast("메시지", {
  type: "default|success|error|warning|info", // 토스트 타입
  delay: 2000 | "short" | "long" | "never", // 지연 시간
  position: "top|bottom|center", // 표시 위치
  closable: true | false, // 닫기 버튼 표시
  pauseOnHover: true | false, // 호버 시 타이머 일시정지
  className: "custom-class", // 커스텀 CSS 클래스
  onClick: (toast) => {}, // 클릭 시 콜백
  onShow: (toast) => {}, // 표시 시 콜백
  onHide: (toast) => {}, // 숨김 시 콜백
}).show();
```

## 🔧 API 메소드

### 인스턴스 메소드

```javascript
const myToast = new Toast("메시지");

// 표시/숨김/제거
myToast.show(); // 토스트 표시
myToast.hide(); // 토스트 숨김
myToast.destroy(); // 토스트 완전 제거

// 설정 변경 (Method Chaining 지원)
myToast.setMessage("새 메시지");
myToast.setType("success");
myToast.setDelay(3000);
myToast.setPosition("bottom");

// 상태 확인
console.log(myToast.visible); // 표시 상태
console.log(myToast.destroyed); // 제거 상태
```

### 편의 함수들

```javascript
// 타입별 토스트
toast("기본");
toast.success("성공");
toast.error("에러");
toast.warning("경고");
toast.info("정보");
toast.loading("로딩");

// 전체 정리
toast.clear();
```

## 🌟 주요 특징

1. **클래스 기반**: 객체지향적인 설계로 명확한 구조
2. **Method Chaining**: 메소드 체이닝으로 유연한 설정
3. **편의 함수**: 간단한 사용을 위한 함수 방식 지원
4. **메모리 관리**: Map 기반으로 효율적인 인스턴스 관리
5. **이벤트 시스템**: 콜백을 통한 상호작용 지원
6. **접근성**: ARIA 속성을 통한 스크린 리더 지원

## 🚀 사용 예시

### 간단한 알림

```javascript
toast.success("저장되었습니다!");
```

### 로딩 표시 후 완료

```javascript
const loading = toast.loading("업로드 중...");

// 업로드 완료 후
setTimeout(() => {
  loading.hide();
  toast.success("업로드 완료!");
}, 3000);
```

### 사용자 상호작용

```javascript
new Toast("계속하시겠습니까?", {
  delay: "never",
  closable: true,
  onClick: (toast) => {
    // 사용자 액션 처리
    performAction();
    toast.setMessage("처리 중...").setType("info");

    setTimeout(() => {
      toast.setMessage("완료!").setType("success");
      setTimeout(() => toast.hide(), 2000);
    }, 1000);
  },
}).show();
```

### 다중 토스트 관리

```javascript
const toasts = [];

// 여러 토스트 생성
for (let i = 1; i <= 3; i++) {
  const toast = new Toast(`토스트 ${i}`, {
    type: ["success", "warning", "info"][i - 1],
    delay: "long",
  }).show();

  toasts.push(toast);
}

// 나중에 모두 숨기기
setTimeout(() => {
  toasts.forEach((t) => t.hide());
}, 5000);
```

---

**🎉 Toast 컴포넌트가 클래스 방식으로 복원되었습니다!**

더욱 객체지향적이고 유연한 Toast 시스템을 사용해보세요!
