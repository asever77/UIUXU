import { ArrowNavigator } from '../utils/utils.js';

export default class ButtonSelection {
   constructor(opt) {
    const defaults = {
      data: null,
      type: 'radio', //radio, checkbox
      callback: null,
    }
    this.option = { ...defaults, ...opt };
    this.selection = document.querySelector(`[data-selection="${this.option.id}"]`);
    this.data = this.option.data;
    this.label = this.option.label;
    this.type = this.option.type;
    this.item = null;
    this.callback = this.option.callback;
    this.init();
  }

  init() {
    let buttonTag = ``;
    this.selection.setAttribute('aria-label', this.label);
    this.selection.setAttribute('role', this.type === 'radio' ? 'radiogroup' : 'group');
    if (this.data !== null) {
      this.data.forEach(item => {
        if (this.type === 'radio') {
          buttonTag += `<button type="button" data-selection-item="${this.option.id}" role="radio" data-value="${item.value}" aria-checked="${item.checked}"><span>${item.text}</span></button>`;
        } else {
          buttonTag += `<button type="button" data-selection-item="${this.option.id}" role="checkbox" data-value="${item.value}" aria-checked="${item.checked}"><span>${item.text}</span></button>`;
        }
      });
      this.selection.innerHTML = buttonTag;
    }

    this.item = this.selection.querySelectorAll('[data-selection-item]');
    this.item.forEach(item => {
      item.addEventListener('click', this.updateSelection.bind(this));
			item.setAttribute('tabindex', (item.getAttribute('aria-checked') === 'true' || this.type === 'checkbox') ? '0' : '-1');
    });

    const keyNavigator = new ArrowNavigator({
      container: this.selection,
      foucsabledSelector: '[data-selection-item]',
      callback: (el, index) => {
        console.log(el, index)
        this.moveKey(el);
      }
    });
  } 

  updateSelection = (e) => {
    const _this = e.currentTarget;
		const wrap = _this.closest('[data-selection]');
    const thisValue = _this.dataset.value;
    const selected = wrap.querySelector('[data-selection-item][aria-checked="true"]');

    if (this.type === 'radio') {
      selected.setAttribute('aria-checked', false);
      selected.setAttribute('tabindex', '-1');
      _this.setAttribute('aria-checked', true);
      _this.setAttribute('tabindex', '0');
    } 
    if (this.type === 'checkbox') {
      if (_this.getAttribute('aria-checked') === 'true') {
        _this.setAttribute('aria-checked', false);
      } else {
        _this.setAttribute('aria-checked', true);
      }
    }
    
    this.callback && this.callback(_this, thisValue);
  }

	moveKey = (radio) => {
    const wrap = radio.closest('[data-selection]');
		const _radios = wrap.querySelectorAll('[data-selection-item]');
		_radios.forEach(item => {
			item.setAttribute('tabindex', '-1');
		});
		radio.setAttribute('tabindex', '0');
		radio.focus();
  }
}