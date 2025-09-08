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
import TimeSelect from './component/timeSelect.js';
import ListIA from './component/listIA.js';

import Roulette from './event/roulette.js';

import { loadContent, RadioAllcheck, dayOption, createOptions, getDeviceInfo, textLength } from './utils/utils.js';


console.log(
  '%c ',
  'font-size: 1px;' +
  'padding: 70px 200px;' +
  'background: url(../assets/img/logo_w.png) no-repeat 50% 50%;' + // 위치까지만 선언
  'background-size: 100%' // 크기만 별도로 선언
);


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

  #loadCommonLayout(data) {
    if (data.layout) {
      loadContent({
        area: document.querySelector('body'),
        src: data.layout,
        insert: true,
      })
      .then(() => {
        console.log('base-layout');
        const el_header = document.querySelector('.base-header');
        const el_footer = document.querySelector('.base-footer');
        const el_aside = document.querySelector('.base-aside');
        const el_main = document.querySelector('.base-main');
        
        if (el_header) {
          loadContent({
            area: el_header,
            src: './inc/header.html',
            insert: true,
          })
          .then(() => {
            console.log('base-header');
            const el_html = document.querySelector('html');
            UI.exe.toggle.header = new ToggleController();
            
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

            UI.exe.toggle.guideToggle = (v) => {
              if (v.state) {
                el_html.dataset.guide = 'on';
              } else {
                el_html.dataset.guide = 'off';
              }
            }

            const aniLandomArray = ['판다', '개구리', '백곰', '여우', '트로피컬', '돼지', '똥', '로봇', '말풍선', '병아리', '유령', '썬글라스'];
            const randomIndex = Math.floor(Math.random() * aniLandomArray.length); 

            document.querySelector('.ani').src = `../assets/img/${aniLandomArray[randomIndex]}.png`;
          })
          .catch((err) => console.error('Error loading header content:', err));
        }

        if (el_aside) {
          loadContent({
            area: el_aside,
            src: './inc/aside.html',
            insert: true,
          })
          .then(() => {
            console.log('base-aside');
          })
          .catch((err) => console.error('Error loading header content:', err));
        }

        if (el_main && data) {
          loadContent({
            area: el_main,
            src: data.page,
            insert: true,
          })
          .then(() => {
            console.log('base-main');
            data.callback();
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
            console.log('base-footer');
          })
          .catch((err) => console.error('Error loading footer content:', err));
        }
      })
      .catch((err) => console.error('Error loading layout content:', err));
    }
  }

  init(data) {
    this.#setupGlobalNamespace();
    this.#loadCommonLayout(data);
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
  TimeSelect,
  ListIA,

  init: (data) => uxInstance.init(data),
  utils: {
    loadContent,
    dayOption,
    createOptions,
    RadioAllcheck,
    textLength,
  },
};