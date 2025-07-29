/**
 * Loads content from a specified source and inserts it into a DOM element.
 * @param {Object} options - Options for the function.
 * @param {Element} options.area - The DOM element where content will be inserted.
 * @param {string} options.src - The source URL to fetch content from.
 * @param {boolean} [options.insert=false] - Whether to insert content at the beginning or replace it.
 * @param {Function|null} [options.callback=null] - A callback function to execute after loading content.
 * @returns {Promise<string>} A promise that resolves with the fetched content.
 * 
 	 loadContent({
			area: document.querySelector('불러올 영역'),
			src: '파일경로',
			insert: true
		})
		.then(() => {
			//로드 후 실행
		})
		.catch(err => console.error('Error loading header content:', err));
*/
export const loadContent = ({ area, src, insert = false, callback = null }) => {
	return new Promise((resolve, reject) => {
		if (!(area instanceof Element)) {
			console.error('Invalid selector provided.');
			reject(new Error('Invalid DOM element.'));
			return;
		}
		if (!src) {
			reject(new Error('Source (src) is required'));
			return;
		}

		fetch(src)
			.then(response => {
				if (!response.ok) throw new Error(`Failed to fetch ${src}`);
				return response.text();
			})
			.then(result => {
				insert ? area.insertAdjacentHTML('afterbegin', result) : area.innerHTML = result;
				if (callback) callback();
				resolve(result);
			})
			.catch(error => reject(error));
	});
};

export const slideUp = (element, duration = 300) => {
  return new Promise(resolve => {
    element.style.height = element.scrollHeight + 'px';
    element.style.transition = `height ${duration}ms ease`;
    element.offsetHeight; // reflow

    requestAnimationFrame(() => {
      element.style.height = '0px';
    });

    const onEnd = () => {
      element.removeEventListener('transitionend', onEnd);
      element.style.display = 'none';
      element.style.height = '';
      element.style.transition = '';
      resolve();
    };

    element.addEventListener('transitionend', onEnd);
  });
};

export const slideDown = (element, duration = 300) => {
  return new Promise(resolve => {
    element.style.removeProperty('display');
    const display = getComputedStyle(element).display;

    if (display === 'none') {
      element.style.display = 'block';
    }

    const height = element.scrollHeight;
    element.style.height = '0px';
    element.style.transition = `height ${duration}ms ease`;
    element.offsetHeight; // reflow

    requestAnimationFrame(() => {
      element.style.height = height + 'px';
    });

    const onEnd = () => {
      element.removeEventListener('transitionend', onEnd);
      element.style.height = '';
      element.style.transition = '';
      resolve();
    };

    element.addEventListener('transitionend', onEnd);
  });
};

export const slideToggle = (element, duration = 300) => {
  const isHidden = getComputedStyle(element).display === 'none' || element.clientHeight === 0;
  return isHidden ? slideDown(element, duration) : slideUp(element, duration);
};

export class ScrollTrigger {
  constructor(options) {
    // 기본 옵션 설정
    this.options = {
      targetSelector: null, // 관찰할 요소의 CSS 선택자 (필수)
      callback: () => {},  // 요소가 트리거될 때 실행할 함수 (필수)
      root: null,          // Intersection Observer의 root 옵션 (null = 뷰포트)
      rootMargin: '0px',   // Intersection Observer의 rootMargin 옵션
      threshold: 0,        // Intersection Observer의 threshold 옵션 (0.0 ~ 1.0 또는 배열)
      once: false           // 한 번 트리거되면 관찰을 중지할지 여부
    };

    // 사용자가 제공한 옵션으로 기본 옵션 오버라이드
    Object.assign(this.options, options);

    // 필수 옵션 검증
    if (!this.options.targetSelector) {
      console.error('ScrollTrigger: targetSelector 옵션은 필수입니다.');
      return;
    }
    if (typeof this.options.callback !== 'function') {
      console.error('ScrollTrigger: callback 옵션은 함수여야 합니다.');
      return;
    }

    this.observer = null; // IntersectionObserver 인스턴스
    this.init(); // 초기화 메서드 호출
  }

  init() {
    const { root, rootMargin, threshold } = this.options;

    // Intersection Observer 생성
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
      root,
      rootMargin,
      threshold
    });

    // 모든 대상 요소를 찾아 관찰 시작
    this.targetElements = this.options.targetSelector;
    if (this.targetElements.length === 0) {
      console.warn(`ScrollTrigger: '${this.options.targetSelector}'에 해당하는 요소를 찾을 수 없습니다.`);
      return;
    }

    this.targetElements.forEach(element => {
      this.observer.observe(element);
    });
  }

  handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 요소가 뷰포트에 진입했을 때 콜백 실행
        this.options.callback(entry.target); // 콜백에 해당 요소 전달

        // once 옵션이 true이면, 콜백 실행 후 해당 요소의 관찰 중지
        if (this.options.once) {
          observer.unobserve(entry.target);
        }
      }
    });
  }

  // 모든 관찰 중지 메서드 (필요시 외부에서 호출)
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

export class SmoothScroller {
  /**
   * @param {Object} opt
   * @param {HTMLElement} opt.element
   * @param {string} [opt.type=center|left]
   */
  constructor(opt) {
    this.container = opt.element;
    this.width = this.container.offsetWidth;
    this.type = opt.type || 'center';
    const computedStyle = window.getComputedStyle(this.container);
    this.gap = parseFloat(computedStyle.paddingLeft);
  }

  move(item) {
    const rect = this.container.getBoundingClientRect();
    const scrollLeft = this.container.scrollLeft;
    const itemRect = item.getBoundingClientRect();
    const containerHalf = rect.width / 2;

    const targetLeft = Math.abs((rect.left + this.gap) - (itemRect.left + scrollLeft));

    switch (this.type) {
      case 'center':
        this.container.scrollTo({
          left: targetLeft - containerHalf + (itemRect.width / 2),
          behavior: 'smooth'
        });
        break;
      case 'left':
        this.container.scrollTo({
          left: targetLeft,
          behavior: 'smooth'
        });
        break;
    }
  }
}

export class FocusTrap {
  constructor(container) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('FocusTrap requires a valid DOM element.');
    }

    this.container = container;
    this.focusableElements = this.getFocusableElements();
    this.firstElement = this.focusableElements[0];
    this.lastElement = this.focusableElements[this.focusableElements.length - 1];

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.activate();
  }

  getFocusableElements() {
    const selectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex="-1"])'
    ];
    return Array.from(this.container.querySelectorAll(selectors.join(','))).filter(el => el.offsetParent !== null);
  }

  handleKeyDown(e) {
    if (e.key !== 'Tab') return;

    this.focusableElements = this.getFocusableElements(); // update in case of dynamic changes
    this.firstElement = this.focusableElements[0];
    this.lastElement = this.focusableElements[this.focusableElements.length - 1];

    if (this.focusableElements.length === 0) return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstElement) {
        e.preventDefault();
        this.lastElement.focus();
      } else if (e.target === this.container) {
        e.preventDefault();
        this.lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastElement) {
        e.preventDefault();
        this.firstElement.focus();
      }
    }
  }

  activate() {
    this.container.addEventListener('keydown', this.handleKeyDown);
  }

  deactivate() {
    this.container.removeEventListener('keydown', this.handleKeyDown);
  }
}

export class ArrowNavigator {
  constructor(opt) {
    const container = opt.container;
    const foucsabledSelector = opt.foucsabledSelector;
    const callback = opt.callback;

    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('ArrowNavigator: 유효한 DOM 요소를 전달해야 합니다.');
    }

    this.container = container;
    this.callback = typeof callback === 'function' ? callback : () => {};
    this.focusableSelectors = !foucsabledSelector ? [
      '[role="tab"]',
      '[role="button"]',
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ] : [foucsabledSelector];
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.container.addEventListener('keydown', this.handleKeyDown);
  }

  getFocusableElements() {
    return Array.from(this.container.querySelectorAll(this.focusableSelectors.join(',')))
      .filter(el => el.offsetParent !== null);
  }

  handleKeyDown(e) {
    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (!keys.includes(e.key)) return;

    const elements = this.getFocusableElements();
    const currentIndex = elements.indexOf(document.activeElement);

    if (currentIndex === -1) return;

    let nextIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % elements.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + elements.length) % elements.length;
    }

    const nextEl = elements[nextIndex];
    if (nextEl) {
      e.preventDefault();
      nextEl.focus();
      this.callback(nextEl, nextIndex);
    }
  }

  destroy() {
    this.container.removeEventListener('keydown', this.handleKeyDown);
  }
}

export class RadioAllcheck {
  //private
  #main;
  #subs;
  #sum
  #callback;
  #isAllCheck;

  constructor(opt) {
    // opt 유효성 검사
    if (!opt || !opt.name) {
      throw new Errow('옵션 객체와 name 속성은 필수입니다.');
    }

    const { name, callback } = opt;

    this.#callback = callback;
    this.#main = document.querySelector(`[data-allcheck-main="${name}"]`);
    this.#subs = document.querySelectorAll(`[data-allcheck-sub="${name}"]`);

    if (!this.#main || this.#subs.length === 0) {
      console.error(`${name}에 핻앟나느 체크박스 요소를 찾을 수가 없습니다.`);
      return;
    }

    this.#sum = this.#subs.length;
    this.#updateState(); // 초기 상태 설정
    this.#addEventListeners();
  }

  #addEventListeners() {
    this.#main.addEventListener('change', this.#handleToggle);
    this.#subs.forEach(item => {
      item.addEventListener('change', this.#updateState);
    });
  }

  #handleToggle = (e) => {
    this.#isAllCheck = e.target.checked;
    this.#subs.forEach(item => {
      item.checked = this.#isAllCheck;
    });
    this.#callback?.(this.#isAllCheck);
  }
  #updateState = () => {
    const checkedSum = Array.from(this.#subs).filter(item => item.checked).length;
    this.#isAllCheck = (this.#sum === checkedSum);
    this.#main.checked = this.#isAllCheck;
    this.#callback?.(this.#isAllCheck);
  }
  destroy() {
    this.#main.removeEventListener('change', this.#handleToggle);
    this.#subs.forEach(item => {
      item.removeEventListener('change', this.#updateState);
    });
  }
}

export class HoverMenu {
  constructor(opt) {
    this.id = opt.id,
    this.nav = document.querySelector(`[data-hover-nav="${this.id}"]`);
    this.links = this.nav.querySelectorAll('a, button');
    this.depBtns = this.nav.querySelectorAll('[data-hover-nav-button]');
    this.handleHover = this.handleHover.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleTab = this.handleTab.bind(this);
    this.first = this.links[0];
    this.last = this.links[this.links.length - 1];
    this.init();
  }

  init() {
    this.depBtns.forEach((item, index) => {
      item.addEventListener('mouseover', this.handleHover);
      item.addEventListener('focus', this.handleFocus);
      item.addEventListener('mouseleave', this.handleLeave);
    });

    this.first.addEventListener('keydown', this.handleTab);
    this.last.addEventListener('keydown', this.handleTab);

    this.nav.addEventListener('mouseover', this.handleBodyOn);
    this.nav.addEventListener('mouseleave', this.handleBodyOff);

  }

  handleBodyOn() {
    document.body.dataset.navState = "on";
  }
  handleBodyOff() {
    document.body.dataset.navState = "off";
  }
  handleTab(e) {
    if (e.key !== 'Tab') return;

    const _this = e.currentTarget;
    const wrap = _this.closest('[data-hover-nav-item="1"]');
    if (_this === this.first && e.shiftKey) {
      wrap.dataset.state = 'off';
      document.body.dataset.navState = "off";
    } else if (_this === this.last && !e.shiftKey) {
      wrap.dataset.state = 'off';
      document.body.dataset.navState = "off";
    }
  }
  handleFocus(e) {
    const _this = e.currentTarget;
    const area = _this.closest('[data-hover-nav]');
    const wrap = _this.closest('[data-hover-nav-item]');
    const onItem = area.querySelector('[data-hover-nav-item][data-state="on"]')
    if (onItem) {
      onItem.dataset.state = 'off';
      document.body.dataset.navState = "off";
    }
    wrap.dataset.state = 'on';
    document.body.dataset.navState = "on";
  }

  handleHover(e) {
    const _this = e.currentTarget;
    const wrap = _this.closest('[data-hover-nav-item]');
    wrap.dataset.state = 'on';
    document.body.dataset.navState = "on";
  }
  handleLeave(e) {
    const _this = e.currentTarget;
    const wrap = _this.closest('[data-hover-nav-item]');
    const depth = Number(wrap.dataset.hoverNavItem) + 1;
    const nextDepth = wrap.querySelector(`[data-hover-nav-item="${depth}"]`);
    let timer = null;

    const actHide = () => {
      wrap.dataset.state = 'off';
    }
    const actCancle = () => {
      clearTimeout(timer);
      nextDepth.addEventListener('mouseleave', actHide)
    }

    nextDepth.addEventListener('mouseover', actCancle);
    timer = setTimeout(() => {
      wrap.dataset.state = 'off';
    }, 200);
  }
}

export class FakeRadio  {
  constructor(opt) {
    this.el = document.querySelector(`[data-radio-checked="${opt.id}"]`);
    this.radios = this.el.querySelectorAll('[data-radio-checked]');
    this.checkedItem = null;
    this.callback = opt.callback;
    this.init();
  }
  init(){ 
    this.radios.forEach(item => {
      item.addEventListener('click', this.handleCheck);
    });
  }
  handleCheck = (e) => {
    const _this = e.currentTarget;
    this.checkedItem = this.el.querySelector('[data-radio-checked="true"]');
    this.checkedItem.dataset.radioChecked = 'false';
    _this.dataset.radioChecked = 'true';
    this.callback && this.callback(_this);
  }
}


