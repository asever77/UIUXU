import Accordion from "./component/accordion.js";
import ButtonSelection from "./component/buttonSelection.js";
import Dialog from "./component/dialog.js";
import Dropdown from "./component/dropdown.js";
import Tab from "./component/tab.js";
import Tooltip from "./component/tooltip.js";
import ToggleController from "./component/toggleController.js";
import RangeSlider from "./component/rangeSlider.js";
import ScrollEvent from "./component/scrollEvent.js";
import Drag from "./component/drag.js";
import Countdown from "./component/countdown.js";
import ChartBubble from "./component/chart_bubble.js";
import TimeSelect from "./component/timeSelect.js";
import ListIA from "./component/listIA.js";
import WheelPicker from "./component/wheelPicker.js";
import Roulette from "./component/roulette.js";

import {
  loadContent,
  RadioAllcheck,
  dayOption,
  createOptions,
  getDeviceInfo,
  textLength,
} from "./utils/utils.js";
import { logger } from "./utils/logger.js";
import { setupGlobalErrorHandler, ErrorHandler } from "./utils/errors.js";

// 전역 에러 핸들러 설정
setupGlobalErrorHandler();

console.log(
  "%c ",
  "padding:8px 176px; margin:10px 0; background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALAAAAAYCAYAAABa+HfdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMFSURBVHgB7ZrfjdpAEMYHeOEBJCgABTq4VBCng3QQ0gEd4KskdHDXAb4K7lIBjhDwaCSQEDwwmTkbyUFrdn2MV16ff9Iexruez3w3tvYfAIGIQypzKhHGPPE5+ACSscpI7ZUZ1nxKKi8VaaK8gpKxykjtlRlWfaI/z5jNPKeYWKwyUntlhlWf8DZRTjGxWDk0J1QWicYrlTEUhOte2cKqT5oGKCiWK5ah3jhDagIFIPn7JGOVDZs+NXQBGwQYIhnLUO+VPh4UVSFJjUAY17xaLpdes9n0+Ph0Os1Go1GY0ufz7F2PyozkQhDCpk+uv4Gtaen0yubVarWartdrTBc+l2hPFZJTEELyt+liuf4GRltaOr28mkV6xW/eVqulHCz1+/2g3W57GZd+J9kA7sSmT02oqRyXbsM1nU4HbiQvc6uulNQJ/Eng5O12u1A16gSuIOfzOUh/z5G8M3CMOoEryGAwCKjr+MjHOZL3UXImwhqop2cYp6cLBMLY1NLpldGrw+EwRwO4HQhiICnmE7+B/2riPIAZunZbcB9nvKL/7VQzYHtnv99DFEXeZYpNCGs+cQIvNI1+ghljTf0fcB8nvMJ4w4yva8fJu9vt3o+p++Dz9BvIYM0nTuAXXRAy5KYgxpPgupsKwH1c8Wqsa5BO3guUxKZvRh3WfOIEfgY9Mwr4G6+2wtF3j8oTGDzt4OAIV0ElvFIlL0MJbNQ3NcCaT43kIu7Ee2BGmDoeghm81v4LhKH7Dunji6LqjfS+QgG44BXG+xyUAzMasL1st9tvqrrj8ThK75e48x7s+YTZm4YlKGyDNsZbKVWMoSBc8Yri+Ir4PtfRgM1X7JPwQRDrPmH21sR7KWRr49V9vyVaYdF6Kc3Se4VxEnEi84Pupes2m80wSeQJHXtQANZ9QvVTKy9UAWqvzLDuE8ad6AXexwKvnvgqUntlhnWfMF4B8TG/aJRcJzWaLT21V2YU5ZN2XyZd+APi0STPEQ7h/1E/r7jwqlEA8dQJj/6rsOL2IWqvzJD06R/mRBQ7GVNLKQAAAABJRU5ErkJggg==) no-repeat 0% 0%; background-size:"
);

class UXCore {
  #setupGlobalNamespace() {
    const global = "UI";
    if (!window[global]) {
      window[global] = {};
    }
    const Global = window[global];
    const info = getDeviceInfo();

    Global.info = {
      touch: info.touch,
      device: info.device,
      app: info.app,
      os: info.os,
    };
    Global.exe = {
      dropdown: {},
      modal: {},
      tab: {},
      acco: {},
      toggle: {},
      tooltip: {},
    };
    Global.dev = {};
    Global.pub = {};

    const htmlElement = document.querySelector("html");
    if (htmlElement) {
      htmlElement.dataset.touch = info.touch;
      htmlElement.dataset.device = info.device;
      htmlElement.dataset.app = info.app;
      htmlElement.dataset.os = info.os;
    }
  }

  async #loadIncFiles() {
    const el_header = document.querySelector(".base-header");
    const el_aside = document.querySelector(".base-aside");
    const el_footer = document.querySelector(".base-footer");

    const promises = [];

    if (el_header && el_header.children.length === 0) {
      promises.push(
        loadContent({
          area: el_header,
          src: "./inc/header.html",
          insert: true,
        })
          .then(() => {
            const el_html = document.querySelector("html");

            if (localStorage.getItem("dark-mode")) {
              el_html.dataset.mode = localStorage.getItem("dark-mode");
            }

            const modeChangeCallback = () => {
              const currentMode = localStorage.getItem("dark-mode");
              const newMode = currentMode === "dark" ? "light" : "dark";
              el_html.dataset.mode = newMode;
              localStorage.setItem("dark-mode", newMode);
            };

            const guideToggleCallback = (v) => {
              el_html.dataset.guide = v.state ? "on" : "off";
            };

            UI.exe.toggle.header = new ToggleController({
              area: document.querySelector(".base-header"),
              callbacks: {
                guideToggle: guideToggleCallback,
                modeChange: modeChangeCallback,
                nav: () => {},
              },
            });

            const aniLandomArray = [
              "판다", "개구리", "백곰", "여우", "트로피컬",
              "돼지", "똥", "로봇", "말풍선", "병아리", "유령", "썬글라스",
            ];
            const randomIndex = Math.floor(
              Math.random() * aniLandomArray.length
            );
            const aniEl = document.querySelector(".ani");
            if (aniEl) {
              aniEl.src = `../assets/img/${aniLandomArray[randomIndex]}.png`;
            }
          })
          .catch((err) => logger.error("Error loading header", err, "UXCore"))
      );
    }

    if (el_aside && el_aside.children.length === 0) {
      promises.push(
        loadContent({
          area: el_aside,
          src: "./inc/aside.html",
          insert: true,
        }).catch((err) => logger.error("Error loading aside", err, "UXCore"))
      );
    }

    if (el_footer && el_footer.children.length === 0) {
      promises.push(
        loadContent({
          area: el_footer,
          src: "./inc/footer.html",
          insert: true,
        }).catch((err) => logger.error("Error loading footer", err, "UXCore"))
      );
    }

    await Promise.all(promises);
  }

  async init(data = {}) {
    this.#setupGlobalNamespace();
    await this.#loadIncFiles();
    initAutoComponents(document);
    startAutoObserver();
    if (data && typeof data.callback === "function") {
      data.callback();
    }
  }
}

let autoObserver = null;

export async function initAutoComponents(container = document) {
  const root = container && container.querySelectorAll ? container : document;

  // 1. Accordion
  const accoEls = root.querySelectorAll
    ? root.querySelectorAll('[data-ui="accordion"]')
    : [];
  if (accoEls.length > 0) {
    accoEls.forEach((el) => {
      if (el.dataset.autoInitialized === "true") return;
      const id = el.dataset.accordion || el.dataset.id || el.id;
      if (id) {
        const singleOpen = el.dataset.singleOpen !== "false";
        const instance = new Accordion({ id, singleOpen });
        instance.init();
        el.dataset.autoInitialized = "true";
      }
    });
  }

  // 2. Dropdown
  const dropEls = root.querySelectorAll
    ? root.querySelectorAll('[data-ui="dropdown"]')
    : [];
  if (dropEls.length > 0) {
    dropEls.forEach((el) => {
      if (el.dataset.autoInitialized === "true") return;
      const id = el.dataset.dropdown || el.dataset.id || el.id;
      if (id) {
        const instance = new Dropdown({ id });
        instance.init();
        el.dataset.autoInitialized = "true";
      }
    });
  }

  // 3. Tab
  const tabEls = root.querySelectorAll
    ? root.querySelectorAll('[data-ui="tab"]')
    : [];
  if (tabEls.length > 0) {
    tabEls.forEach((el) => {
      if (el.dataset.autoInitialized === "true") return;
      const id = el.dataset.tab || el.dataset.id || el.id;
      if (id) {
        const instance = new Tab({ id, renderMode: "static" });
        instance.init();
        el.dataset.autoInitialized = "true";
      }
    });
  }

  // 4. Tooltip
  const tooltipEls = root.querySelectorAll
    ? root.querySelectorAll('[data-ui="tooltip"]')
    : [];
  if (tooltipEls.length > 0) {
    tooltipEls.forEach((el) => {
      if (el.dataset.autoInitialized === "true") return;
      const id = el.dataset.tooltip || el.dataset.id || el.id;
      if (id) {
        const instance = new Tooltip({ id });
        instance.init();
        el.dataset.autoInitialized = "true";
      }
    });
  }
}

export function startAutoObserver() {
  if (autoObserver || typeof MutationObserver === "undefined") return;

  autoObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          initAutoComponents(node);
        }
      });
    });
  });

  if (document.body) {
    autoObserver.observe(document.body, { childList: true, subtree: true });
  }
}

export function stopAutoObserver() {
  if (autoObserver) {
    autoObserver.disconnect();
    autoObserver = null;
  }
}

const uxInstance = new UXCore();

export const UX = {
  Accordion,
  ButtonSelection,
  Drag,
  Dialog,
  Dropdown,
  Tab,
  Tooltip,
  WheelPicker,
  RadioAllcheck,
  ToggleController,
  RangeSlider,
  ScrollEvent,
  Countdown,
  ChartBubble,
  Roulette,
  TimeSelect,
  ListIA,

  initAutoComponents,
  startAutoObserver,
  stopAutoObserver,
  init: (data) => uxInstance.init(data),
  utils: {
    loadContent,
    dayOption,
    createOptions,
    RadioAllcheck,
    textLength,
  },
};
