export default class Roulette {
  constructor (opt) {
    this.id = opt.id;
    this.roulette = document.querySelector(`[data-roulette="${this.id}"]`);
    this.wrap = this.roulette.querySelector('[data-roulette="wrap"]');
    this.button = this.roulette.querySelector('[data-roulette="start"]');
    this.arrow = this.roulette.querySelector('[data-roulette="arrow"]');
    this.group = this.roulette.querySelector('[data-roulette="group"]');
    this.data = opt.data;
    this.baseDeg = 360 * (opt.turns ? opt.turns : 5);
    this.speed = opt.speed ? opt.speed : 6000;
    this.start = opt.start;
    this.sum = this.data.length;
    this.deg = 360 / this.sum;
    this.scope = ((Math.floor(Math.random() * (this.deg - 10))) / 2) * (Math.random() < 0.5 ? -1 : 1);
    this.degData = [];
    this.eventAct = this.act.bind(this);
    this.init();
  }

  init () {
    this.wrap.style.transition = `transform ${this.speed}ms cubic-bezier(0.32, 0.92, 0.71, 1.01)`;
    this.button.addEventListener('click', this.eventAct);
    this.reset();
  }

  reset(data) {
    if (data) this.data = data;
    this.sum = this.data.length;
    this.deg = 360 / this.sum;

    this.wrap.style.transition = '';
    this.wrap.style.transform = '';
    this.group.style.transform = `rotate(90deg)`;

    this.button.disabled = false;
    this.button.classList.remove('off');
    this.arrow.classList.remove('off');

    this.roulette.querySelectorAll('[data-roulette="item"]').forEach(el => el.remove());
    this.data.forEach((item, index) => {
      this.group.insertAdjacentHTML('beforeend', `
        <div data-roulette="item" style="transform:rotate(${360 - (this.deg * index)}deg) translateX(-50%);">
          <div>${item}</div>
          <div data-roulette="line" style="transform:rotate(${(this.deg / 2)}deg);"></div>
        </div>`);
    });

    setTimeout(() => {
      this.wrap.style.transition = `transform ${this.speed}ms cubic-bezier(0.32, 0.92, 0.71, 1.01)`;
    }, 0);
  }

  act() {
    this.button.disabled = true;
    this.start();
  }
  
  play (opt) {
    const callback = opt.callback;
    const result = opt.result;

    let accumulatedDeg = 0;
    this.degData = [];
    this.data.forEach(value => {
      this.degData.push([value, accumulatedDeg]);
      accumulatedDeg += this.deg;
    });
    
    const candidates = this.degData.filter(item => item[0] === result);
    const randomIndex = Math.floor(Math.random() * candidates.length);
  
    this.wrap.style.transform = `rotate(${candidates[randomIndex][1] + this.baseDeg + this.scope}deg)`;
    this.arrow.classList.add('on');

    this.wrap.addEventListener('transitionend', () => {
      this.arrow.classList.remove('on');
      this.arrow.classList.add('off');
      this.button.classList.add('off');
      this.roulette.dataset.state="complete";

      this.button.disabled = false;
      callback && callback(result);
    }, { once: true });
  }
}