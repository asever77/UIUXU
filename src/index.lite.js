/**
 * UIUXU Component Library - Lite Version
 * Main Entry Point (Accordion & Tab only)
 *
 * @version 1.0.0
 * @author asever77
 * @license MIT
 */

// ============================================
// 선택된 컴포넌트만 export
// ============================================

// ✅ 아코디언과 탭만 포함
export { default as Accordion } from "./assets/js/component/accordion.js";
export { default as Tab } from "./assets/js/component/tab.js";

// ============================================
// 유틸리티들 (필수)
// ============================================

export { Logger } from "./assets/js/utils/logger.js";

export {
  UIError,
  ValidationError,
  ElementNotFoundError,
  NetworkError,
  InitializationError,
  ConfigurationError,
  StateError,
  ErrorHandler,
} from "./assets/js/utils/errors.js";

export {
  getElement,
  slideUp,
  slideDown,
  fadeIn,
  fadeOut,
  loadContent,
} from "./assets/js/utils/utils.js";

// ============================================
// 메타 정보
// ============================================

export const version = "1.0.0";
export const author = "asever77";

/**
 * 라이브러리 초기화 (선택적)
 */
export function init(config = {}) {
  console.log("UIUXU Component Library (Lite) v1.0.0 initialized");

  if (config.debug) {
    console.log("Debug mode enabled");
  }

  return {
    version,
    author,
    components: ["Accordion", "Tab"],
  };
}

/**
 * 기본 export
 */
export default {
  version,
  author,
  init,
};
