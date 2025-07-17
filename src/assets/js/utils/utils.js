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
  #updateState = (e) => {
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