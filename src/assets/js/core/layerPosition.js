/**
 * Floating Position Calculator for Dropdown & Tooltip
 * 
 * 14가지 위치 지정 시스템:
 * - Top 계열: tl (Top-Left), tc (Top-Center), tr (Top-Right)
 * - Left 계열: lt (Left-Top), lc (Left-Center), lb (Left-Bottom)
 * - Bottom 계열: bl (Bottom-Left), bc (Bottom-Center), br (Bottom-Right)
 * - Right 계열: rt (Right-Top), rc (Right-Center), rb (Right-Bottom)
 * - Center 계열: cc (Center-Center)
 * - Auto 계열: auto (자동 반전 및 최적 위치 계산)
 */
export class LayerPositionCalculator {
  /**
   * 앵커(버튼) 요소와 레이어(드롭다운 패널) 요소 간의 위치 계산
   * @param {HTMLElement} target 앵커/버튼 요소
   * @param {HTMLElement} layer 팝업/패널 요소
   * @param {Object} options placement, offset, autoFlip, teleportTarget 등
   */
  static computePosition(target, layer, options = {}) {
    if (!target || !layer) return { top: 0, left: 0, placement: "bl" };

    const defaults = {
      placement: "bl", // 14가지 위치 코드: tl, tc, tr, lt, lc, lb, bl, bc, br, rt, rc, rb, cc, auto
      offset: 4, // 앵커 간격 (px)
      autoFlip: false, // Viewport 이탈 시 자동 반전 여부
      teleportTo: "body", // 'body' | container HTMLElement | false (inline)
    };

    const config = { ...defaults, ...options };
    const targetRect = target.getBoundingClientRect();
    const layerRect = layer.getBoundingClientRect();

    // Teleport 위치에 따른 기준점 및 스크롤 계산
    let anchorTop = 0;
    let anchorBottom = 0;
    let anchorLeft = 0;
    let anchorRight = 0;
    let anchorWidth = targetRect.width;
    let anchorHeight = targetRect.height;

    const isTeleportedToBody =
      config.teleportTo === "body" ||
      config.teleportTo === document.body ||
      layer.parentElement === document.body ||
      layer.parentElement?.classList?.contains("area-dropdown");

    if (isTeleportedToBody) {
      // document.body 에 텔레포트 생성된 경우 (페이지 스크롤 절대좌표)
      anchorTop = targetRect.top + window.scrollY;
      anchorBottom = targetRect.bottom + window.scrollY;
      anchorLeft = targetRect.left + window.scrollX;
      anchorRight = targetRect.right + window.scrollX;
    } else if (config.teleportTo && config.teleportTo !== false && typeof config.teleportTo !== "string") {
      // 지정 영역 (특정 부모 컨테이너) 에 텔레포트 생성된 경우
      const containerRect = config.teleportTo.getBoundingClientRect();
      anchorTop = targetRect.top - containerRect.top + config.teleportTo.scrollTop;
      anchorBottom = targetRect.bottom - containerRect.top + config.teleportTo.scrollTop;
      anchorLeft = targetRect.left - containerRect.left + config.teleportTo.scrollLeft;
      anchorRight = targetRect.right - containerRect.left + config.teleportTo.scrollLeft;
    } else {
      // Inline / 부모 오프셋 기준 (relative parent)
      const parent = layer.offsetParent || target.offsetParent || document.body;
      const parentRect = parent.getBoundingClientRect();
      anchorTop = targetRect.top - parentRect.top;
      anchorBottom = targetRect.bottom - parentRect.top;
      anchorLeft = targetRect.left - parentRect.left;
      anchorRight = targetRect.right - parentRect.left;
    }

    // 코드 정규화 (e.g. 'bottom-start' -> 'bl', 'bottom-center' -> 'bc')
    let ps = this.normalizePlacement(config.placement);

    // Auto Flip 계산
    if (ps === "auto" || config.autoFlip) {
      const viewportHeight = window.innerHeight;
      if (targetRect.bottom + layerRect.height > viewportHeight && targetRect.top - layerRect.height > 0) {
        ps = "tl";
      } else {
        ps = "bl";
      }
    }

    const offset = config.offset;
    let top = 0;
    let left = 0;

    switch (ps) {
      // 1. Top 계열 (tl, tc, tr)
      case "tl":
        top = anchorTop - layerRect.height - offset;
        left = anchorLeft;
        break;
      case "tc":
        top = anchorTop - layerRect.height - offset;
        left = anchorLeft + (anchorWidth - layerRect.width) / 2;
        break;
      case "tr":
        top = anchorTop - layerRect.height - offset;
        left = anchorRight - layerRect.width;
        break;

      // 2. Left 계열 (lt, lc, lb)
      case "lt":
        top = anchorTop;
        left = anchorLeft - layerRect.width - offset;
        break;
      case "lc":
        top = anchorTop + (anchorHeight - layerRect.height) / 2;
        left = anchorLeft - layerRect.width - offset;
        break;
      case "lb":
        top = anchorBottom - layerRect.height;
        left = anchorLeft - layerRect.width - offset;
        break;

      // 3. Bottom 계열 (bl, bc, br)
      case "bl":
        top = anchorBottom + offset;
        left = anchorLeft;
        break;
      case "bc":
        top = anchorBottom + offset;
        left = anchorLeft + (anchorWidth - layerRect.width) / 2;
        break;
      case "br":
        top = anchorBottom + offset;
        left = anchorRight - layerRect.width;
        break;

      // 4. Right 계열 (rt, rc, rb)
      case "rt":
        top = anchorTop;
        left = anchorRight + offset;
        break;
      case "rc":
        top = anchorTop + (anchorHeight - layerRect.height) / 2;
        left = anchorRight + offset;
        break;
      case "rb":
        top = anchorBottom - layerRect.height;
        left = anchorRight + offset;
        break;

      // 5. Center 계열 (cc)
      case "cc":
        top = anchorTop + (anchorHeight - layerRect.height) / 2;
        left = anchorLeft + (anchorWidth - layerRect.width) / 2;
        break;

      default:
        top = anchorBottom + offset;
        left = anchorLeft;
    }

    return {
      top: Math.round(top),
      left: Math.round(left),
      placement: ps,
    };
  }

  /**
   * 위치 약어 정규화 (e.g. 'bottom-start' -> 'bl')
   */
  static normalizePlacement(ps) {
    if (!ps) return "bl";
    const map = {
      "top-start": "tl",
      "top": "tc",
      "top-center": "tc",
      "top-end": "tr",
      "top-right": "tr",
      "bottom-start": "bl",
      "bottom": "bc",
      "bottom-center": "bc",
      "bottom-end": "br",
      "bottom-right": "br",
      "left-start": "lt",
      "left": "lc",
      "left-center": "lc",
      "left-end": "lb",
      "right-start": "rt",
      "right": "rc",
      "right-center": "rc",
      "right-end": "rb",
      "center": "cc",
    };

    return map[ps] || ps;
  }
}

export default LayerPositionCalculator;
