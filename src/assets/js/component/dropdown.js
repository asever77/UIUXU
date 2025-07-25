import { DROPDOWN_VERSION } from "../config/versions.js";
import { loadContent } from '../utils/utils.js';

export default class Dropdown {
  constructor(opt) {
    const defaults = {
      area: document.querySelector('.area-dropdown[data-area="body"]'),
      src: null,
      ps: null, // bl,bc,br,tl,tc,tr,lt,lc,lb,rt,rc,rb, null(auto tl/bl)
      srcCallback: null,
      callback: null,
    };

    this.option = { ...defaults, ...opt };
    this.id = this.option.id;
    this.ps = this.option.ps;
    this.area = this.option.area;
    this.callback = this.option.callback;
    this.src = this.option.src;
    this.srcCallback = this.option.srcCallback;

    this.wrap = document.querySelector(`[data-dropdown="${this.id}"]`);
    if (!this.wrap) {
      console.error(`Error: Dropdown wrapper with data-dropdown="${this.id}" not found.`);
      return;
    }
    if (!this.area) {
      console.error(`Error: Dropdown wrapper with data-area="${this.id}" not found.`);
      return; 
    }
    this.button = this.wrap.querySelector(`[data-dropdown-button="${this.id}"]`);
    this.text = this.button ? this.button.querySelector(`[data-dropdown-text="${this.id}"]`) : null;
    this.panel = document.querySelector(`[data-dropdown-panel="${this.id}"]`);
    this.panelInner = document.querySelector(`[data-dropdown-section="${this.id}"]`);
    this.html = document.documentElement; // 'document.querySelector('html')' 보다 더 의미론적입니다.

    // 'this' 컨텍스트를 일관성 있게 유지하기 위해 바인딩된 이벤트 핸들러
    this.boundHandleToggle = this.handleToggle.bind(this);
    this.boundHandleOutsideClick = this.handleOutsideClick.bind(this);

    this.isArea = this.wrap.querySelector('[data-dropdown-panel');
  }

  ver() {
    console.groupCollapsed(`%cdropdown %c${DROPDOWN_VERSION.ver}`, 'color: gold; font-weight: normal;', 'color: white; font-weight: bold;'); // 기본적으로 접힌 상태
    DROPDOWN_VERSION.history.forEach(item => {
    console.log(`ver: ${item.ver} \ndate: ${item.date} \ndescription: ${item.description}`);
    });
    console.log(`author: ${DROPDOWN_VERSION.author}`);
    console.log(`license: ${DROPDOWN_VERSION.license}`);
    console.table(this.option);
    console.groupEnd();
  }

  init() {
    //setting
    this._setupElements();
    this._addEventListeners();

    this.button.addEventListener('click', this.boundHandleToggle);
    this.callback && this.callback();
    window.addEventListener('resize', this.reset);
  }

  /**
   * 드롭다운 요소의 초기 ARIA 속성과 데이터 속성을 설정합니다.
   */
  _setupElements() {
    console.log(this.src);
    if (this.src) {
      loadContent({
        area: this.area,
        src: this.src,
        insert: true,
      })
      .then(() => {
        if (this.text) {
          this.text.dataset.dropdownText = this.id;
        }
        if (this.button) {
          this.button.dataset.dropdownButton = this.id;
          this.button.setAttribute('aria-controls', this.id);
          this.button.setAttribute('aria-expanded', 'false');
        }
 
        this.panel = document.querySelector(`[data-dropdown-panel="${this.id}"]`);
        this.panelInner = document.querySelector(`[data-dropdown-section="${this.id}"]`);
        this.panel.dataset.dropdownPanel = this.id;
        this.panel.setAttribute('aria-hidden', 'true');
        this.panel.setAttribute('tabindex', '-1');
        this.panel.id = this.id;

        this.isArea = this.wrap.querySelector('[data-dropdown-panel]');
        this.srcCallback && this.srcCallback();
      })
      .catch(err => console.error('Error loading tab content:', err));
    } else {
      if (this.text) {
        this.text.dataset.dropdownText = this.id;
      }
      if (this.button) {
        this.button.dataset.dropdownButton = this.id;
        this.button.setAttribute('aria-controls', this.id);
        this.button.setAttribute('aria-expanded', 'false');
      }
      if (this.panel) {
        this.panel.dataset.dropdownPanel = this.id;
        this.panel.setAttribute('aria-hidden', 'true');
        this.panel.setAttribute('tabindex', '-1');
        this.panel.id = this.id; // aria-controls를 위해 패널에 ID가 있는지 확인
      }
    }
  }

  reset() {
    const expanded = document.querySelector('[data-dropdown-panel][aria-hidden="false"]');
    if (expanded && expanded !== this.panel) {
      expanded.setAttribute('aria-hidden', true);
      document.querySelector(`[data-dropdown-button="${expanded.dataset.dropdownPanel}"]`).setAttribute('aria-expanded', false);
    }
  }

  /**
   * 드롭다운에 필요한 이벤트 리스너를 추가합니다.
   */
  _addEventListeners() {
    if (this.button) {
      this.button.addEventListener('click', this.boundHandleToggle);
    }
  }

   /**
   * 드롭다운에서 모든 이벤트 리스너를 제거합니다.
   */
  _removeEventListeners() {
    if (this.button) {
      this.button.removeEventListener('click', this.boundHandleToggle);
    }
    this.html.removeEventListener('click', this.boundHandleOutsideClick); // 외부 클릭 리스너 제거
  }

  /**
   * 드롭다운 외부 클릭을 처리하여 드롭다운을 숨깁니다.
   * @param {Event} e - 클릭 이벤트 객체
   */
  handleOutsideClick = (e) => {
    // 클릭이 드롭다운 래퍼와 패널 내부에 있는지 확인
    const isClickInsideDropdown = this.wrap.contains(e.target) || this.panel.contains(e.target);
    if (!isClickInsideDropdown) {
      this.hide();
    }
  };

  /**
   * 드롭다운 표시/숨김을 전환합니다.
   */
  handleToggle = () => {
    if (!this.button || !this.panel) return; // 요소가 없으면 실행 중지

    const isExpanded = this.button.getAttribute('aria-expanded') === 'true';
    isExpanded ? this.hide() : this.show();
  };

  /**
   * 드롭다운 패널을 표시합니다.
   */
  show() {
    if (!this.button || !this.panel) return;

    this.button.setAttribute('aria-expanded', true);
    this.panel.setAttribute('aria-hidden', false);    
    this.panel.focus(); // 접근성을 위해 패널에 포커스
    
    const rect = this.button.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const scroll_t = document.documentElement.scrollTop;
    this.panel.style.height = rect.height + 'px';

    if (this.ps) {
      this.panel.dataset.ps = this.ps;
    } else {
      this.panel.dataset.ps = (rect.bottom + this.panelInner.offsetHeight < viewportHeight) ? 'bl' : 'tl';
    }

    if (!this.isArea) {
      this.panel.style.width = rect.width + 'px';
      this.panel.style.left = rect.x + 'px';
      this.panel.style.top = (rect.y + scroll_t) + 'px';
    } 

    this.html.addEventListener('click', this.boundHandleOutsideClick);
  }
  
  /**
   * 드롭다운 패널을 숨깁니다.
   */
  hide() {
    if (!this.button || !this.panel) return;

    this.html.removeEventListener('click', this.boundHandleOutsideClick);
    this.button.setAttribute('aria-expanded', 'false');
    this.panel.setAttribute('aria-hidden', 'true');
    this.button.focus(); // 드롭다운이 닫힌 후 버튼에 포커스
  }
}