export default class Dropdown {
  constructor(opt) {
    const defaults = {
      ps: null, // 'top', 'bottom', null
    };

    this.option = { ...defaults, ...opt };
    this.id = this.option.id;
    this.ps = this.option.ps;
    this.callback = this.option.callback;
    this.wrap = document.querySelector(`[data-dropdown="${this.id}"]`);
    this.button = this.wrap.querySelector(`[data-dropdown-button="${this.id}"]`);
    this.text = this.button.querySelector(`[data-dropdown-text="${this.id}"]`);
    this.panel = document.querySelector(`[data-dropdown-panel="${this.id}"]`);
    this.html = document.querySelector('html');
    this.boundHandleOutsideClick = this.handleOutsideClick.bind(this);
    this.isArea = this.wrap.querySelector('[data-dropdown-panel');

    this.init();
  }

  init() {
    //setting
    this.text.dataset.dropdownText = this.id;
    this.button.dataset.dropdownButton = this.id;
    this.button.setAttribute('aria-controls', this.id);
    this.button.setAttribute('aria-expanded', false);
    this.panel.dataset.dropdownPanel = this.id;
    this.panel.setAttribute('aria-hidden', true);
    this.panel.setAttribute('tabindex', '-1');
    this.panel.id = this.id;
    this.button.addEventListener('click', this.handleToggle);
    this.callback && this.callback();
  }

  handleOutsideClick = (e) => {
    if (!(e.target.dataset.dropdown || e.target.closest('[data-dropdown]'))) {
      this.hide();
    }
  }

  handleToggle = (e) => {
    const _this = e.currentTarget;
    const isExpanded = _this.getAttribute('aria-expanded');
    const _name = _this.dataset.dropdownButton;
    
    this.panel = document.querySelector(`[data-dropdown-panel="${_name}"]`);
    isExpanded === 'false' ? this.show() : this.hide();
  }

  show() {
    this.button.setAttribute('aria-expanded', true);
    this.panel.setAttribute('aria-hidden', false);
    this.panel.focus();
    const rect = this.button.getBoundingClientRect();
    const win_h = window.innerHeight / 1.5;
    const scroll_t = document.documentElement.scrollTop;
    this.panel.style.height = rect.height + 'px';

    console.log(rect)

    if (this.ps) {
      this.panel.dataset.ps = this.ps;
    } else {
      this.panel.dataset.ps = (win_h < rect.y) ? 'bottom' : 'top';
    }

    if (!this.isArea) {
      this.panel.style.width = rect.width + 'px';
      this.panel.style.left = rect.x + 'px';
      this.panel.style.top = (rect.y + scroll_t) + 'px';
    } 

    this.html.addEventListener('click', this.boundHandleOutsideClick);
  }
  
  hide() {
    this.html.removeEventListener('click', this.boundHandleOutsideClick);
    this.button.setAttribute('aria-expanded', false);
    this.panel.setAttribute('aria-hidden', true);
    this.button.focus();
  }
}