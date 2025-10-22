import { makeID, Timeouts } from "../utils/utils.js";
import { logger } from "../utils/logger.js";
import { ErrorHandler } from "../utils/errors.js";

/**
 * Toast 알림 시스템 (클래스 방식)
 *
 * @example
 * // 기본 사용법
 * const myToast = new Toast('Hello World');
 * myToast.show();
 *
 * // 옵션과 함께
 * const customToast = new Toast('커스텀 토스트', {
 *   type: 'success',
 *   delay: 'long',
 *   position: 'top'
 * });
 * customToast.show();
 *
 * // Method Chaining
 * new Toast('체이닝 예제')
 *   .setType('success')
 *   .setDelay(3000)
 *   .show();
 */

// 전역 토스트 인스턴스 관리
const activeToasts = new Map();

/**
 * Toast 클래스
 */
class Toast {
  constructor(messageOrOptions = "", options = {}) {
    // 매개변수 정규화
    if (typeof messageOrOptions === "string") {
      this.options = { message: messageOrOptions, ...options };
    } else {
      this.options = { ...messageOrOptions };
    }

    // 기본 설정
    const defaults = {
      message: "",
      delay: "short", // 'short' (2s) | 'long' (3s) | number (ms) | 'never'
      position: "top", // 'top' | 'bottom' | 'center'
      role: "status", // 'status' | 'alert'
      type: "default", // 'default' | 'success' | 'error' | 'warning' | 'info'
      closable: false, // 수동 닫기 버튼 표시 여부
      pauseOnHover: true, // 마우스 오버 시 일시정지 여부
      className: "", // 추가 CSS 클래스
      area: null, // 컨테이너 엘리먼트 (null이면 자동 생성)
      onShow: null, // 표시 시 콜백
      onHide: null, // 숨김 시 콜백
      onClick: null, // 클릭 시 콜백
    };

    this.options = { ...defaults, ...this.options };

    // 인스턴스 속성
    this.id = makeID(8);
    this.element = null;
    this.area = null;
    this.timer = null;
    this.isVisible = false;
    this.isDestroyed = false;

    // 이벤트 핸들러 바인딩
    this.boundMouseOver = this.handleMouseOver.bind(this);
    this.boundMouseLeave = this.handleMouseLeave.bind(this);
    this.boundClick = this.handleClick.bind(this);
    this.boundAnimationEnd = this.handleAnimationEnd.bind(this);

    // 초기화
    this.init();
  }

  /**
   * 초기화
   */
  init() {
    try {
      this.createArea();
      this.createElement();
      activeToasts.set(this.id, this);
      logger.debug(`Toast initialized with ID: ${this.id}`, null, "Toast");
    } catch (error) {
      ErrorHandler.handle(error, "Toast");
    }
  }

  /**
   * 토스트 컨테이너 영역 생성 또는 가져오기
   */
  createArea() {
    if (this.options.area) {
      this.area = this.options.area;
      return;
    }

    const areaSelector = `.area-toast[data-position="${this.options.position}"]`;
    this.area = document.querySelector(areaSelector);

    if (!this.area) {
      const areaHTML = `<div class="area-toast" data-position="${this.options.position}" data-area="toast"></div>`;
      document.body.insertAdjacentHTML("beforeend", areaHTML);
      this.area = document.querySelector(areaSelector);
      logger.debug(
        `Toast area created for position: ${this.options.position}`,
        null,
        "Toast"
      );
    }
  }

  /**
   * 토스트 엘리먼트 생성
   */
  createElement() {
    const { message, type, role, closable, className } = this.options;

    const closeButton = closable
      ? '<button type="button" class="ui-toast__close" aria-label="닫기">×</button>'
      : "";

    const html = `
      <div class="ui-toast ${className}" 
           data-toast-id="${this.id}"
           data-type="${type}"
           role="${role}"
           aria-hidden="true"
           aria-live="polite">
        <div class="ui-toast__content">
          ${message}
        </div>
        ${closeButton}
      </div>
    `;

    this.area.insertAdjacentHTML("beforeend", html);
    this.element = this.area.querySelector(`[data-toast-id="${this.id}"]`);

    if (!this.element) {
      throw new Error(`Failed to create toast element with ID: ${this.id}`);
    }
  }

  /**
   * 이벤트 리스너 등록
   */
  addEventListeners() {
    if (!this.element) return;

    // 마우스 호버 이벤트
    if (this.options.pauseOnHover) {
      this.element.addEventListener("mouseenter", this.boundMouseOver);
      this.element.addEventListener("mouseleave", this.boundMouseLeave);
    }

    // 클릭 이벤트
    this.element.addEventListener("click", this.boundClick);

    // 닫기 버튼
    const closeBtn = this.element.querySelector(".ui-toast__close");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.hide();
      });
    }

    // 애니메이션 종료 이벤트
    this.element.addEventListener("transitionend", this.boundAnimationEnd);
  }

  /**
   * 이벤트 리스너 제거
   */
  removeEventListeners() {
    if (!this.element) return;

    this.element.removeEventListener("mouseenter", this.boundMouseOver);
    this.element.removeEventListener("mouseleave", this.boundMouseLeave);
    this.element.removeEventListener("click", this.boundClick);
    this.element.removeEventListener("transitionend", this.boundAnimationEnd);

    logger.debug(
      `Event listeners removed for toast: ${this.id}`,
      null,
      "Toast"
    );
  }

  /**
   * 자동 숨김 타이머 시작
   */
  startTimer() {
    this.clearTimer();

    const delay = this.getDelay();
    if (delay <= 0) return; // 자동 숨김 비활성화

    this.timer = setTimeout(() => {
      this.hide();
    }, delay);

    // 전역 타이머 관리에 등록
    Timeouts[this.id] = this.timer;

    logger.debug(
      `Toast timer started: ${delay}ms for ID: ${this.id}`,
      null,
      "Toast"
    );
  }

  /**
   * 타이머 정리
   */
  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (Timeouts[this.id]) {
      clearTimeout(Timeouts[this.id]);
      delete Timeouts[this.id];
    }
  }

  /**
   * 지연 시간 계산
   */
  getDelay() {
    const { delay } = this.options;

    if (typeof delay === "number") {
      return delay;
    }

    switch (delay) {
      case "short":
        return 2000;
      case "long":
        return 3500;
      case "never":
        return 0;
      default:
        return 2000;
    }
  }

  /**
   * 마우스 오버 핸들러
   */
  handleMouseOver() {
    this.clearTimer();
    logger.debug(`Toast timer paused (hover): ${this.id}`, null, "Toast");
  }

  /**
   * 마우스 리브 핸들러
   */
  handleMouseLeave() {
    this.startTimer();
    logger.debug(`Toast timer resumed (leave): ${this.id}`, null, "Toast");
  }

  /**
   * 클릭 핸들러
   */
  handleClick(e) {
    if (this.options.onClick) {
      this.options.onClick(this, e);
    }
  }

  /**
   * 애니메이션 종료 핸들러
   */
  handleAnimationEnd(e) {
    if (e.propertyName === "opacity" && !this.isVisible) {
      this.destroy();
    }
  }

  /**
   * 토스트 표시
   */
  show() {
    if (this.isDestroyed || this.isVisible) {
      return this;
    }

    try {
      this.isVisible = true;
      this.element.setAttribute("aria-hidden", "false");

      // 다음 프레임에서 표시 (CSS 트랜지션을 위해)
      requestAnimationFrame(() => {
        if (this.element) {
          this.element.classList.add("is-visible");
        }
      });

      this.addEventListeners();
      this.startTimer();

      // 콜백 호출
      if (this.options.onShow) {
        this.options.onShow(this);
      }

      logger.debug(`Toast shown: ${this.id}`, null, "Toast");
    } catch (error) {
      ErrorHandler.handle(error, "Toast");
    }

    return this;
  }

  /**
   * 토스트 숨김
   */
  hide() {
    if (this.isDestroyed || !this.isVisible) {
      return this;
    }

    try {
      this.isVisible = false;
      this.clearTimer();

      this.element.setAttribute("aria-hidden", "true");
      this.element.classList.remove("is-visible");
      this.element.classList.add("is-hiding");

      // 콜백 호출
      if (this.options.onHide) {
        this.options.onHide(this);
      }

      logger.debug(`Toast hidden: ${this.id}`, null, "Toast");
    } catch (error) {
      ErrorHandler.handle(error, "Toast");
    }

    return this;
  }

  /**
   * 토스트 완전 제거
   */
  destroy() {
    if (this.isDestroyed) {
      return;
    }

    try {
      this.isDestroyed = true;
      this.clearTimer();
      this.removeEventListeners();

      if (this.element) {
        this.element.remove();
        this.element = null;
      }

      // 영역이 비어있으면 제거
      if (this.area && this.area.children.length === 0) {
        this.area.remove();
      }

      // activeToasts에서 제거
      activeToasts.delete(this.id);

      logger.debug(`Toast destroyed: ${this.id}`, null, "Toast");
    } catch (error) {
      ErrorHandler.handle(error, "Toast");
    }
  }

  // ========================================
  // 유틸리티 메서드 (Method Chaining 지원)
  // ========================================

  /**
   * 메시지 설정
   */
  setMessage(message) {
    this.options.message = message;
    if (this.element) {
      const content = this.element.querySelector(".ui-toast__content");
      if (content) {
        content.innerHTML = message;
      }
    }
    return this;
  }

  /**
   * 지연 시간 설정
   */
  setDelay(delay) {
    this.options.delay = delay;
    return this;
  }

  /**
   * 타입 설정
   */
  setType(type) {
    this.options.type = type;
    if (this.element) {
      this.element.dataset.type = type;
    }
    return this;
  }

  /**
   * 위치 설정
   */
  setPosition(position) {
    this.options.position = position;
    return this;
  }

  /**
   * 상태 확인
   */
  get visible() {
    return this.isVisible;
  }

  get destroyed() {
    return this.isDestroyed;
  }
}

// ========================================
// 편의 함수들 (Function 방식 지원)
// ========================================

/**
 * 기본 토스트 표시
 */
export function toast(message, options = {}) {
  return new Toast(message, options).show();
}

/**
 * 성공 토스트
 */
toast.success = function (message, options = {}) {
  return new Toast(message, { ...options, type: "success" }).show();
};

/**
 * 에러 토스트
 */
toast.error = function (message, options = {}) {
  return new Toast(message, {
    ...options,
    type: "error",
    delay: "long",
  }).show();
};

/**
 * 경고 토스트
 */
toast.warning = function (message, options = {}) {
  return new Toast(message, { ...options, type: "warning" }).show();
};

/**
 * 정보 토스트
 */
toast.info = function (message, options = {}) {
  return new Toast(message, { ...options, type: "info" }).show();
};

/**
 * 로딩 토스트 (자동 숨김 없음)
 */
toast.loading = function (message, options = {}) {
  return new Toast(message, {
    ...options,
    type: "info",
    delay: "never",
    closable: false,
  }).show();
};

/**
 * 모든 토스트 숨기기
 */
toast.clear = function () {
  // activeToasts를 통해 모든 토스트 정리
  for (const [id, instance] of activeToasts) {
    instance.destroy();
  }
  activeToasts.clear();

  // DOM에 남아있을 수 있는 영역들도 정리
  const areas = document.querySelectorAll(".area-toast");
  areas.forEach((area) => {
    if (area.children.length === 0) {
      area.remove();
    }
  });
};

// ========================================
// Export
// ========================================

export { Toast };
export default Toast;
