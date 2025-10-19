import Accordion from './component/accordion.js';
import ButtonSelection from './component/buttonSelection.js';
import Dialog from './component/dialog.js';
import Dropdown from './component/dropdown.js';
import Tab from './component/tab.js';
import Tooltip from './component/tooltip.js';
import WheelPicker from './libs/wheelPicker.js';
import ToggleController from './component/toggleController.js';
import RangeSlider from './component/rangeSlider.js';
import ScrollEvent from './component/scrollEvent.js';
import Drag from './component/drag.js';
import Countdown from './component/countdown.js';
import ChartBubble from './component/chart_bubble.js';
import TimeSelect from './component/timeSelect.js';
import ListIA from './component/listIA.js';

import Roulette from './event/roulette.js';

import { loadContent, RadioAllcheck, dayOption, createOptions, getDeviceInfo, textLength } from './utils/utils.js';
import { logger } from './utils/logger.js';
import { setupGlobalErrorHandler, ErrorHandler } from './utils/errors.js';

// 전역 에러 핸들러 설정
setupGlobalErrorHandler();

console.log(
  '%c ',
  'padding:8px 176px; margin:10px 0; background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALAAAAAYCAYAAABa+HfdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMFSURBVHgB7ZrfjdpAEMYHeOEBJCgABTq4VBCng3QQ0gEd4KskdHDXAb4K7lIBjhDwaCSQEDwwmTkbyUFrdn2MV16ff9Iexruez3w3tvYfAIGIQypzKhHGPPE5+ACSscpI7ZUZ1nxKKi8VaaK8gpKxykjtlRlWfaI/z5jNPKeYWKwyUntlhlWf8DZRTjGxWDk0J1QWicYrlTEUhOte2cKqT5oGKCiWK5ah3jhDagIFIPn7JGOVDZs+NXQBGwQYIhnLUO+VPh4UVSFJjUAY17xaLpdes9n0+Ph0Os1Go1GY0ufz7F2PyozkQhDCpk+uv4Gtaen0yubVarWartdrTBc+l2hPFZJTEELyt+liuf4GRltaOr28mkV6xW/eVqulHCz1+/2g3W57GZd+J9kA7sSmT02oqRyXbsM1nU4HbiQvc6uulNQJ/Eng5O12u1A16gSuIOfzOUh/z5G8M3CMOoEryGAwCKjr+MjHOZL3UXImwhqop2cYp6cLBMLY1NLpldGrw+EwRwO4HQhiICnmE7+B/2riPIAZunZbcB9nvKL/7VQzYHtnv99DFEXeZYpNCGs+cQIvNI1+ghljTf0fcB8nvMJ4w4yva8fJu9vt3o+p++Dz9BvIYM0nTuAXXRAy5KYgxpPgupsKwH1c8Wqsa5BO3guUxKZvRh3WfOIEfgY9Mwr4G6+2wtF3j8oTGDzt4OAIV0ElvFIlL0MJbNQ3NcCaT43kIu7Ee2BGmDoeghm81v4LhKH7Dunji6LqjfS+QgG44BXG+xyUAzMasL1st9tvqrrj8ThK75e48x7s+YTZm4YlKGyDNsZbKVWMoSBc8Yri+Ir4PtfRgM1X7JPwQRDrPmH21sR7KWRr49V9vyVaYdF6Kc3Se4VxEnEi84Pupes2m80wSeQJHXtQANZ9QvVTKy9UAWqvzLDuE8ad6AXexwKvnvgqUntlhnWfMF4B8TG/aJRcJzWaLT21V2YU5ZN2XyZd+APi0STPEQ7h/1E/r7jwqlEA8dQJj/6rsOL2IWqvzJD06R/mRBQ7GVNLKQAAAABJRU5ErkJggg==) no-repeat 0% 0%; background-size:'
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
            const el_html = document.querySelector('html');

            // 다크모드 초기 상태 설정
            if (localStorage.getItem('dark-mode')) {
              el_html.dataset.mode = localStorage.getItem('dark-mode');
            }

            // ToggleController에 전달할 콜백 함수들 정의
            const modeChangeCallback = (v) => {
              if (localStorage.getItem('dark-mode') === 'dark') {
                el_html.dataset.mode = 'light';
              } else {
                el_html.dataset.mode = 'dark';
              }
              localStorage.setItem('dark-mode', el_html.dataset.mode);
            };

            const guideToggleCallback = (v) => {
              if (v.state) {
                el_html.dataset.guide = 'on';
              } else {
                el_html.dataset.guide = 'off';
              }
            };

            // 헤더의 토글 버튼들을 위한 ToggleController 인스턴스 생성
            UI.exe.toggle.header = new ToggleController({
              area: document.querySelector('.base-header'), // 범위를 헤더로 한정
              callbacks: {
                guideToggle: guideToggleCallback,
                modeChange: modeChangeCallback,
                nav: () => { /* 네비게이션 토글 시 추가 동작이 필요하면 여기에 작성 */ }
              }
            });

            const aniLandomArray = ['판다', '개구리', '백곰', '여우', '트로피컬', '돼지', '똥', '로봇', '말풍선', '병아리', '유령', '썬글라스'];
            const randomIndex = Math.floor(Math.random() * aniLandomArray.length); 

            document.querySelector('.ani').src = `../assets/img/${aniLandomArray[randomIndex]}.png`;
          })
          .catch((err) => logger.error('Error loading header content', err, 'UXCore'));
        }

        if (el_aside) {
          loadContent({
            area: el_aside,
            src: './inc/aside.html',
            insert: true,
          })
          .then(() => {
          })
          .catch((err) => logger.error('Error loading aside content', err, 'UXCore'));
        }

        if (el_main && data) {
          loadContent({
            area: el_main,
            src: data.page,
            insert: true,
          })
          .then(() => {
            data.callback();

            setTimeout(() => {
              const wraps = document.querySelectorAll('.base-content > .base-wrap:not([data-grid="display-title"])');
              let wrapTopArray = [];
              const checkArray = () => {
                wrapTopArray = [];
                wraps.forEach(item => {
                  wrapTopArray.push(item.getBoundingClientRect().top + document.documentElement.scrollTop - 94);
                });
              }
              checkArray();
              const getCurrentSection = (scrollY) => {
                const index = wrapTopArray.findIndex((pos, i) => {
                  const next = wrapTopArray[i + 1] ?? Infinity; 
                  return scrollY >= pos && scrollY < next;
                });
                return index; 
              };
              
              window.addEventListener('scroll', () => {
                const y = window.scrollY;
                const idx = getCurrentSection(y);
                checkArray();
                if (idx !== -1) {
                  document.querySelector('.aside-inner--wrap').dataset.index = idx;
                }
              });
            }, 100);
          })
          .catch((err) => logger.error('Error loading main content', err, 'UXCore'));
        }

        if (el_footer) {
          loadContent({
            area: el_footer,
            src: './inc/footer.html',
            insert: true,
          })
          .then(() => {
          })
          .catch((err) => logger.error('Error loading footer content', err, 'UXCore'));
        }
      })
      .catch((err) => logger.error('Error loading layout content', err, 'UXCore'));
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