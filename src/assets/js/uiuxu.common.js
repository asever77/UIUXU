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

import { loadContent, RadioAllcheck } from './utils/utils.js';

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

	init: () => {
    UX._setupGlobalNamespace();
    UI.exe.toggle.main = new UX.ToggleController();
    UX._loadCommonLayout();
  },

  _setupGlobalNamespace: () => {
    const global = 'UI';
    if (!window[global]) {
      window[global] = {};
    }
    const Global = window[global];

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
  },

  _loadCommonLayout: () => {
    // 헤더 로드
    if (document.querySelector('.base-header')) {
      loadContent({
        area: document.querySelector('.base-header'),
        src: './inc/header.html',
        insert: true,
      })
        .then(() => {
          UI.exe.toggle.header = new UX.ToggleController();
          // nav open
          // if (localStorage.getItem('nav-open') === 'true') {
          //   document.querySelectorAll('[data-toggle-target="nav"]').forEach(item => {
          //     item.dataset.toggleState = 'selected';
          //   });
          //   document.querySelector('[data-toggle-object="nav"]').dataset.toggleState = 'selected';
          // }
          UI.exe.toggle.nav = (v) => {
            // localStorage.setItem('nav-open', v.state);
          }
          // darkmode
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
					}
        })
        .catch((err) => console.error('Error loading header content:', err));
    }

    // 푸터 로드
    if (document.querySelector('.base-footer')) {
      loadContent({
        area: document.querySelector('.base-footer'),
        src: './inc/footer.html',
        insert: true,
      })
        .then(() => {
          console.log('Callback: Footer content loaded.');
        })
        .catch((err) => console.error('Error loading footer content:', err));
    }
  },

  utils: {
    loadContent,
  },
}

