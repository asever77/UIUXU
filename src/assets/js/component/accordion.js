import { slideUp, slideDown, ArrowNavigator, getUrlParameter } from '../utils/utils.js';
import { logger } from '../utils/logger.js';
import { ErrorHandler, ElementNotFoundError } from '../utils/errors.js';

export default class Accordion {
  #option;
  #id;
  #expanded;
  #singleOpen;
  #acco;
  #isAnimating = false;
  #arrowNavigator;
  #handleDelegatedClick;

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

    // handleToggle 메서드의 this 바인딩
    this.handleToggle = this.#handleToggle.bind(this);
    this.#handleDelegatedClick = this.#onContainerClick.bind(this);
  }

  init() {
    this.#initializeAccordionItems();

    // 🚀 이벤트 위임(Event Delegation) 설정: 최상위 컨테이너 1곳에서 모든 클릭 처리
    // 동적으로 생성되거나 삭제되는 아코디언 항목도 update() 없이 즉시 동작
    this.#acco.addEventListener('click', this.#handleDelegatedClick);

    // 🚀 키보드 네비게이터 바인딩 (자식 아코디언 간섭 방지를 위해 동적 셀렉터 적용)
    this.#arrowNavigator = new ArrowNavigator({
      container: this.#acco,
      foucsabledSelector: `[data-accordion-button]`,
    });
  }

  /**
   * 직계 아코디언 자식 요소 탐색 (중첩 아코디언 간섭 방지)
   */
  #getDirectElements(selector) {
    return Array.from(this.#acco.querySelectorAll(selector)).filter(
      (el) => el.closest('[data-accordion]') === this.#acco
    );
  }

  // 아코디언 항목 ARIA 속성 및 초기 상태를 설정하는 private 메서드
  #initializeAccordionItems() {
    const items = this.#getDirectElements('[data-accordion-item]');

    items.forEach((item, index) => {
      const btnID = `${this.#id}-${index}`;
      const bodyID = `${this.#id}-body-${index}`;

      const accoBtn = item.querySelector('[data-accordion-button]');
      const accoTitle = item.querySelector('[data-accordion-title]');
      const accoBody = item.querySelector('[data-accordion-body]');

      if (!accoBtn || !accoBody) return;

      // ID 자동 부여
      if (accoTitle && !accoTitle.id) accoTitle.id = btnID;
      if (!accoBtn.id) accoBtn.id = accoTitle ? `${btnID}-btn` : btnID;
      if (!accoBody.id) accoBody.id = bodyID;

      // ARIA 표준 속성 준수
      if (!accoBtn.hasAttribute('aria-expanded')) {
        accoBtn.setAttribute('aria-expanded', 'false');
      }
      accoBtn.setAttribute('aria-controls', accoBody.id);

      accoBody.setAttribute('role', 'region');
      accoBody.setAttribute('aria-labelledby', accoBtn.id);

      // URL 파라미터 또는 초기 expanded 옵션 확인
      const para = getUrlParameter('acco');
      const isTargetExpanded =
        (para && (para === accoBtn.id || para === btnID)) ||
        (this.#expanded && (this.#expanded === accoBtn.id || this.#expanded === btnID || this.#expanded === `index-${index}`));

      if (isTargetExpanded) {
        accoBtn.setAttribute('aria-expanded', 'true');
        accoBody.removeAttribute('hidden');
        accoBody.style.overflow = '';
      } else {
        if (!accoBtn.hasAttribute('aria-expanded')) {
          accoBtn.setAttribute('aria-expanded', 'false');
        }
        if (accoBtn.getAttribute('aria-expanded') !== 'true') {
          accoBody.setAttribute('hidden', '');
        }
      }
    });
  }

  /**
   * 이벤트 위임(Event Delegation) 핸들러
   */
  #onContainerClick(e) {
    // 클릭된 요소 또는 상위에서 가장 가까운 토글 버튼 검색
    const button = e.target.closest('[data-accordion-button]');
    if (!button) return;

    // 🚀 중첩 아코디언 방지: 클릭된 버튼의 직속 아코디언 컨테이너가 '나' 자신인지 확인
    const targetAccordion = button.closest('[data-accordion]');
    if (targetAccordion !== this.#acco) return;

    this.#handleToggle(button);
  }

  #handleToggle(button) {
    if (this.#isAnimating) {
      logger.debug('애니메이션 진행 중 - 클릭 무시', null, 'Accordion');
      return;
    }

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
    this.#show(target, callback);
  }

  #show(target, callback = false) {
    const button = typeof target === 'string' ? document.querySelector(`#${target}`) : target;

    if (!button) {
      try {
        throw new ElementNotFoundError(
          `Accordion item을 찾을 수 없습니다`,
          { target, type: typeof target }
        );
      } catch (error) {
        ErrorHandler.handle(error, 'Accordion');
        return;
      }
    }

    if (this.#isAnimating) return;
    this.#isAnimating = true;

    const bodyId = button.getAttribute('aria-controls');
    const accoBody = bodyId ? document.getElementById(bodyId) : button.closest('[data-accordion-item]')?.querySelector('[data-accordion-body]');

    if (!accoBody) {
      this.#isAnimating = false;
      return;
    }

    // singleOpen 옵션 처리: 동일 레벨의 열린 다른 아이템 닫기
    if (this.#singleOpen) {
      const openButtons = this.#getDirectElements('[data-accordion-button][aria-expanded="true"]');
      openButtons.forEach((openBtn) => {
        if (openBtn !== button) {
          this.#hide(openBtn, false);
        }
      });
    }

    button.disabled = true;
    button.setAttribute('aria-expanded', 'true');
    accoBody.removeAttribute('hidden');
    accoBody.style.overflow = 'hidden';

    slideDown(accoBody, 300).then(() => {
      button.disabled = false;
      this.#isAnimating = false;
      
      // ✨ 슬라이드 다운 후 overflow 해제 (스크롤 및 내부 팝업/드롭다운 정상 동작 보장)
      accoBody.style.overflow = '';

      if (this.#option.scrollIntoView) {
        const scrollTarget = button.closest('[data-accordion-item]') || button;
        scrollTarget.scrollIntoView(this.#option.scrollOptions || { behavior: 'smooth', block: 'nearest' });
      }

      if (this.#acco) {
        this.#acco.dispatchEvent(new CustomEvent('ui:accordion:open', {
          bubbles: true,
          detail: { id: this.#id, button, body: accoBody }
        }));
        this.#acco.dispatchEvent(new CustomEvent('ui:accordion:change', {
          bubbles: true,
          detail: { id: this.#id, action: 'open', button, body: accoBody }
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
    this.#hide(target, callback);
  }

  #hide(target, callback = false) {
    const button = typeof target === 'string' ? document.querySelector(`#${target}`) : target;

    if (!button) {
      logger.warn(`Accordion item with target "${target}" not found.`, null, 'Accordion');
      return;
    }

    const bodyId = button.getAttribute('aria-controls');
    const accoBody = bodyId ? document.getElementById(bodyId) : button.closest('[data-accordion-item]')?.querySelector('[data-accordion-body]');

    if (!accoBody) return;

    this.#isAnimating = true;
    button.disabled = true;
    button.setAttribute('aria-expanded', 'false');
    accoBody.style.overflow = 'hidden';

    slideUp(accoBody, 300).then(() => {
      accoBody.setAttribute('hidden', '');
      button.disabled = false;
      this.#isAnimating = false;

      if (this.#acco) {
        this.#acco.dispatchEvent(new CustomEvent('ui:accordion:close', {
          bubbles: true,
          detail: { id: this.#id, button, body: accoBody }
        }));
        this.#acco.dispatchEvent(new CustomEvent('ui:accordion:change', {
          bubbles: true,
          detail: { id: this.#id, action: 'close', button, body: accoBody }
        }));
      }
      callback && callback();
    });
  }

  /**
   * 아코디언 항목 목록을 다시 스캔하여 초기화합니다.
   * (이벤트 위임이 적용되어 있어 새 항목 추가 시 호출하지 않아도 기본 클릭은 동작하지만,
   * ARIA ID 자동 부여가 필요한 경우 호출 가능)
   */
  update() {
    this.#initializeAccordionItems();
    logger.info(`Accordion "${this.#id}" has been updated.`, null, 'Accordion');
  }

  /**
   * 아코디언 인스턴스를 파괴하고 리소스를 해제합니다.
   */
  destroy() {
    try {
      if (this.#acco && this.#handleDelegatedClick) {
        this.#acco.removeEventListener('click', this.#handleDelegatedClick);
      }

      const items = this.#getDirectElements('[data-accordion-item]');
      items.forEach((item) => {
        const body = item.querySelector('[data-accordion-body]');
        if (body) body.removeAttribute('style');
      });

      if (this.#arrowNavigator && typeof this.#arrowNavigator.destroy === 'function') {
        this.#arrowNavigator.destroy();
      }

      this.#acco = null;
      this.#arrowNavigator = null;
      this.#isAnimating = false;

      logger.info(`Accordion "${this.#id}" destroyed successfully`, null, 'Accordion');
    } catch (error) {
      logger.error('Accordion destroy failed', error, 'Accordion');
    }
  }
}