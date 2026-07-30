import { slideUp, slideDown, ArrowNavigator, getUrlParameter } from '../utils/utils.js';
import { logger } from '../utils/logger.js';
import { ErrorHandler, ValidationError, ElementNotFoundError, StateError } from '../utils/errors.js';

export default class Accordion {
  #option;
  #id;
  #expanded;
  #singleOpen;
  #acco;
  #acco_items;
  #acco_btns;
  #isAnimating = false; // ✨ 개선점: 애니메이션 상태 추적을 위한 플래그
  #arrowNavigator; // ArrowNavigator 인스턴스를 저장할 private 필드

  constructor(opt) {
    const defaults = {
      expanded: null,
      singleOpen: true,
      scrollIntoView: false,
      scrollOptions: { behavior: 'smooth', block: 'nearest' },
    };

    this.#option = { ...defaults, ...opt };
    this.#id = this.#option.id;
    
    // 필수 파라미터 검증
    try {
      ErrorHandler.requireParams(this.#option, ['id'], 'Accordion');
    } catch (error) {
      ErrorHandler.handle(error, 'Accordion');
      return;
    }
    
    this.#expanded = this.#option.expanded;
    this.#singleOpen = this.#option.singleOpen;
    this.#acco = document.querySelector(`[data-accordion="${this.#id}"]`);
    
    // DOM 요소 존재 검증
    if (!this.#acco) {
      try {
        ErrorHandler.requireElement(
          this.#acco, 
          `[data-accordion="${this.#id}"]`, 
          'Accordion'
        );
      } catch (error) {
        ErrorHandler.handle(error, 'Accordion');
        return;
      }
    }

    this.#acco_items = this.#acco.querySelectorAll(`[data-accordion-item="${this.#id}"]`);
    this.#acco_btns = this.#acco.querySelectorAll(`[data-accordion-button="${this.#id}"]`);

    // handleToggle 메서드의 this 바인딩을 한 번만 수행
    this.handleToggle = this.#handleToggle.bind(this);
  }

  init() {
    this.#initializeAccordionItems();
    
    // 🚀 개선점: foucsabledSelector를 동적으로 설정하여 모든 아코디언에서 동작하도록 수정
    this.#arrowNavigator = new ArrowNavigator({
      container: this.#acco,
      foucsabledSelector: `[data-accordion-button="${this.#id}"]`,
    });
  }

  // 아코디언 항목들을 초기화하는 private 메서드
  #initializeAccordionItems() {
    this.#acco_items.forEach((item, index) => {
      const btnID = `${this.#id}-${index}`;
      const bodyID = `${this.#id}-body-${index}`;
      const accoBtn = item.querySelector(`[data-accordion-button="${this.#id}"]`);
      const accoTitle = item.querySelector(`[data-accordion-title="${this.#id}"]`);
      const accoBody = item.querySelector(`[data-accordion-body="${this.#id}"]`);

      accoTitle.id = btnID;
      accoBtn.setAttribute('aria-expanded', 'false');
      accoBtn.setAttribute('aria-controls', bodyID);
      // if(accoTitle) { // title 요소가 있을 경우에만 aria-label 설정
      //   accoBtn.setAttribute('aria-label', accoTitle.textContent + ' 내용보기');
      // }
      
      accoBody.id =  bodyID;
      accoBody.setAttribute('role', 'region');
      accoBody.setAttribute('aria-labelledby', btnID);
      accoBody.setAttribute('hidden', '');
      
      const para = getUrlParameter('acco');
      if (para) {
        if (para === btnID) {
          accoBtn.setAttribute('aria-expanded', 'true');
          accoBody.removeAttribute('hidden');
        }
      } else {
        if (this.#expanded === btnID) {
          accoBtn.setAttribute('aria-expanded', 'true');
          accoBody.removeAttribute('hidden');
        }
      }

      // 이벤트 리스너 추가
      accoBtn.addEventListener('click', this.handleToggle);
    });
  }

  // 🚀 개선점: 화살표 함수 대신 private 메서드로 변경 및 this 바인딩 처리
  #handleToggle(e) {
    // ✨ 개선점: 애니메이션 중에는 클릭 이벤트를 무시
    if (this.#isAnimating) {
      logger.debug('애니메이션 진행 중 - 클릭 무시', null, 'Accordion');
      return;
    }

    const button = e.currentTarget;
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
      this.#hide(button);
    } else {
      this.#show(button);
    }
  }

  /**
   * 아코디언 아이템을 여는 public 메서드
   * @param {HTMLElement|string} target - 열고자 하는 아코디언 버튼 엘리먼트 또는 ID
   * @param {Function} [callback] - 애니메이션 완료 후 실행될 콜백 함수
   */
  show(target, callback) {
    this.#show(target, callback); // private show 메서드 호출
  }

  // 🚀 개선점: id 대신 element를 직접 인자로 받아 불필요한 DOM 탐색 제거
  // 🚀 개선점: 인자가 ID(문자열) 또는 엘리먼트인지 판별하여 모두 처리
  #show(target, callback = false) {
    // target이 문자열이면 ID로 간주하여 버튼 엘리먼트를 찾고, 아니면 엘리먼트로 간주
    const button = typeof target === 'string' ? document.querySelector(`#${target}`) : target;
    
    // 해당하는 버튼이 없으면 함수 종료
    if (!button) {
      try {
        throw new ElementNotFoundError(
          `Accordion item을 찾을 수 없습니다`,
          { target: target, type: typeof target }
        );
      } catch (error) {
        ErrorHandler.handle(error, 'Accordion');
        return;
      }
    }

    this.#isAnimating = true;
    const accoBody = document.querySelector(`#${button.getAttribute('aria-controls')}`);
    
    if (this.#singleOpen) {
      const openItems = this.#acco.querySelectorAll(`[data-accordion-button="${this.#id}"][aria-expanded="true"]`);
      
      openItems.forEach(openButton => {
        if (openButton !== button) {
          this.#hide(openButton, false); // 다른 항목을 닫을 때는 스크롤 조정 안함
        }
      });
    }

    button.disabled = true; // ✨ 개선점: pointer-events 대신 disabled 속성 사용
    button.setAttribute('aria-expanded', 'true');
    accoBody.removeAttribute('hidden');

    slideDown(accoBody, 300).then(() => {
      button.disabled = false;
      this.#isAnimating = false;
      // 옵션으로 스크롤 보정 지원
      if (this.#option.scrollIntoView) {
        const scrollTarget = button.closest(`[data-accordion-item="${this.#id}"]`) || button;
        scrollTarget.scrollIntoView(this.#option.scrollOptions || { behavior: 'smooth', block: 'nearest' });
      }
      if (this.#acco) {
        this.#acco.dispatchEvent(new CustomEvent("ui:accordion:open", {
          bubbles: true,
          detail: { id: this.#id, button, body: accoBody }
        }));
        this.#acco.dispatchEvent(new CustomEvent("ui:accordion:change", {
          bubbles: true,
          detail: { id: this.#id, action: "open", button, body: accoBody }
        }));
      }
      callback && callback();
    });
  }

  /**
   * 아코디언 아이템을 닫는 public 메서드
   * @param {HTMLElement|string} target - 닫고자 하는 아코디언 버튼 엘리먼트 또는 ID
   * @param {Function} [callback] - 애니메이션 완료 후 실행될 콜백 함수
   */
  hide(target, callback) {
    this.#hide(target, callback); // private hide 메서드 호출
  }

  #hide(target, callback = false) {
    const button = typeof target === 'string' ? document.querySelector(`#${target}`) : target;

    if (!button) {
      logger.warn(`Accordion item with target "${target}" not found.`, null, 'Accordion');
      return;
    }

    this.#isAnimating = true;
    const accoBody = document.querySelector(`#${button.getAttribute('aria-controls')}`);
    
    button.disabled = true; // ✨ 개선점: pointer-events 대신 disabled 속성 사용
    button.setAttribute('aria-expanded', 'false');

    slideUp(accoBody, 300).then(() => {
      accoBody.setAttribute('hidden', '');
      button.disabled = false;
      this.#isAnimating = false;
      if (this.#acco) {
        this.#acco.dispatchEvent(new CustomEvent("ui:accordion:close", {
          bubbles: true,
          detail: { id: this.#id, button, body: accoBody }
        }));
        this.#acco.dispatchEvent(new CustomEvent("ui:accordion:change", {
          bubbles: true,
          detail: { id: this.#id, action: "close", button, body: accoBody }
        }));
      }
      callback && callback();
    });
  }

  /**
   * 아코디언 항목 목록을 업데이트합니다.
   * 동적으로 아코디언 항목이 추가되거나 제거될 때 호출합니다.
   */
  update() {
    // 기존 이벤트 리스너 제거 (이전에 등록된 버튼에 대해)
    if (this.#acco_btns) {
      this.#acco_btns.forEach(button => {
        button.removeEventListener('click', this.handleToggle);
      });
    }

    // 최신 DOM 상태를 다시 스캔
    this.#acco_items = this.#acco.querySelectorAll(`[data-accordion-item="${this.#id}"]`);
    this.#acco_btns = this.#acco.querySelectorAll(`[data-accordion-button="${this.#id}"]`);

    // 새로 스캔된 항목들을 다시 초기화
    this.#initializeAccordionItems();

    logger.info(`Accordion "${this.#id}" has been updated.`, null, 'Accordion');
  }

  /**
   * 아코디언을 제거하고 리소스를 정리합니다.
   * 메모리 누수 방지를 위해 컴포넌트를 파괴할 때 호출해야 합니다.
   * 
   * @example
   * // 컴포넌트 사용 후
   * UI.exe.acco.destroy();
   * UI.exe.acco = null;
   */
  destroy() {
    try {
      // 1. 모든 이벤트 리스너 제거
      if (this.#acco_btns) {
        this.#acco_btns.forEach(button => {
          button.removeEventListener('click', this.handleToggle);
        });
      }

      // 2. DOM 스타일 속성 정리
      if (this.#acco_items) {
        this.#acco_items.forEach(item => {
          const body = item.querySelector(`[data-accordion-body="${this.#id}"]`);
          if (body) body.removeAttribute('style');
        });
      }

      // 3. ArrowNavigator 정리
      if (this.#arrowNavigator && typeof this.#arrowNavigator.destroy === 'function') {
        this.#arrowNavigator.destroy();
      }

      // 4. private 필드 초기화
      this.#acco = null;
      this.#acco_items = null;
      this.#acco_btns = null;
      this.#arrowNavigator = null;
      this.#isAnimating = false;

      logger.info(`Accordion "${this.#id}" destroyed successfully`, null, 'Accordion');
      
    } catch (error) {
      logger.error('Accordion destroy failed', error, 'Accordion');
    }
  }
}