import { LayerCore } from "./layerCore.js";
import { logger } from "../utils/logger.js";

const initializedLayers = new Map();

/**
 * HTML data-* 속성 자동 파서 & 인스턴스 생성기
 */
export function autoInitLayers(container = document) {
  if (typeof document === "undefined") return initializedLayers;

  const elements = container.querySelectorAll("[data-ui-layer]");

  elements.forEach((el) => {
    // 이미 초기화된 요소 스킵
    if (el.dataset.uiLayerInitialized === "true") return;

    const layerType = el.dataset.uiLayer; // 'dropdown' | 'modal' | 'tooltip' | 'dialog' | 'toast'
    const targetSelector = el.dataset.uiTarget || el.dataset.uiTriggerTarget;
    const placement = el.dataset.uiPlacement || "bottom-start";
    const trigger = el.dataset.uiTrigger || "click";
    const zIndexGroup = el.dataset.uiZIndex || layerType;
    const teleportTo = el.dataset.uiTeleport !== undefined ? el.dataset.uiTeleport : "body";

    let targetElement = null;
    if (targetSelector) {
      targetElement = document.querySelector(targetSelector);
    } else if (el.previousElementSibling && el.previousElementSibling.matches("button, a, [data-ui-trigger]")) {
      targetElement = el.previousElementSibling;
    }

    const instance = new LayerCore({
      id: el.id || el.dataset.uiLayerId,
      type: layerType,
      element: el,
      target: targetElement,
      placement: placement,
      trigger: trigger,
      zIndexGroup: zIndexGroup,
      teleportTo: teleportTo === "false" ? false : teleportTo,
    });

    el.dataset.uiLayerInitialized = "true";
    initializedLayers.set(instance.id, instance);

    logger.debug(`Auto initialized layer [${instance.id}] from HTML data-attributes`, null, "LayerAutoInit");
  });

  return initializedLayers;
}

// DOM ready 자동 수신
if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => autoInitLayers());
  } else {
    autoInitLayers();
  }
}

export default autoInitLayers;
