import { loadContent, ArrowNavigator, SmoothScroller } from '../utils/utils.js';

export default class Tab {
  constructor(opt) {
		const defaults = {
			renderMode: 'static', 
      group: false,
      selected: 1,
			data: [], 
      callback: null,
		};

		this.option = { ...defaults, ...opt };
    this.renderMode = this.option.renderMode;
    this.data = this.option.data;
    this.id = this.option.id;
    this.group = this.option.group;
    this.selected = this.option.selected;

    this.el_tab = null;
    this.el_wrap = null;
    this.el_tabBtns = null;
    this.el_tabPnls = null;

    this.smoothScroll = null;

    if (this.el_tab) {
      // this.init();
    } 
  }

  init() {
    this.el_tab = document.querySelector(`[data-tab="${this.id}"]`);
    this.el_tabList = this.el_tab.querySelector(`[role="tablist"]`);
    this.el_tabButton = this.el_tab.querySelectorAll(`[role="tab"]`);
    this.el_wrap = document.querySelector(`[data-tab-wrap="${this.id}"]`);

    if (this.el_tab.dataset.load === 'true') return false;

    this.el_tab.dataset.load = true;
    let tabpanel_html = ``;

    this.el_tabButton.forEach((item, index) => {
      const n = index + 1;
      const isSelected = this.selected === n;
      item.setAttribute('id', `${this.id}-id-${n}`);
      item.setAttribute('aria-controls', `${this.id}-panel-${n}`);
      item.setAttribute('aria-selected', `${isSelected}`);
      item.setAttribute('tabindex', `${isSelected ? '0' : '-1'}`);
      item.dataset.tabName = this.id;
      item.dataset.n = index;
    });
    this.data.forEach((item, index) => {
      const n = index + 1;
      const isSelected = this.selected === n;

      if (!this.group) {
         tabpanel_html += `<div role="tabpanel" aria-labelledby="${this.id}-id-${n}" id="${this.id}-panel-${n}" aria-expanded="${isSelected}" tabindex="${isSelected ? '0' : '-1'}" data-tab-name="${this.id}"></div>`;
      } 
    });
    
    this.el_wrap.innerHTML = tabpanel_html;
    this.el_tabBtns = this.el_tab.querySelectorAll('[role="tab"]');

    if (!this.group) {
      this.data.forEach((item, index) => {
        const n = index + 1;
        loadContent({
          area: this.el_wrap.querySelector(`#${this.id}-panel-${n}`),
          src: item.src,
          insert: true,
        })
        .then(() => {
          (item.callback && item.selected) && item.callback();
        })
        .catch(err => console.error('Error loading tab content:', err));
      });
    } 
    else {
      loadContent({
        area: this.el_wrap,
        src: this.group.src,
        insert: true,
      })
      .then(() => {
        this.el_wrap.querySelectorAll('[role="tabpanel"]').forEach((item, index) => {
          const n = index + 1;
          const isSelected = this.selected === n;
          item.setAttribute('aria-labelledby', `${this.id}-id-${n}`);
          item.setAttribute('id', `${this.id}-panel-${n}`);
          item.setAttribute('aria-expanded', `${isSelected}`);
          item.setAttribute('tabindex', `${isSelected ? '0' : '-1'}`);
          item.dataset.tabName = this.id;

          if (isSelected && this.data && this.data.length > 0) {
            this.data[index].callback && this.data[index].callback();
          }
        });
      })
      .catch(err => console.error('Error loading tab content:', err));
    }

    this.el_tabBtns.forEach((item, index) => {
      item.addEventListener('click', this.handleToggle.bind(this));     
    });

    const keyNavigator = new ArrowNavigator({
      container: this.el_tab,
      callback: (el, index) => {
        this.expanded(el.id);
      }
    });

    this.smoothScroll = new SmoothScroller({
      element: this.el_tab,
      type: 'center'
    });
  }

  handleToggle (e) {
    const _this = e.currentTarget;
    const _wrap = _this.closest('[data-tab]');
    const tabSelected = _wrap.querySelector('[role="tab"][aria-selected="true"]');
    const tabID = _this.id;
    const idx = Number(_this.dataset.n);

    tabSelected.setAttribute('aria-selected', false);
    _this.setAttribute('aria-selected', true);

    if (this.data && this.data.length > 0) {
      this.data[idx].callback && this.data[idx].callback();
    }
    
    this.smoothScroll.move(_this);
    this.expanded(_this.id);
  }

  expanded (id) {
    const tabID = id;
    const _this = document.querySelector(`#${tabID}`);
    const _wrap = _this.closest('[data-tab]');
    const tabName = _wrap.dataset.tab;

    console.log(tabName, tabID)

    const tabSelected = _wrap.querySelector(`[data-tab-name="${tabName}"][role="tab"][aria-selected="true"]`);
    const panelWrap = document.querySelector(`[data-tab-wrap="${tabName}"]`);
    const panelSelected = panelWrap.querySelector(`[data-tab-name="${tabName}"][role="tabpanel"][aria-expanded="true"]`);
    const currentPanel = panelWrap.querySelector(`[data-tab-name="${tabName}"][role="tabpanel"][aria-labelledby="${tabID}"]`);

    _this.focus();

    const _tabs = _wrap.querySelectorAll('[role="tab"]');
		_tabs.forEach(item => {
			item.setAttribute('tabindex', '-1');
		});

    // tab button
    tabSelected.setAttribute('aria-selected', false);
    _this.setAttribute('aria-selected', true);
    _this.setAttribute('tabindex', '0');
    // tab panel

    console.log(panelWrap,panelSelected,currentPanel)

    panelSelected.setAttribute('aria-expanded', false);
    panelSelected.setAttribute('tabindex', '-1');
    currentPanel.setAttribute('aria-expanded', true);
    currentPanel.setAttribute('tabindex', '0');
  }
}