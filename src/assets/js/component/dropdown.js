import { LayerCore } from "../core/layerCore.js";
import { loadContent } from "../utils/utils.js";
import { logger } from "../utils/logger.js";

/**
 * Dropdown Component (Refactored to use LayerCore engine)
 * 14가지 위치 지원: tl, tc, tr, lt, lc, lb, bl, bc, br, rt, rc, rb, cc, auto
 * Teleport 지원: 'body' | HTMLElement | false (inline)
 */
export default class Dropdown {
  constructor(opt = {}) {
    const defaults = {
      id: null,
      area: document.querySelector('.area-dropdown[data-area="body"]'),
      src: null,
      ps: "bl", // 14가지 위치 코드
      teleportTo: "body",
      autoFocus: true,
      returnFocus: true,
      srcCallback: null,
      callback: null,
    };

    this.option = { ...defaults, ...opt };
    this.id = this.option.id;
    this._ps = this.option.ps;
    this.area = this.option.area;
    this.src = this.option.src;
    this.teleportTo = this.option.teleportTo;
    this.callback = this.option.callback;
    this.srcCallback = this.option.srcCallback;

    this.wrap = document.querySelector(`[data-dropdown="${this.id}"]`);
    this.button = this.wrap
      ? this.wrap.querySelector(`[data-dropdown-button="${this.id}"]`)
      : null;
    this.panel = document.querySelector(`[data-dropdown-panel="${this.id}"]`);

    this.layerCore = null;
    this.init();
  }

  get ps() {
    return this._ps;
  }

  set ps(value) {
    this._ps = value;
    if (this.layerCore) {
      this.layerCore.options.placement = value;
      if (this.layerCore.isOpen) {
        this.layerCore.updatePosition();
      }
    }
  }

  init() {
    if (!this.wrap && !this.panel) return false;

    if (this.src) {
      loadContent({
        area: this.area || document.body,
        src: this.src,
        insert: true,
      })
        .then(() => {
          this.panel = document.querySelector(`[data-dropdown-panel="${this.id}"]`);
          this.setupCore();
          this.srcCallback && this.srcCallback();
        })
        .catch((err) => logger.error("Error loading dropdown content:", err, "Dropdown"));
    } else {
      this.setupCore();
    }

    this.callback && this.callback();
  }

  setupCore() {
    if (!this.panel) {
      this.panel = document.querySelector(`[data-dropdown-panel="${this.id}"]`);
    }
    if (!this.button && this.wrap) {
      this.button = this.wrap.querySelector(`[data-dropdown-button="${this.id}"]`);
    }

    this.layerCore = new LayerCore({
      id: this.id,
      type: "dropdown",
      element: this.panel,
      target: this.button,
      placement: this._ps || "bl",
      trigger: "click",
      zIndexGroup: "dropdown",
      teleportTo: this.teleportTo,
      autoFocus: this.option.autoFocus,
      returnFocus: this.option.returnFocus,
    });
  }

  show() {
    if (this.layerCore) {
      this.layerCore.open();
    }
  }

  hide() {
    if (this.layerCore) {
      this.layerCore.close();
    }
  }

  toggle() {
    if (this.layerCore) {
      this.layerCore.toggle();
    }
  }

  destroy() {
    if (this.layerCore) {
      this.layerCore.destroy();
      this.layerCore = null;
    }
    logger.debug(`Dropdown destroyed [${this.id}]`, null, "Dropdown");
  }
}
