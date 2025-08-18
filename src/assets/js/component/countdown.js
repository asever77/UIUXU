import { comma } from '../utils/utils.js';

export default class Countdown {
  constructor(opt) {
    const defaults = {
      effect: 'slot', //'base'
      speed: 40,
    };

    this.option = { ...defaults, ...opt };
    this.id = this.option.id;
    this.effect = this.option.effect;
    this.speed = this.option.speed;
    this.wrap = document.querySelector(`[data-countdown="wrap"][data-id="${this.id}"]`);
    this.number = this.option.number;
    this.baseNumber = this.wrap.textContent;
    this.lastWindowWidth = window.innerWidth;
    this.wrap.dataset.type = this.effect;

    this.height = this.wrap.offsetHeight;
    
    this.wrap.insertAdjacentHTML('afterend', `<div data-countdown="a11y" class="a11y-hidden">${this.number}</div>`);
    this.set();
  }
  
  set() {
    if (this.wrap.dataset.loaded === 'true') {
      return false;
    }
    this.wrap.dataset.loaded = true;
    this.wrap.textContent = '';

    if (this.effect === 'slot') {
      this.number = this.number + '';
      this.number.split('').forEach(item => {
        const wrapper = document.createElement('div');
        
        if (isNaN(Number(item))) {
          wrapper.dataset.countdown = 'text';
          const strip = document.createElement('div');
          strip.dataset.countdown = 'text';
          strip.textContent = item;
          wrapper.setAttribute('aria-hidden', 'true');
          wrapper.appendChild(strip);
        } else {
          wrapper.dataset.countdown = 'item';
          wrapper.dataset.number = item;
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
            strip.style.height = this.height + 'px';
            group.appendChild(strip);
          }
          wrapper.appendChild(group);
        }
        this.wrap.appendChild(wrapper);
      });
    } 
    else if (this.effect === 'updown') {
      this.number = this.number + '';
      this.number.split('').forEach(item => {
        const wrapper = document.createElement('div');
        
        if (isNaN(Number(item))) {
          wrapper.dataset.countdown = 'text';
          const strip = document.createElement('div');
          strip.dataset.countdown = 'text';
          strip.textContent = item;
          wrapper.setAttribute('aria-hidden', 'true');
          wrapper.appendChild(strip);
        } else {
          wrapper.dataset.countdown = 'item';
          wrapper.dataset.number = item;
          const group = document.createElement('div');
          group.dataset.countdown = 'group';
          wrapper.setAttribute('aria-hidden', 'true');
         
          const strip = document.createElement('div');
          strip.textContent = item;
          strip.dataset.countdown = 'number';
          strip.style.height = this.height + 'px';
          group.appendChild(strip);
          // group.style.transition = `transform 300ms ease-in-out`;
          wrapper.appendChild(group);
        }
        this.wrap.appendChild(wrapper);
      });
    } 
    else {
      this.wrap.textContent = 0;
    }
  }

  start() {
    const items = this.wrap.querySelectorAll('[data-countdown="item"]');
    const len = items.length;
    let n = 1;
    const speed = 100;
    
    if (this.effect === 'slot') {
      const act = (v) => {
        const wrap = items[v - 1];
        const group = wrap.querySelector('[data-countdown="group"]');
        const strip = group.querySelector('[data-countdown="number"]');
        let result = Number(wrap.dataset.number);

        result === 0 ? result = 10 : '';

        group.style.transition = `transform ${speed * (result + 10)}ms ease-in-out`;
        group.style.transform = `translateY(-${this.height * (result + 10)}px)`;

        setTimeout(() => {
          if (n < len) {
            n = n + 1;
            act(n);
          }
        }, (speed * (result + 10) / 4));
      };
      act(1);
    } else {
      let nn = 0;
      const act = () => {
        this.wrap.textContent = comma(nn);
        if (Number(this.number) !== nn) {
          nn = nn + 1;
          setTimeout(() => {
             act(nn);
          }, this.speed);
        }
      }
      act(nn);
    }
  }
  destroy() {
    this._destroyElements();
  }
  _destroyElements() {
    this.wrap.dataset.loaded = false;
    if (this.effect === 'slot') {
      while(this.wrap.firstChild) {
        this.wrap.removeChild(this.wrap.firstChild);
      }
      this.wrap.textContent = this.baseNumber;
    } else {
      this.wrap.textContent = 0;
    }
  }
  change(v) {
    const isIncrease = Math.sign(v) === 1; //증가이면 true, 감소이면 false
    const prevNumber = this.baseNumber;
    const insertOption = isIncrease ? 'beforeend' : 'afterbegin';
    const groups = this.wrap.querySelectorAll('[data-countdown="group"]');
    this.baseNumber = Number(this.baseNumber) + Number(v) + '';

    const act = (e) => {
      const _this = e.currentTarget;
      _this.style.transition = 'none';
      _this.style.transform = 'translateY(0)';
      const item1 = _this.querySelector('[data-countdown]:nth-child(1)');
      const item2 = _this.querySelector('[data-countdown]:nth-child(2)');
      if (isIncrease) {
        item1.remove();
      } else {
        item1.style.position = '';
        item1.style.bottom = '';
        item2.remove();
      }
      _this.removeEventListener('transitionend', act)
    }

    groups.forEach((group, index) => {
      const prev = prevNumber.split('');
      const next = this.baseNumber.split('');
      if (prev[index] !== next[index]) {
        if (isIncrease) {
          group.insertAdjacentHTML(insertOption , `<div data-countdown="number" style="height:${this.height}px">${next[index]}</div>`);
          group.style.transition = `transform 300ms ease-in-out`;
          group.style.transform = `translateY(-${this.height}px)`;
        } else {
          group.insertAdjacentHTML(insertOption , `<div data-countdown="number" style="height:${this.height}px; position:absolute; bottom:100%;">${next[index]}</div>`);
          group.style.transition = `transform 300ms ease-in-out`;
          group.style.transform = `translateY(${this.height}px)`;
        }
        group.addEventListener('transitionend', act)
      }
    });
  }
}