import { comma } from '../utils/utils.js';

export default class Countdown {
  // private 필드 정의
  #option;
  #id;
  #effect;
  #speed;
  #wrap;
  #targetNumber;
  #initialTextContent;
  #lastWindowWidth;
  #height;
  #isAnimating = false;

  constructor(opt) {
    const defaults = {
      effect: 'slot', //'base'
      speed: 40,
    };

    this.#option = { ...defaults, ...opt };
    this.#id = this.#option.id;
    this.#effect = this.#option.effect;
    this.#speed = this.#option.speed;
    this.#wrap = document.querySelector(`[data-countdown="wrap"][data-id="${this.#id}"]`);
    this.#targetNumber = this.#option.number;
    this.#initialTextContent = this.#wrap.textContent;
    this.#lastWindowWidth = window.innerWidth;
    this.#wrap.dataset.type = this.#effect;
    this.#height = this.#wrap.offsetHeight;

    this.#wrap.insertAdjacentHTML('afterend', `<div data-countdown="a11y" class="a11y-hidden">${this.#targetNumber}</div>`);
    this.initializeElements();
  }

  initializeElements() {
    if (this.#wrap.dataset.loaded === 'true') {
      return false;
    }
    this.#wrap.dataset.loaded = true;
    this.#wrap.textContent = '';

    if (this.#effect === 'slot') {
      this.#targetNumber = this.#targetNumber + '';
      this.#targetNumber.split('').forEach(char => {
        const wrapper = document.createElement('div');

        if (isNaN(Number(char))) {
          wrapper.dataset.countdown = 'text';
          const strip = document.createElement('div');
          strip.dataset.countdown = 'text';
          strip.textContent = char;
          wrapper.setAttribute('aria-hidden', 'true');
          wrapper.appendChild(strip);
        } else {
          wrapper.dataset.countdown = 'item';
          wrapper.dataset.number = char;
          const group = document.createElement('div');
          group.dataset.countdown = 'group';
          wrapper.setAttribute('aria-hidden', 'true');
          for (let i = 0; i <= 20; i++) {
            const strip = document.createElement('div');
            strip.dataset.countdown = 'number';
            if (i === 20) {
              strip.textContent = 0;
            } else {
              strip.textContent = i >= 10 ? i - 10 : i;
            }
            strip.style.height = this.#height + 'px';
            group.appendChild(strip);
          }
          wrapper.appendChild(group);
        }
        this.#wrap.appendChild(wrapper);
      });
    } else if (this.#effect === 'updown') {
      this.#targetNumber = this.#targetNumber + '';
      this.#targetNumber.split('').forEach(char => {
        const wrapper = document.createElement('div');

        if (isNaN(Number(char))) {
          wrapper.dataset.countdown = 'text';
          const strip = document.createElement('div');
          strip.dataset.countdown = 'text';
          strip.textContent = char;
          wrapper.setAttribute('aria-hidden', 'true');
          wrapper.appendChild(strip);
        } else {
          wrapper.dataset.countdown = 'item';
          wrapper.dataset.number = char;
          const group = document.createElement('div');
          group.dataset.countdown = 'group';
          wrapper.setAttribute('aria-hidden', 'true');

          const strip = document.createElement('div');
          strip.textContent = char;
          strip.dataset.countdown = 'number';
          strip.style.height = this.#height + 'px';
          group.appendChild(strip);
          wrapper.appendChild(group);
        }
        this.#wrap.appendChild(wrapper);
      });
    } else {
      this.#wrap.textContent = 0;
    }
  }

  start() {
    const items = this.#wrap.querySelectorAll('[data-countdown="item"]');
    const totalItems = items.length;
    let itemIndex = 1;
    const animationSpeed = 100;

    if (this.#effect === 'slot') {
      const animateItem = (index) => {
        const wrap = items[index - 1];
        const group = wrap.querySelector('[data-countdown="group"]');
        let targetDigit = Number(wrap.dataset.number);

        targetDigit === 0 ? targetDigit = 10 : '';

        group.style.transition = `transform ${animationSpeed * (targetDigit + 10)}ms ease-in-out`;
        group.style.transform = `translateY(-${this.#height * (targetDigit + 10)}px)`;

        setTimeout(() => {
          if (itemIndex < totalItems) {
            itemIndex = itemIndex + 1;
            animateItem(itemIndex);
          }
        }, (animationSpeed * (targetDigit + 10) / 4));
      };
      animateItem(1);
    } else {
      let currentNumber = 0;
      const animateCountUp = () => {
        this.#wrap.textContent = comma(currentNumber);
        if (Number(this.#targetNumber) !== currentNumber) {
          currentNumber = currentNumber + 1;
          setTimeout(() => {
            animateCountUp(currentNumber);
          }, this.#speed);
        }
      }
      animateCountUp(currentNumber);
    }
  }

  destroy() {
    this.#destroyElements();
  }

  #destroyElements() {
    this.#wrap.dataset.loaded = false;
    if (this.#effect === 'slot') {
      while (this.#wrap.firstChild) {
        this.#wrap.removeChild(this.#wrap.firstChild);
      }
      this.#wrap.textContent = this.#initialTextContent;
    } else {
      this.#wrap.textContent = 0;
    }
  }

  change(value) {
    const isIncrease = Math.sign(value) === 1; //증가이면 true, 감소이면 false
    const previousNumber = this.#initialTextContent;
    const insertOption = isIncrease ? 'beforeend' : 'afterbegin';
    const groups = this.#wrap.querySelectorAll('[data-countdown="group"]');
    this.#initialTextContent = Number(this.#initialTextContent) + Number(value) + '';

    if (this.#isAnimating === true) {
      return false;
    }

    this.#isAnimating = true;

    const onTransitionEnd = (e) => {
      const _this = e.currentTarget;
      _this.style.transition = 'none';
      _this.style.transform = 'translateY(0)';
      const firstItem = _this.querySelector('[data-countdown]:nth-child(1)');
      const secondItem = _this.querySelector('[data-countdown]:nth-child(2)');

      if (isIncrease) {
        firstItem.remove();
      } else {
        firstItem.style.position = '';
        firstItem.style.bottom = '';
        secondItem.remove();
      }
      this.#isAnimating = false;
      _this.removeEventListener('transitionend', onTransitionEnd);
    }

    groups.forEach((group, index) => {
      const prev = previousNumber.split('');
      const next = this.#initialTextContent.split('');
      if (prev[index] !== next[index]) {
        if (isIncrease) {
          group.insertAdjacentHTML(insertOption, `<div data-countdown="number" style="height:${this.#height}px">${next[index]}</div>`);
          group.style.transition = `transform 300ms ease-in-out`;
          group.style.transform = `translateY(-${this.#height}px)`;
        } else {
          group.insertAdjacentHTML(insertOption, `<div data-countdown="number" style="height:${this.#height}px; position:absolute; bottom:100%;">${next[index]}</div>`);
          group.style.transition = `transform 300ms ease-in-out`;
          group.style.transform = `translateY(${this.#height}px)`;
        }
        group.addEventListener('transitionend', onTransitionEnd)
      }
    });
  }
}