import { logger } from "../utils/logger.js";

/**
 * LayerStackManager
 * 전역 Z-Index 계층 관리 및 ESC 키 수신 처리기
 */
class LayerStackManager {
  constructor() {
    this.stack = [];
    this.groupBaseZIndex = {
      tooltip: 1000,
      dropdown: 2000,
      modal: 3000,
      dialog: 3000,
      toast: 4000,
    };
    this.isListeningEsc = false;
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * 레이어 등록 및 Z-Index 할당
   * @param {Object} layerInstance
   */
  push(layerInstance) {
    if (!layerInstance || !layerInstance.id) return;

    // 이미 등록되어 있다면 제거 후 재등록 (최상위로 올림)
    this.remove(layerInstance.id);

    const group = layerInstance.options?.zIndexGroup || layerInstance.type || "modal";
    const baseZIndex =
      typeof group === "number"
        ? group
        : this.groupBaseZIndex[group] || 3000;

    // 해당 그룹 내에서의 순서 계산
    const sameGroupCount = this.stack.filter(
      (item) => (item.options?.zIndexGroup || item.type) === group
    ).length;

    const zIndex = baseZIndex + sameGroupCount + 1;
    layerInstance.zIndex = zIndex;

    if (layerInstance.element) {
      layerInstance.element.style.zIndex = zIndex;
      layerInstance.element.dataset.zIndex = zIndex;
      layerInstance.element.dataset.state = "open";
    }

    this.stack.push(layerInstance);
    this.updateBodyScrollLock();
    this.ensureEscListener();

    logger.debug(
      `Layer pushed [${layerInstance.id}] (Type: ${layerInstance.type}, Z-Index: ${zIndex})`,
      null,
      "LayerStack"
    );
  }

  /**
   * 레이어 제거 및 Z-Index 재정렬
   * @param {string} id
   */
  remove(id) {
    const index = this.stack.findIndex((item) => item.id === id);
    if (index === -1) return;

    const [removed] = this.stack.splice(index, 1);
    if (removed.element) {
      removed.element.dataset.state = "closed";
    }

    this.updateBodyScrollLock();

    logger.debug(`Layer removed [${id}]`, null, "LayerStack");
  }

  /**
   * 최상위에 있는 레이어 반환
   */
  getTop() {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
  }

  /**
   * ESC 키 전역 수신 시작
   */
  ensureEscListener() {
    if (!this.isListeningEsc && typeof window !== "undefined") {
      window.addEventListener("keydown", this.handleKeyDown);
      this.isListeningEsc = true;
    }
  }

  /**
   * ESC 키 발생 시 최상위 레이어부터 순차 닫기
   */
  handleKeyDown(e) {
    if (e.key !== "Escape" && e.key !== "Esc") return;

    const topLayer = this.getTop();
    if (topLayer && topLayer.options?.closeOnEsc !== false) {
      e.preventDefault();
      e.stopPropagation();
      logger.debug(`ESC pressed, closing layer [${topLayer.id}]`, null, "LayerStack");
      topLayer.close();
    }
  }

  /**
   * 모달 레이어 존재 여부에 따른 body 스크롤 잠금 처리
   */
  updateBodyScrollLock() {
    if (typeof document === "undefined") return;

    const hasActiveModal = this.stack.some(
      (item) => item.type === "modal" || item.type === "dialog"
    );

    if (hasActiveModal) {
      document.body.classList.add("scroll-not");
      document.body.dataset.layerModalActive = "true";
    } else {
      document.body.classList.remove("scroll-not");
      delete document.body.dataset.layerModalActive;
    }
  }

  /**
   * 전체 스택 초기화
   */
  clear() {
    this.stack.forEach((layer) => {
      if (layer.close) layer.close();
    });
    this.stack = [];
    this.updateBodyScrollLock();
  }
}

export const layerStack = new LayerStackManager();
export default layerStack;
