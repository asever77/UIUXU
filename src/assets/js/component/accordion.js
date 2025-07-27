import { slideUp, slideDown, ArrowNavigator } from '../utils/utils.js';

export default class Accordion {
  constructor(opt) {
    const defaults = {
      expanded: null,
      singleOpen: true,
    };

    this.option = { ...defaults, ...opt };
    this.id = this.option.id;
    this.expanded = this.option.expanded;
    this.singleOpen = this.option.singleOpen;
    this.boundHandleToggle = this.handleToggle.bind(this);
  }

  init() {
    this.acco = document.querySelector(`[data-accordion="${this.id}"]`);
    this.acco_items = this.acco.querySelectorAll(`[data-accordion-item="${this.id}"]`);
    this.acco_btns = this.acco.querySelectorAll(`[data-accordion-button="${this.id}"]`);

    this.acco_items.forEach((item, index) => {
      const btnID = this.id + '-' + index;
      const bodyID = this.id + '-body-' + index;
      const accoBtn = item.querySelector(`[data-accordion-button="${this.id}"]`);
      const accoTitle = item.querySelector(`[data-accordion-title="${this.id}"]`);
      const accoBody = item.querySelector(`[data-accordion-body="${this.id}"]`);

      accoBtn.setAttribute('aria-expanded', this.expanded === btnID ? 'true' : 'false');
      accoBtn.setAttribute('aria-controls', bodyID);
      if (accoTitle) {
        accoBtn.setAttribute('aria-label', accoTitle.textContent + ' 내용보기');
      }
      
      accoBtn.id =  btnID;
      accoBody.setAttribute('role', 'region');
      accoBody.setAttribute('aria-labelledby', btnID);
      accoBody.id =  bodyID;

      if (this.expanded === btnID) {
        accoBody.removeAttribute('hidden');
      } else {
        accoBody.setAttribute('hidden', '');
      }

      accoBtn.addEventListener('click', this.boundHandleToggle);
    });

    const keyNavigator = new ArrowNavigator({
      container: this.acco,
      foucsabledSelector: '[data-accordion-button="acco1"]',
      callback: (el, index) => {
        console.log(el, index)
      }
    });
  }

  handleToggle (e) {
    const _this = e.currentTarget;
    const isExpanded = _this.getAttribute('aria-expanded')
    const currentID = _this.id

    isExpanded === 'true' ? this.hide(currentID) : this.show(currentID);
  }

  show(id) {
    const accoBtn = document.querySelector(`#${id}`);
    const accoName = accoBtn.dataset.accordionButton;
    const accoItem = accoBtn.closest(`[data-accordion-item]`);
    const accoBody = document.querySelector(`[data-accordion-body][aria-labelledby="${id}"]`);
    
    if (this.singleOpen) {
      const accoBtns = document.querySelectorAll(`[data-accordion-button="${accoName}"][aria-expanded="true"]`);
      accoBtns.forEach(item => {
        item.setAttribute('aria-expanded', 'false');
        const _accoBody = document.querySelector(`[aria-labelledby="${item.id}"]`);
        slideUp(_accoBody, 300).then(() => {
          _accoBody.setAttribute('hidden', '');
          item.style.pointerEvents = "visible";
        });
      });
    }

    accoBtn.style.pointerEvents = "none";
    accoBtn.setAttribute('aria-expanded', 'true');
    accoBody.removeAttribute('hidden');
    slideDown(accoBody, 300).then(() => {
      accoBtn.style.pointerEvents = "visible";
    });
  }

  hide(id) {
    const accoBtn = document.querySelector(`#${id}`);
    const accoItem = accoBtn.closest(`[data-accordion-item]`);
    const accoBody = document.querySelector(`[data-accordion-body][aria-labelledby="${id}"]`);
    
    accoBtn.style.pointerEvents = "none";
    accoBtn.setAttribute('aria-expanded', 'false');
    slideUp(accoBody, 300).then(() => {
      accoBody.setAttribute('hidden', '');
      accoBtn.style.pointerEvents = "visible";
    });
  }
}