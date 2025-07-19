import { loadContent, ArrowNavigator } from '../utils/utils.js';

export default class Tab {
  constructor(opt) {
		const defaults = {
			renderMode: 'static', 
      group: false,
			data: null, 
		};

		this.option = { ...defaults, ...opt };
    this.renderMode = this.option.renderMode;
    this.data = this.option.data;
    this.id = this.option.id;
    this.group = this.option.group;

    this.el_tab = document.querySelector(`[data-tab="${this.id}"]`);
    this.el_wrap = document.querySelector(`[data-tab-wrap="${this.id}"]`);
    this.el_tabBtns = null;
    this.el_tabPnls = null;

    this.init();
  }

  init() {
    let tablist_html = ``;
    let tabpanel_html = ``;
    this.data.forEach((item, index) => {
      const n = index + 1;
      tablist_html += `<button type="button" role="tab" aria-selected="${item.selected}" aria-controls="${this.id}-panel-${n}" tabindex="${item.selected ? '0' : '-1'}" id="${this.id}-id-${n}" data-n="${index}">${item.tab}</li>`;

      if (!this.group) {
         tabpanel_html += `<div role="tabpanel" aria-labelledby="${this.id}-id-${n}" id="${this.id}-panel-${n}" aria-expanded="${item.selected}" tabindex="${item.selected ? '0' : '-1'}"></div>`;
      } 
    });
    
    this.el_tab.innerHTML = tablist_html;
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
      console.log('group', this.group.src)
      loadContent({
        area: this.el_wrap,
        src: this.group.src,
        insert: true,
      })
      .then(() => {
        this.el_wrap.querySelectorAll('[role="tabpanel"]').forEach((item, index) => {
          const n = index + 1;
          const isSelected = this.group.selected === n;
          item.setAttribute('aria-labelledby', `${this.id}-id-${n}`);
          item.setAttribute('id', `${this.id}-panel-${n}`);
          item.setAttribute('aria-expanded', `${isSelected}`);
          item.setAttribute('tabindex', `${isSelected ? '0' : '-1'}`);

          if (isSelected) {
            console.log(this.data, index)
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
  }

  handleToggle (e) {
    const _this = e.currentTarget;
    const _wrap = _this.closest('[role="tablist"]');
    const tabSelected = _wrap.querySelector('[role="tab"][aria-selected="true"]');
    const tabID = _this.id;
    const idx = Number(_this.dataset.n);

    tabSelected.setAttribute('aria-selected', false);
    _this.setAttribute('aria-selected', true);

    this.data[idx].callback && this.data[idx].callback();

    
    this.expanded(_this.id);
  }

  expanded (id) {
    const tabID = id;
    const _this = document.querySelector(`#${tabID}`);
    const _wrap = _this.closest('[role="tablist"]');
    const tabName = _wrap.dataset.tab;
    const tabSelected = _wrap.querySelector('[role="tab"][aria-selected="true"]');
    const panelWrap = document.querySelector(`[data-tab-wrap="${tabName}"]`);
    const panelSelected = panelWrap.querySelector(`[role="tabpanel"][aria-expanded="true"]`);
    const currentPanel = panelWrap.querySelector(`[role="tabpanel"][aria-labelledby="${tabID}"]`);

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
    panelSelected.setAttribute('aria-expanded', false);
    panelSelected.setAttribute('tabindex', '-1');
    currentPanel.setAttribute('aria-expanded', true);
    currentPanel.setAttribute('tabindex', '0');
  }
}