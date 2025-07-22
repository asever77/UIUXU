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

import { DROPDOWN_VERSION } from "./config/versions.js";

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
		console.groupCollapsed(`%cdropdown %c${DROPDOWN_VERSION.ver}`, 'color: gold; font-weight: normal;', 'color: white; font-weight: bold;'); // 기본적으로 접힌 상태
		DROPDOWN_VERSION.history.forEach(item => {
			console.log(`ver: ${item.ver} \ndate: ${item.date} \ndescription: ${item.description}`);
		});
		console.log(`author: ${item.author}`)
		console.log(`license: ${item.license}`)
		console.groupEnd();


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
		}	//실행용
		Global.dev = {} //개발용
		Global.pub = {} //퍼블용

		UX.header();
		const toggleController = new UX.ToggleController();
	},
	header: () => {
		//header
		if (document.querySelector('.base-header')) {
			loadContent({
				area: document.querySelector('.base-header'),
				src: './inc/header.html',
				insert: true
			})
			.then(() => {
				console.log('callback -- header');
			})
			.catch(err => console.error('Error loading header content:', err));
		}
	},
	utils: {
		loadContent,
	}
}

