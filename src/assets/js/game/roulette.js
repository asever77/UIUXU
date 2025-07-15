export default class Roulette {
  constructor (opt) {
    this.roulette = document.querySelector('.lucky-roulette');
    this.wrap = this.roulette.querySelector('.lucky-roulette--wrap');
    this.button = this.roulette.querySelector('.lucky-roulette--start');
    this.arrow = this.roulette.querySelector('.lucky-roulette--arrow');
    this.data = opt.data;
    this.baseDeg = 360 * (opt.turns ? opt.turns : 5);
    this.speed = opt.speed ? opt.speed : 6000;
    this.callback = opt.callback;

    this.sum = this.data.length;
    this.deg = 360 / this.sum;
    this.scope = ((Math.floor(Math.random() * (this.deg - 1)) + 1) / 2) * (Math.random() < 0.5 ? -1 : 1);

    this.degData = [];
    this.eventAct = this.act.bind(this);
    
    this.init();
  }
  init () {
    let _deg = 0;
    this.data.forEach(element => {
      this.degData.push([element, _deg]);
      _deg = _deg + this.deg;
    });
    this.wrap.style.transition = `transform ${this.speed}ms cubic-bezier(0.32, 0.92, 0.71, 1.01)`;
    this.button.addEventListener('click', this.eventAct);
  }
  act() {
    this.button.disabled = true;
    this.callback();
  }
  play (opt) {
    const result = opt.result;
    const filteredDegData = this.degData.filter(item => item[0] === result);
    const radom = Math.floor(Math.random() * filteredDegData.length) ;
    this.wrap.style.transform = `rotate(${filteredDegData[radom][1] + this.baseDeg + this.scope}deg)`;
  }
}