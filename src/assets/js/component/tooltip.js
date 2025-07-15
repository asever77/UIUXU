import { FocusTrap } from '../utils/utils.js';
export default class Tooltip {
	constructor(selector) {
		this.tooltips = document.querySelectorAll(selector);
		this.html = document.querySelector('html');
		this.activeTooltip = null;
		this.isOpen = false;
		this.boundOutsideClick = this.handleOutsideClick.bind(this);
		this.init();
	}

	init() {
		this.tooltips.forEach(item => {
			item.removeEventListener('click', this.show.bind(this));
			item.addEventListener('click', this.show.bind(this));
		});
	}

	handleOutsideClick(e) {
		if (
			this.activeTooltip &&
			!e.target.closest('[role="tooltip"]') &&
			!e.target.closest('[data-tooltip="click"]')
		) {
			this.hideTooltip();
		}
	}

	hideTooltip() {
		if (!this.activeTooltip) return;
    console.log(this.activeTooltip.id)
		this.activeTooltip.setAttribute('aria-hidden', 'true');
		this.html.removeEventListener('click', this.boundOutsideClick);
    document.querySelector(`[aria-describedby="${this.activeTooltip.id}"]`).focus();
		this.isOpen = false;
		this.activeTooltip = null;
	}

	show(e) {
		e.preventDefault();

    const opened = document.querySelector('[role="tooltip"][aria-hidden="false"]');
    if (opened) {
      opened.setAttribute('aria-hidden', 'true');
    }

		const target = e.currentTarget;
		const id = target.getAttribute('aria-describedby');
		const tooltip = document.querySelector(`#${id}`);
		const close = tooltip.querySelector('[data-tooltip-close]');

		if (this.isOpen && this.activeTooltip === tooltip) {
			this.hideTooltip();
			return;
		}

		const rect = target.getBoundingClientRect();
		const scrollTop = document.documentElement.scrollTop;

		tooltip.style.left = `${rect.x}px`;
		tooltip.style.top = `${(rect.y + scrollTop)}px`;
		tooltip.style.height = `${rect.height}px`;
		tooltip.style.width = `${rect.width}px`;
		tooltip.setAttribute('aria-hidden', 'false');
		tooltip.setAttribute('tabindex', '-1');
		tooltip.focus();

		this.activeTooltip = tooltip;
		this.isOpen = true;

		close.removeEventListener('click', this.hideTooltip.bind(this));
		close.addEventListener('click', this.hideTooltip.bind(this));

		this.html.removeEventListener('click', this.boundOutsideClick);
		this.html.addEventListener('click', this.boundOutsideClick);

		const trap = new FocusTrap(tooltip);
	}
}
