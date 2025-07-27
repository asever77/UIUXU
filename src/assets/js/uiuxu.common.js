import Accordion from './component/accordion.js';
import ButtonSelection from './component/buttonSelection.js';
import Dialog from './component/dialog.js';
import Dropdown from './component/dropdown.js';
import Tab from './component/tab.js';
import Tooltip from './component/tooltip.js';
import WheelPicker from './libs/wheelPicker.js';
import ToggleController from './component/toggleController.js';
import RangeSlider from './component/range.js';

import { loadContent, RadioAllcheck } from './utils/utils.js';

export const UX = {
	Accordion,
	ButtonSelection,
	Dialog,
	Dropdown,
	Tab,
	Tooltip,
	WheelPicker,
	RadioAllcheck,
	ToggleController,
	RangeSlider,

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
          console.log('Callback: Header content loaded.');

          UI.exe.toggle.header = new UX.ToggleController();
					UI.exe.toggle.modeChange = (v) => {
						console.log(v,document.html)
						document.querySelector('html').dataset.mode = v.state ? 'dark' : 'light';
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

