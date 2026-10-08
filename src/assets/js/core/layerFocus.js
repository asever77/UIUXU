import { logger } from "../utils/logger.js";

/**
 * LayerFocusManager
 * 레이어 개열(Dropdown, Dialog, Tooltip 등) 공용 포커스 루프 및 포커스 이동 관리자
 */
export class LayerFocusManager {
  /**
   * @param {HTMLElement} container 포커스 루프를 수행할 레이어 패널 엘리먼트
   * @param {Object} options autoFocus, returnFocus, focusLoop
   */
  constructor(container, options = {}) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error("LayerFocusManager requires a valid HTMLElement container.");
    }

    this.container = container;
    this.options = {
      autoFocus: true, // true | false | string (selector) | HTMLElement
      returnFocus: true, // true | false | string (selector) | HTMLElement
      focusLoop: true, // 포커스 루프 (Tab / Shift+Tab 순환) 활성화 여부
      arrowNav: true, // 키보드 방향키(상/하) 이동 지원 여부
      ...options,
    };

    this.previousActiveElement = document.activeElement;
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    this.activate();
  }

  /**
   * 컨테이너 내부의 포커스 가능한 요소 목록 수집
   * @returns {HTMLElement[]}
   */
  getFocusableElements() {
    if (!this.container) return [];

    const selectors = [
      "a[href]",
      "area[href]",
      "input:not([disabled]):not([type='hidden'])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "button:not([disabled])",
      "iframe",
      "[contenteditable]",
      '[tabindex]:not([tabindex="-1"])',
      "[data-dropdown-item]",
    ];

    return Array.from(this.container.querySelectorAll(selectors.join(","))).filter(
      (el) => el.offsetParent !== null && getComputedStyle(el).display !== "none"
    );
  }

  /**
   * 포커스 활성화 및 초기 포커스 이동
   */
  activate() {
    this.previousActiveElement = document.activeElement;

    // 1. 키보드 감시 이벤트 바인딩
    this.container.addEventListener("keydown", this.boundHandleKeyDown);

    // 2. 초기 포커스 이동 (autoFocus)
    if (this.options.autoFocus !== false) {
      requestAnimationFrame(() => {
        this.moveInitialFocus();
      });
    }

    logger.debug("LayerFocusManager activated", null, "LayerFocus");
  }

  /**
   * 초기 포커스 대상 지정 및 이동
   */
  moveInitialFocus() {
    let target = null;
    const { autoFocus } = this.options;

    if (typeof autoFocus === "string") {
      target = this.container.querySelector(autoFocus) || document.querySelector(autoFocus);
    } else if (autoFocus instanceof HTMLElement) {
      target = autoFocus;
    } else if (autoFocus === true) {
      const focusables = this.getFocusableElements();
      target = focusables.length > 0 ? focusables[0] : this.container;
    }

    if (target) {
      if (!target.hasAttribute("tabindex") && target === this.container) {
        target.setAttribute("tabindex", "-1");
      }
      target.focus();
      logger.debug("Initial focus moved to target", target, "LayerFocus");
    }
  }

  /**
   * 키보드 탐색 핸들러 (Tab / Shift+Tab 포커스 루프 & Arrow keys)
   */
  handleKeyDown(e) {
    const focusables = this.getFocusableElements();
    if (focusables.length === 0) return;

    const firstEl = focusables[0];
    const lastEl = focusables[focusables.length - 1];
    const currentIndex = focusables.indexOf(document.activeElement);

    // 1. Tab / Shift+Tab 포커스 루프 (Focus Trap Loop)
    if (e.key === "Tab" && this.options.focusLoop !== false) {
      if (e.shiftKey) {
        // Shift + Tab (역방향 루프)
        if (document.activeElement === firstEl || document.activeElement === this.container) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        // Tab (정방향 루프)
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }

    // 2. ArrowUp / ArrowDown 키보드 네비게이션 (드롭다운 메뉴 모드)
    if (this.options.arrowNav && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      let nextIndex = 0;
      if (e.key === "ArrowDown") {
        nextIndex = currentIndex < focusables.length - 1 ? currentIndex + 1 : 0;
      } else if (e.key === "ArrowUp") {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : focusables.length - 1;
      }
      focusables[nextIndex].focus();
    }
  }

  /**
   * 포커스 비활성화 및 원래/지정된 위치로 포커스 이동 (returnFocus)
   */
  deactivate() {
    if (this.container) {
      this.container.removeEventListener("keydown", this.boundHandleKeyDown);
    }

    // 포커스 복원 (returnFocus)
    const { returnFocus } = this.options;
    if (returnFocus !== false) {
      requestAnimationFrame(() => {
        let returnTarget = null;
        if (typeof returnFocus === "string") {
          returnTarget = document.querySelector(returnFocus);
        } else if (returnFocus instanceof HTMLElement) {
          returnTarget = returnFocus;
        } else if (returnFocus === true) {
          returnTarget = this.previousActiveElement;
        }

        if (returnTarget && typeof returnTarget.focus === "function") {
          returnTarget.focus();
          logger.debug("Focus returned to target", returnTarget, "LayerFocus");
        }
      });
    }

    logger.debug("LayerFocusManager deactivated", null, "LayerFocus");
  }
}

export default LayerFocusManager;
