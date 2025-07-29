import { loadContent, ArrowNavigator, SmoothScroller } from '../utils/utils.js';
import { TAB_VERSION } from "../config/versions.js";

export default class Tab {
  constructor(opt) {
		const defaults = {
      renderMode: 'dynamic', //'static', 'dynamic'
      scroll: false,
      loadAll: false,
      selected: 1,
			data: [], 
		};

		this.options = { ...defaults, ...opt };
    this.data = this.options.data;
    this.id = this.options.id;
    this.loadAll = this.options.loadAll;
    this.scroll = this.options.scroll;
    this.selected = this.options.selected;
    this.renderMode = this.options.renderMode;

    this.el_tab = null;
    this.el_wrap = null;
    this.el_tabBtns = null;
    this.el_tabPnls = null;

    this.smoothScroll = null;
  }

  ver() {
      console.groupCollapsed(`%cTab %c${TAB_VERSION.ver}`, 'color: gold; font-weight: normal;', 'color: white; font-weight: bold;');
      TAB_VERSION.history.forEach(item => {
      console.log(`ver: ${item.ver} \ndate: ${item.date} \ndescription: ${item.description}`);
      });
      console.log(`author: ${TAB_VERSION.author}`);
      console.log(`license: ${TAB_VERSION.license}`);
      console.groupEnd();
    }

  init() {
    this.el_tab = document.querySelector(`[data-tab="${this.id}"]`);
    this.el_tabList = this.el_tab.querySelector(`[role="tablist"]`);
    this.el_tabButton = this.el_tab.querySelectorAll(`[role="tab"]`);
    this.el_wrap = document.querySelector(`[data-tab-wrap="${this.id}"]`);

    if (this.el_tab.dataset.load === 'true') return false;
    if (this.scroll) {
      this.el_tab.dataset.tabType = "scroll"
    }

    this.el_tab.dataset.load = true;
    let tabpanel_html = ``;
    let tab_html = `<div role="tablist">`;

    this.data.forEach((item, index) => {
      const n = index + 1;
      const isSelected = this.selected === n;

      if (item.tab) {
        tab_html += `
        <button 
          type="button" 
          role="tab" 
          aria-controls="$${this.id}-panel-${n}" 
          id="${this.id}-id-${n}" 
          aria-selected="${isSelected}" 
          tabindex="${isSelected ? '0' : '-1'}" 
          data-tab-name="${this.id}" 
          data-n="${n}">
          ${item.tab}
        </button>`;
      }
      if (!this.loadAll) {
        tabpanel_html += `
        <div 
          role="tabpanel" 
          aria-labelledby="${this.id}-id-${n}" 
          id="${this.id}-panel-${n}" 
          aria-expanded="${isSelected}" 
          tabindex="${isSelected ? '0' : '-1'}" 
          data-tab-name="${this.id}">
        </div>`;
      } 
    });
    tabpanel_html += `</div>`;

    if (this.el_tabButton.length < 1) {
      // 동적
      this.el_tab.innerHTML = tab_html;
      tab_html = null;
    } else {
      // 정적
      this.el_tabButton.forEach((tab, index) => {
        const n = index + 1;
        const isSelected = this.selected === n;
        tab.setAttribute('id', `${this.id}-id-${n}`);
        tab.setAttribute('aria-controls', `${this.id}-panel-${n}`);
        tab.setAttribute('aria-selected', `${isSelected}`);
        tab.setAttribute('tabindex', `${isSelected ? '0' : '-1'}`);
        tab.dataset.tabName = this.id;
        tab.dataset.n = n;
      });
    }
    
    this.el_tabBtns = this.el_tab.querySelectorAll('[role="tab"]');

    if (this.renderMode === 'static') {
      // 정적
      this.el_wrap.querySelectorAll('[role="tabpanel"]').forEach((panel, index) => {
        const n = index + 1;
        const isSelected = this.selected === n;
        panel.setAttribute('aria-labelledby', `${this.id}-id-${n}`);
        panel.setAttribute('id', `${this.id}-panel-${n}`);
        panel.setAttribute('aria-expanded', `${isSelected}`);
        panel.setAttribute('tabindex', `${isSelected ? '0' : '-1'}`);
        panel.dataset.tabName = this.id;

        if (isSelected && this.data && this.data.length > 0) {
          this.data[index].callback && this.data[index].callback();
        }
      });
    } else {
      this.el_wrap.innerHTML = tabpanel_html;
      if (!this.loadAll) {
        // 개별
        if (this.scroll) {
          this.el_wrap.dataset.tabType = 'scroll';
          this.data.forEach((item, index) => {
            const n = index + 1;
            this.el_wrap.querySelector(`#${this.id}-panel-${n}`).dataset.loaded = 'true';
            this.el_wrap.querySelector(`#${this.id}-panel-${n}`).setAttribute('aria-expanded', 'true');
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
        } else {
          this.loadPanel(Number(this.selected));
        }
      } else {
        // 전체
        loadContent({
          area: this.el_wrap,
          src: this.loadAll.src,
          insert: true,
        })
        .then(() => {
          this.el_wrap.querySelectorAll('[role="tabpanel"]').forEach((panel, index) => {
            const n = index + 1;
            const isSelected = this.selected === n;
            panel.setAttribute('aria-labelledby', `${this.id}-id-${n}`);
            panel.setAttribute('id', `${this.id}-panel-${n}`);
            panel.setAttribute('aria-expanded', `${isSelected}`);
            panel.setAttribute('tabindex', `${isSelected ? '0' : '-1'}`);
            panel.dataset.tabName = this.id;
            panel.dataset.loaded = 'true';

            if (isSelected && this.data && this.data.length > 0) {
              this.data[index].callback && this.data[index].callback();
            }
          });
        })
        .catch(err => console.error('Error loading tab content:', err));
      }
    }

    this.el_tabBtns.forEach((tab, index) => {
      tab.addEventListener('click', this.handleToggle.bind(this));     
    });

    this.keyNavigator = new ArrowNavigator({
      container: this.el_tab,
      callback: el => {
        const panel = document.querySelector(`[aria-labelledby="${el.id}"]`);
        const isLoad = panel.dataset.loaded;
        if (isLoad !== 'true' && this.renderMode !== 'static') {
          // 개별
          this.loadPanel(Number(el.dataset.n), el.id)
        } else {
          this.expanded(el.id);
        }
      }
    });

    this.smoothScroll = new SmoothScroller({
      element: this.el_tab,
      type: 'center'
    });
  }

  loadPanel (n, tabID) {
    const panel = this.el_wrap.querySelector(`#${this.id}-panel-${n}`);
    loadContent({
      area: panel,
      src: this.data[n - 1].src,
      insert: true,
    })
    .then(() => {
      panel.dataset.loaded = 'true';
      this.data[n-1].callback && this.data[n-1].callback();
      tabID && this.expanded(tabID);
    })
    .catch(err => console.error('Error loading tab content:', err))
  }

  handleToggle (e) {
    const _this = e.currentTarget;
    const _wrap = _this.closest('[data-tab]');
    const tabSelected = _wrap.querySelector('[role="tab"][aria-selected="true"]');
    const tabID = _this.id;
    const idx = Number(_this.dataset.n) - 1;
    const panel = document.querySelector(`[aria-labelledby="${tabID}"]`);
    const isLoad = panel.dataset.loaded;

    tabSelected.setAttribute('aria-selected', false);
    _this.setAttribute('aria-selected', true);
    this.smoothScroll.move(_this);

    if (isLoad !== 'true' && this.renderMode !== 'static') {
      this.loadPanel(Number(_this.dataset.n), tabID);
    } else {
      if (this.data && this.data.length > 0) {
        this.data[idx].callback && this.data[idx].callback();
      }
      this.expanded(tabID);
    }
  }

  expanded (id) {
    const tabID = id;
    const _this = document.querySelector(`#${tabID}`);
    const _wrap = _this.closest('[data-tab]');
    const tabName = _wrap.dataset.tab;

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
    if (!this.scroll) {
      panelSelected.setAttribute('aria-expanded', false);
      panelSelected.setAttribute('tabindex', '-1');
    } else {
      currentPanel.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
        inline: 'nearest'
      });
    }
    currentPanel.setAttribute('aria-expanded', true);
    currentPanel.setAttribute('tabindex', '0');
  }
}