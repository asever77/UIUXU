import Accordion from './component/accordion.js';
import ButtonSelection from './component/buttonSelection.js';
import Dialog from './component/dialog.js';
import Dropdown from './component/dropdown.js';
import Tab from './component/tab.js';
import Tooltip from './component/tooltip.js';
import WheelPicker from './libs/wheelPicker.js';
import ToggleController from './component/toggleController.js';
import RangeSlider from './component/range.js';
import ScrollEvent from './component/scrollEvent.js';
import Drag from './component/drag.js';
import Countdown from './component/countdown.js';
import ChartBubble from './component/chart_bubble.js';

import Roulette from './event/roulette.js';

import { loadContent, RadioAllcheck, dayOption, createOptions, getDeviceInfo } from './utils/utils.js';

class UXCore {
  #setupGlobalNamespace() {
    const global = 'UI';
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

    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      htmlElement.dataset.touch = info.touch;
      htmlElement.dataset.device = info.device;
      htmlElement.dataset.app = info.app;
      htmlElement.dataset.os = info.os;
    }
  }

  #loadCommonLayout() {
    const el_header = document.querySelector('.base-header');
    const el_footer = document.querySelector('.base-footer');
    
    if (el_header) {
      loadContent({
        area: el_header,
        src: './inc/header.html',
        insert: true,
      })
      .then(() => {
        UI.exe.toggle.header = new ToggleController();

        const el_html = document.querySelector('html');
        if (localStorage.getItem('dark-mode')) {
          el_html.dataset.mode = localStorage.getItem('dark-mode');
        }
        UI.exe.toggle.modeChange = (v) => {
          if (localStorage.getItem('dark-mode') === 'dark') {
            el_html.dataset.mode = 'light';
          } else {
            el_html.dataset.mode = 'dark';
          }
          localStorage.setItem('dark-mode', el_html.dataset.mode);
        };
      })
      .catch((err) => console.error('Error loading header content:', err));
    }

    if (el_footer) {
      loadContent({
        area: el_footer,
        src: './inc/footer.html',
        insert: true,
      })
      .then(() => {
        console.log('Callback: Footer content loaded.');
      })
      .catch((err) => console.error('Error loading footer content:', err));
    }
  }

  init() {
    this.#setupGlobalNamespace();
    this.#loadCommonLayout();
    UI.exe.toggle.main = new ToggleController();
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

  init: () => uxInstance.init(),

  utils: {
    loadContent,
    dayOption,
    createOptions,
    RadioAllcheck,
  },
};