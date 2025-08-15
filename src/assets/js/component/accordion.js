import { slideUp, slideDown, ArrowNavigator, getUrlParameter } from '../utils/utils.js';
import { ACCORDION_VERSION } from "../config/versions.js";

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
    };

    this.#option = { ...defaults, ...opt };
    this.#id = this.#option.id;
    this.#expanded = this.#option.expanded;
    this.#singleOpen = this.#option.singleOpen;
    this.#acco = document.querySelector(`[data-accordion="${this.#id}"]`);
    if (!this.#acco) return; // 아코디언이 없으면 실행 중단

    this.#acco_items = this.#acco.querySelectorAll(`[data-accordion-item="${this.#id}"]`);
    this.#acco_btns = this.#acco.querySelectorAll(`[data-accordion-button="${this.#id}"]`);
    this.isAnimating = false; // ✨ 개선점: 애니메이션 상태 추적을 위한 플래그

    // handleToggle 메서드의 this 바인딩을 한 번만 수행
    this.handleToggle = this.#handleToggle.bind(this);
  }

  ver() {
    console.groupCollapsed(`%cAccordion %c${ACCORDION_VERSION.ver}`, 'color: gold; font-weight: normal;', 'color: white; font-weight: bold;'); // 기본적으로 접힌 상태
    ACCORDION_VERSION.history.forEach(item => {
      console.log(`ver: ${item.ver} \ndate: ${item.date} \ndescription: ${item.description}`);
    });
    console.log(`author: ${ACCORDION_VERSION.author}`);
    console.log(`license: ${ACCORDION_VERSION.license}`);
    console.table(this.#option);
    console.groupEnd();
  }
  
  init() {
    this.ver();
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

      accoBtn.id = btnID;
      accoBtn.setAttribute('aria-expanded', 'false');
      accoBtn.setAttribute('aria-controls', bodyID);
      if(accoTitle) { // title 요소가 있을 경우에만 aria-label 설정
        accoBtn.setAttribute('aria-label', accoTitle.textContent + ' 내용보기');
      }
      
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
    if (this.#isAnimating) return;

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
      console.warn(`Accordion item with target "${target}" not found.`);
      return;
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
      // ✨ 개선점: 아이템이 열린 후 화면에 보이도록 스크롤
      // button.closest(`[data-accordion-item="${this.#id}"]`).scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'nearest'
      // });
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
      console.warn(`Accordion item with target "${target}" not found.`);
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
      callback && callback();
    });
  }

  /**
   * 아코디언 인스턴스를 파괴하고 모든 이벤트 리스너를 제거합니다.
   */
  destroy() {
    this.#acco_btns.forEach(button => {
      button.removeEventListener('click', this.handleToggle);
    });

    // ArrowNavigator 인스턴스가 있다면 파괴 메서드 호출 (가정)
    // ArrowNavigator 클래스에 destroy 메서드가 있다면 여기에 추가
    if (this.#arrowNavigator && typeof this.#arrowNavigator.destroy === 'function') {
      this.#arrowNavigator.destroy();
    }
    this.#acco_items.forEach(item => {
      item.querySelector(`[data-accordion-body="${this.#id}"]`).removeAttribute('style');
    })

    // 필요한 경우 다른 DOM 참조 및 상태 초기화
    this.#acco = null;
    this.#acco_items = null;
    this.#acco_btns = null;
    this.#isAnimating = false;
  }

  /**
   * 아코디언 항목 목록을 업데이트합니다.
   * 동적으로 아코디언 항목이 추가되거나 제거될 때 호출합니다.
   */
  update() {
    // 기존 이벤트 리스너 제거 (이전에 등록된 버튼에 대해)
    this.#acco_btns.forEach(button => {
      button.removeEventListener('click', this.handleToggle);
    });

    // 최신 DOM 상태를 다시 스캔
    this.#acco_items = this.#acco.querySelectorAll(`[data-accordion-item="${this.#id}"]`);
    this.#acco_btns = this.#acco.querySelectorAll(`[data-accordion-button="${this.#id}"]`);

    // 새로 스캔된 항목들을 다시 초기화
    this.#initializeAccordionItems();
    
    // ArrowNavigator도 업데이트가 필요할 수 있으므로, 재초기화하거나 업데이트 메서드 호출 (가정)
    // 예를 들어, ArrowNavigator가 focusable 요소를 다시 스캔해야 하는 경우:
    // if (this.#arrowNavigator && typeof this.#arrowNavigator.update === 'function') {
    //   // this.#arrowNavigator.update();
    // } else {
    //   // 혹은 ArrowNavigator를 다시 생성할 수도 있습니다. (기존 인스턴스 파괴 후)
    //   // this.#arrowNavigator = new ArrowNavigator({...});
    // }
    console.log(`Accordion "${this.#id}" has been updated.`);
  }
}