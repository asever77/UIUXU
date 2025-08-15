export default class LuckyRoulette {
  constructor (opt) {
    this.roulette = document.querySelector('.lucky-roulette');
    this.wrap = this.roulette.querySelector('.lucky-roulette--item');
    this.button = this.roulette.querySelector('.lucky-roulette--start');
    this.arrow = this.roulette.querySelector('.lucky-roulette--arrow');
    this.data = opt.data;
    this.baseDeg = 360 * (opt.turns ? opt.turns : 5);
    this.speed = opt.speed ? opt.speed : 6000;
    this.callback = opt.callback;
    this.sum = this.data.point.length;
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
  act() {
    this.button.disabled = true;
    this.callback();
  }
  reset(data) {
    if (data) this.data = data;
    this.roulette.dataset.type = this.data.type;
    const points = this.roulette.querySelectorAll('.lucky-roulette--point');
    if (points) points.forEach(item => item.remove());
    this.data.point.forEach((item, index) => {
      this.roulette.querySelector('.lucky-roulette--item-bg').insertAdjacentHTML('beforeend', `<div class="lucky-roulette--point n${index}">${OcareUI.parts.comma(item)}P</div>`)
    });
  }
  play (opt) {
    const playCallback = opt.callback;
    let _deg = 0;
    this.data.point.forEach(element => {
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
      playCallback(opt.result);
    });
  }
}