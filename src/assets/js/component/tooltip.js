import { LayerCore } from "../core/layerCore.js";
import { logger } from "../utils/logger.js";

/**
 * Tooltip Component (Refactored to use LayerCore engine)
 */
export default class Tooltip {
  constructor(data = []) {
    this.datas = data;
    this.instances = new Map();
    this.init();
  }

  init() {
    let container = document.querySelector(".area-tooltip");
    if (!container) {
      document.body.insertAdjacentHTML(
        "beforeend",
        '<div class="area-tooltip"></div>'
      );
      container = document.querySelector(".area-tooltip");
    }

    let html = "";
    this.datas.forEach((item) => {
      html += `<div role="tooltip" id="${item.id}" aria-hidden="true" class="ui-tooltip-panel" data-ui-layer="tooltip">
        <div data-tooltip-desc="${item.id}" data-ps="${item.ps || "top"}">
          ${item.cont}
          <button type="button" data-tooltip-close="${item.id}">닫기</button>
        </div>
      </div>`;
    });

    container.insertAdjacentHTML("beforeend", html);

    // Bind triggers & LayerCore
    this.datas.forEach((item) => {
      const trigger = document.querySelector(`[aria-describedby="${item.id}"]`);
      const panel = document.getElementById(item.id);

      if (panel) {
        const layerCore = new LayerCore({
          id: item.id,
          type: "tooltip",
          element: panel,
          target: trigger,
          placement: item.ps || "top",
          trigger: trigger ? "click" : "manual",
          zIndexGroup: "tooltip",
          closeOnOutsideClick: true,
        });

        const closeBtn = panel.querySelector(`[data-tooltip-close="${item.id}"]`);
        if (closeBtn) {
          closeBtn.addEventListener("click", () => layerCore.close());
        }

        this.instances.set(item.id, layerCore);
      }
    });

    logger.debug(`Initialized ${this.instances.size} Tooltip instances with LayerCore`, null, "Tooltip");
  }

  showById(id) {
    const instance = this.instances.get(id);
    if (instance) {
      instance.open();
    }
  }

  hideById(id) {
    const instance = this.instances.get(id);
    if (instance) {
      instance.close();
    }
  }

  destroy() {
    this.instances.forEach((instance) => instance.destroy());
    this.instances.clear();
  }
}