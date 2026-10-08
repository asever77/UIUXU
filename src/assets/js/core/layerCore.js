import { makeID } from "../utils/utils.js";
import { logger } from "../utils/logger.js";
import { ErrorHandler } from "../utils/errors.js";
import { layerStack } from "./layerStack.js";
import { LayerPositionCalculator } from "./layerPosition.js";
import { LayerFocusManager } from "./layerFocus.js";

/**
 * LayerCore
 * UIUXU의 레고(Lego) 블록형 통합 레이어 코어 엔진
 * (Dropdown, Tooltip, Dialog, Toast의 비즈니스 로직 / A11y / 상태 제어 통합)
 */
export class LayerCore {
  constructor(options = {}) {
    const defaults = {
      id: null,
      type: "modal", // 'modal' | 'dialog' | 'dropdown' | 'tooltip' | 'toast'
      element: null, // 패널/팝업 DOM 요소
      target: null, // 트리거/앵커 DOM 요소 또는 셀렉터
      placement: "bottom-start", // 'top' | 'bottom' | 'left' | 'right' | 'center' | 'bottom-start' 등
      offset: 8,
      autoFlip: true,
      teleportTo: "body", // 'body' | HTMLElement | false (inline)
      trigger: "click", // 'click' | 'hover' | 'focus' | 'manual'
      closeOnOutsideClick: true,
      closeOnEsc: true,
      focusTrap: true,
      autoFocus: true, // true | false | string (selector) | HTMLElement
      returnFocus: true, // true | false | string (selector) | HTMLElement
      zIndexGroup: null, // 'tooltip'(1000) | 'dropdown'(2000) | 'modal'(3000) | 'toast'(4000)
      role: null, // ARIA role ('dialog', 'menu', 'tooltip', 'status' 등)
      onOpen: null,
      onClose: null,
    };

    this.options = { ...defaults, ...options };
    this.id = this.options.id || `layer-${makeID(6)}`;
    this.type = this.options.type;
    this.element = null;
    this.target = null;
    this.isOpen = false;
    this.triggerFocusElement = null; // 포커스 복원용
    this.focusManager = null;
    this.hoverTimer = null;

    // 바운딩 함수 참조
    this.boundHandleOutsideClick = this.handleOutsideClick.bind(this);
    this.boundHandleTriggerClick = this.handleTriggerClick.bind(this);
    this.boundHandleMouseEnter = this.handleMouseEnter.bind(this);
    this.boundHandleMouseLeave = this.handleMouseLeave.bind(this);

    this.init();
  }

  /**
   * 코어 인스턴스 초기화
   */
  init() {
    try {
      this.resolveElements();
      this.setupAriaAttributes();
      this.setupTriggerEvents();

      logger.debug(`LayerCore initialized [${this.id}] (Type: ${this.type})`, null, "LayerCore");
    } catch (error) {
      ErrorHandler.handle(error, "LayerCore");
    }
  }

  /**
   * Element 및 Target DOM 요소 조율
   */
  resolveElements() {
    // 1. Element (레이어 팝업 패널)
    if (typeof this.options.element === "string") {
      this.element = document.querySelector(this.options.element);
    } else {
      this.element = this.options.element;
    }

    // 2. Target (트리거 버튼/앵커)
    if (typeof this.options.target === "string") {
      this.target = document.querySelector(this.options.target);
    } else {
      this.target = this.options.target;
    }

    if (this.element) {
      this.element.id = this.element.id || this.id;
      this.element.dataset.uiLayerId = this.id;
      this.element.dataset.uiLayerType = this.type;
      this.element.dataset.uiState = "closed";
      this.element.setAttribute("aria-hidden", "true");
    }
  }

  /**
   * 웹접근성(WCAG/WAI-ARIA) 기본 속성 세팅
   */
  setupAriaAttributes() {
    if (!this.element) return;

    // Default Role Mapping
    let role = this.options.role;
    if (!role) {
      switch (this.type) {
        case "modal":
        case "dialog":
          role = "dialog";
          break;
        case "dropdown":
          role = "menu";
          break;
        case "tooltip":
          role = "tooltip";
          break;
        case "toast":
          role = "status";
          break;
      }
    }

    if (role) {
      this.element.setAttribute("role", role);
    }

    if (this.type === "modal" || this.type === "dialog") {
      this.element.setAttribute("aria-modal", "true");
    }

    if (this.target) {
      if (this.type === "dropdown") {
        this.target.setAttribute("aria-haspopup", "true");
        this.target.setAttribute("aria-expanded", "false");
        this.target.setAttribute("aria-controls", this.element.id);
      } else if (this.type === "tooltip") {
        this.target.setAttribute("aria-describedby", this.element.id);
      }
    }
  }

  /**
   * 트리거 이벤트 바인딩 (Click, Hover, Focus)
   */
  setupTriggerEvents() {
    if (!this.target) return;

    if (this.options.trigger === "click") {
      this.target.addEventListener("click", this.boundHandleTriggerClick);
    } else if (this.options.trigger === "hover") {
      this.target.addEventListener("mouseenter", this.boundHandleMouseEnter);
      this.target.addEventListener("mouseleave", this.boundHandleMouseLeave);
      this.target.addEventListener("focus", this.boundHandleMouseEnter);
      this.target.addEventListener("blur", this.boundHandleMouseLeave);

      if (this.element) {
        this.element.addEventListener("mouseenter", this.boundHandleMouseEnter);
        this.element.addEventListener("mouseleave", this.boundHandleMouseLeave);
      }
    }
  }

  /**
   * 레이어 열기
   */
  open() {
    if (this.isOpen || !this.element) return this;

    this.isOpen = true;
    this.triggerFocusElement = document.activeElement;

    // Teleport 처리
    if (this.options.teleportTo && typeof document !== "undefined") {
      const teleportContainer =
        this.options.teleportTo === "body"
          ? document.body
          : document.querySelector(this.options.teleportTo);

      if (teleportContainer && this.element.parentElement !== teleportContainer) {
        teleportContainer.appendChild(this.element);
      }
    }

    // 위치 업데이트 (Dropdown / Tooltip)
    this.updatePosition();

    // DOM 속성 업데이트
    this.element.setAttribute("aria-hidden", "false");
    this.element.dataset.uiState = "open";

    if (this.target) {
      this.target.setAttribute("aria-expanded", "true");
    }

    // Z-Index 관리자에 등록
    layerStack.push(this);

    // Focus 루프 및 포커스 이동 관리자 활성화 (autoFocus / returnFocus / Focus Trap)
    if (this.options.focusTrap !== false && this.element) {
      try {
        this.focusManager = new LayerFocusManager(this.element, {
          autoFocus: this.options.autoFocus,
          returnFocus: this.options.returnFocus !== undefined ? this.options.returnFocus : (this.target || true),
          focusLoop: this.options.focusTrap,
          arrowNav: this.type === "dropdown",
        });
      } catch (e) {
        logger.warn("LayerFocusManager init failed", e, "LayerCore");
      }
    }

    // Outside Click 바인딩
    if (this.options.closeOnOutsideClick) {
      setTimeout(() => {
        document.addEventListener("click", this.boundHandleOutsideClick);
      }, 10);
    }

    // 콜백 호출
    if (typeof this.options.onOpen === "function") {
      this.options.onOpen(this);
    }

    logger.debug(`Layer Core Opened [${this.id}]`, null, "LayerCore");
    return this;
  }

  /**
   * 레이어 닫기
   */
  close() {
    if (!this.isOpen || !this.element) return this;

    this.isOpen = false;

    // Outside Click 해제
    document.removeEventListener("click", this.boundHandleOutsideClick);

    // Focus 루프 해제 및 포커스 복원 (returnFocus)
    if (this.focusManager) {
      this.focusManager.deactivate();
      this.focusManager = null;
    }

    // DOM 속성 업데이트
    this.element.setAttribute("aria-hidden", "true");
    this.element.dataset.uiState = "closed";

    if (this.target) {
      this.target.setAttribute("aria-expanded", "false");
    }

    // Z-Index 스택에서 제거
    layerStack.remove(this.id);

    // 포커스 복원
    if (this.options.returnFocus && this.triggerFocusElement && typeof this.triggerFocusElement.focus === "function") {
      this.triggerFocusElement.focus();
    }

    // 콜백 호출
    if (typeof this.options.onClose === "function") {
      this.options.onClose(this);
    }

    logger.debug(`Layer Core Closed [${this.id}]`, null, "LayerCore");
    return this;
  }

  /**
   * 토글 (열림<->닫힘)
   */
  toggle() {
    return this.isOpen ? this.close() : this.open();
  }

  /**
   * 위치 정렬 계산 및 적용
   */
  updatePosition() {
    if (!this.target || !this.element) return;
    if (this.type === "modal" || this.type === "dialog" || this.type === "toast") return;

    const pos = LayerPositionCalculator.computePosition(this.target, this.element, {
      placement: this.options.placement,
      offset: this.options.offset,
      autoFlip: this.options.autoFlip,
      teleportTo: this.options.teleportTo,
    });

    this.element.style.position = "absolute";
    this.element.style.top = `${pos.top}px`;
    this.element.style.left = `${pos.left}px`;
    this.element.dataset.uiPlacement = pos.placement;
    this.element.dataset.ps = pos.placement;
  }

  /**
   * 외부 클릭 핸들러
   */
  handleOutsideClick(e) {
    if (!this.isOpen || !this.element) return;

    const isInsideElement = this.element.contains(e.target);
    const isInsideTarget = this.target && this.target.contains(e.target);

    if (!isInsideElement && !isInsideTarget) {
      this.close();
    }
  }

  /**
   * 트리거 클릭 핸들러
   */
  handleTriggerClick(e) {
    e.preventDefault();
    this.toggle();
  }

  /**
   * 마우스 엔터 (Hover) 핸들러
   */
  handleMouseEnter() {
    if (this.hoverTimer) clearTimeout(this.hoverTimer);
    this.open();
  }

  /**
   * 마우스 리브 (Hover) 핸들러
   */
  handleMouseLeave() {
    if (this.hoverTimer) clearTimeout(this.hoverTimer);
    this.hoverTimer = setTimeout(() => {
      this.close();
    }, 150);
  }

  /**
   * 정리 (Destroy)
   */
  destroy() {
    this.close();

    if (this.target) {
      this.target.removeEventListener("click", this.boundHandleTriggerClick);
      this.target.removeEventListener("mouseenter", this.boundHandleMouseEnter);
      this.target.removeEventListener("mouseleave", this.boundHandleMouseLeave);
      this.target.removeEventListener("focus", this.boundHandleMouseEnter);
      this.target.removeEventListener("blur", this.boundHandleMouseLeave);
    }

    if (this.element) {
      this.element.removeEventListener("mouseenter", this.boundHandleMouseEnter);
      this.element.removeEventListener("mouseleave", this.boundHandleMouseLeave);
    }

    this.element = null;
    this.target = null;
    this.triggerFocusElement = null;

    logger.debug(`LayerCore Destroyed [${this.id}]`, null, "LayerCore");
  }
}

export default LayerCore;
