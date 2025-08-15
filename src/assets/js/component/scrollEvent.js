import { ScrollTrigger } from '../utils/utils.js';

export default class ScrollEvent {
  #id;
  #wrap;
  #items;
  #area;
  #callback;
  #scrolltrigger;
  #scrolltrigger2;

  constructor(opt) {
    this.#id = opt.id;
    this.#callback = opt.callback;
    this.#wrap = document.querySelector(`[data-scrollevent="${this.#id}"]`);
    this.#items = this.#wrap.querySelectorAll(`[data-scrollevent-item]`);
    this.#area = window;
    this.stepTop = 0;
    this.sum = this.#items.length;
    this.current = this.#items[0];
    this.currentHeight = this.current.getBoundingClientRect().height;
    this.currentTop = Math.trunc(this.current.getBoundingClientRect().top);
    this.arrayTop = [];
    this.arrayHeight = [];
  }
  init() {
    const percent = (Number(Math.trunc((this.currentHeight -  this.currentTop) / this.currentHeight * 100)))

    this.current.querySelector('b') ? this.current.querySelector('b').textContent = percent + '%' : '';

    this.#items.forEach((item, index) => {
      item.dataset.n = index;
      this.arrayTop.push(Math.trunc(item.getBoundingClientRect().top));
      this.arrayHeight.push(Math.trunc(item.getBoundingClientRect().height));
    });
    console.log(this.arrayTop);

    this.#area.addEventListener('scroll', this.handlerScroll.bind(this))
    const rootMarginTop2 = (window.innerHeight) * -1 + 'px';
    const rootMarginTop = '0px';
    this.#scrolltrigger = new ScrollTrigger({
      targetSelector: this.#items,
      rootMargin: `0px 0px ${rootMarginTop} 0px`, // 상단 scrollOffsetTop 안으로 들어올 때 트리거
      threshold: 0, // 1픽셀이라도 들어오면 트리거
      callback: (element) => {
        console.log(element.dataset.scrolleventItem , '--------------------------------------');
        const idx = Number(element.dataset.n);

        this.stepTop = window.scrollY;
        this.current = element;
        this.currentHeight = this.current.getBoundingClientRect().height;
      }
    });
   
  }
  handlerScroll(e) {
    this.#items.forEach(item => {
      // 오브젝트의 위치와 높이 가져오기
      const rect = item.getBoundingClientRect();
      const itemHeight = item.offsetHeight;
      const viewportHeight = window.innerHeight;
      const root = document.documentElement;
      const name = '--' + item.dataset.scrolleventItem + '-n';
      const namePer = '--' + item.dataset.scrolleventItem + '-percent';

      // 오브젝트의 상단이 화면 하단과 오브젝트의 하단이 화면 하단 사이에 있을 때만 계산
      // (즉, 오브젝트가 화면 아래에서 서서히 나타나는 구간)
      if (rect.top <= viewportHeight && rect.bottom >= viewportHeight) {
        // 퍼센트 계산
        let percent = Math.max(0, Math.min(100, ((viewportHeight - rect.top) / itemHeight) * 100));
        const per = Math.trunc(percent);

        // 텍스트 업데이트
        if (item.querySelector('b')) {
          item.querySelector('b').textContent = per;
        }

        root.style.setProperty(namePer, `${Math.trunc(percent)}%`);
        root.style.setProperty(name, `${Math.trunc(percent) / 100}`);

         this.#callback && this.#callback({
          percent: per,
          target: item
        });
      } else {
        // 오브젝트가 화면 밖에 있을 때
        if (rect.top > viewportHeight) {
          // 화면 아래에 있으면 0%
          if (item.querySelector('b')) item.querySelector('b').textContent = '0%';
          root.style.setProperty(namePer, `0%`);
          root.style.setProperty(name, `0`);
        } else {
          // 화면 하단을 지나 위로 올라갔으면 100%
          if (item.querySelector('b')) item.querySelector('b').textContent = '100%';
          root.style.setProperty(namePer, `100%`);
          root.style.setProperty(name, `1`);
        }
      }
    });
  }
  // handlerScroll(e) {
  //   const idx = Number(this.current.dataset.n);

  //   console.log( window.scrollY - this.stepTop, this.currentHeight, this.arrayHeight[idx]);

  //   const percent = Number(Math.trunc((window.scrollY -  this.stepTop) / this.currentHeight * 100));
  //   const prevItem = this.#items[idx - 1];
  //   const nextItem = this.#items[idx + 1];

  //   if (idx === 0) {

  //   } else if (this.sum - 1 === idx) {

  //   } else {
  //     prevItem.querySelector('b').textContent =  Number(Math.abs((window.scrollY - this.stepTop) / prevItem.getBoundingClientRect().height * 100).toFixed(2)) + '%';
  //     nextItem.querySelector('b').textContent = 100 - Number(Math.abs((window.scrollY - this.stepTop) / nextItem.getBoundingClientRect().height * 100).toFixed(2)) + '%';
  //   }

  //   // console.log(window.scrollY);
  //   this.current.querySelector('b').textContent = percent + '%';
  // }
} 