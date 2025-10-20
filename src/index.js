/**
 * UIUXU Component Library
 * Main Entry Point
 *
 * @version 1.0.0
 * @author asever77
 * @license MIT
 */

// ============================================
// 컴포넌트들 (component/ 폴더)
// ============================================

export { default as Accordion } from "./assets/js/component/accordion.js";
export { default as ButtonSelection } from "./assets/js/component/buttonSelection.js";
export { default as ChartBubble } from "./assets/js/component/chart_bubble.js";
export { default as Countdown } from "./assets/js/component/countdown.js";
export { default as Dialog } from "./assets/js/component/dialog.js";
export { default as Drag } from "./assets/js/component/drag.js";
export { default as Dropdown } from "./assets/js/component/dropdown.js";
export { default as Form } from "./assets/js/component/form.js";
export { default as ListIA } from "./assets/js/component/listIA.js";
export { default as Nav } from "./assets/js/component/nav.js";
export { default as RangeSlider } from "./assets/js/component/rangeSlider.js";
export { default as Roulette } from "./assets/js/component/roulette.js";
export { default as ScrollEvent } from "./assets/js/component/scrollEvent.js";
export { default as Tab } from "./assets/js/component/tab.js";
export { default as TimeSelect } from "./assets/js/component/timeSelect.js";
export { default as ToggleController } from "./assets/js/component/toggleController.js";
export { default as Tooltip } from "./assets/js/component/tooltip.js";
export { default as WheelPicker } from "./assets/js/component/wheelPicker.js";

// ============================================
// 유틸리티들 (utils/ 폴더)
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
  console.log("UIUXU Component Library v1.0.0 initialized");

  if (config.debug) {
    console.log("Debug mode enabled");
  }

  return {
    version,
    author,
    components: [
      "Accordion",
      "ButtonSelection",
      "Dialog",
      "Dropdown",
      "Tab",
      "Tooltip",
      "RangeSlider",
      "TimeSelect",
      "Countdown",
      "Drag",
      "Form",
      "ChartBubble",
    ],
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
