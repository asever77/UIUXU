import Accordion from './component/accordion.js';
import ButtonSelection from './component/buttonSelection.js';
import Dialog from './component/dialog.js';
import Dropdown from './component/dropdown.js';
import Tab from './component/tab.js';
import Tooltip from './component/tooltip.js';
import WheelPicker from './libs/wheelPicker.js';

import Nav from './page/nav.js';


import { loadContent } from './utils/utils.js';

export const UX = {
	Accordion,
	ButtonSelection,
	Dialog,
	Dropdown,
	Tab,
	Tooltip,
	WheelPicker,

	init: () => {
		const global = 'UI';
		if (!window[global]) {
			window[global] = {};
		}
		const Global = window[global];

		Global.exe = {}	//실행용
		Global.dev = {} //개발용
		Global.pub = {} //퍼블용

		UX.header();
	},
	header: () => {
		//header
		if (document.querySelector('.base-header[data-type="nav"]')) {
			loadContent({
				area: document.querySelector('.base-header[data-type="nav"]'),
				src: './inc/header.html',
				insert: true
			})
			.then(() => {
				console.log('callback -- header');
				const el_header = document.querySelector('.base-header');
				
				const ManiNav = new Nav({
					id: 'main-nav'
				});
				ManiNav.init();

			})
			.catch(err => console.error('Error loading header content:', err));
		}
	},
	utils: {
		loadContent,
	}
}

