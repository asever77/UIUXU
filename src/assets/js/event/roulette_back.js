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
    const points = this.roulette.querySelectorAll('.roulette--point');
    const deg = 360 / this.sum;
    this.group.style.transform = `rotate(90deg)`;

    if (points) points.forEach(item => item.remove());
    this.data.forEach((item, index) => {
      this.group.insertAdjacentHTML('beforeend', `
      <div data-roulette="item" style="transform:rotate(${(deg * index)}deg) translateX(-50%);">
        <div>${item}</div>
        <div data-roulette="line" style="transform:rotate(${(deg / 2)}deg);"></div>
      </div>`);
    });
  }

  act() {
    this.button.disabled = true;
    this.start();
  }
  
  play (opt) {
    const playCallback = opt.callback;
    let _deg = 0;
    this.data.forEach(element => {
      this.degData.push([element, _deg]);
      _deg = _deg + this.deg;
    });
    const result = opt.result;
    const filteredDegData = this.degData.filter(item => item[0] === result);
    const radom = Math.floor(Math.random() * filteredDegData.length) ;
    this.wrap.style.transform = `rotate(${filteredDegData[radom][1] + this.baseDeg + this.scope}deg)`;
    this.arrow.classList.add('on');
    this.wrap.addEventListener('transitionend', () => {
      this.arrow.classList.remove('on');
      this.arrow.classList.add('off');
      this.button.classList.add('off');
      this.roulette.dataset.state="complete";
      this.callback && this.callback(opt.result);
    });
  }
}