export default class Countdown {
  constructor(opt) {
    this.id = opt.id;
    this.wrap = document.querySelector(`[data-countdown="wrap"][data-id="${this.id}"]`);
    this.number = opt.number;
    this.set();
  }

  set() {
    this.number.split('').forEach(item => {
      const wrapper = document.createElement('div');
      // this.wrap.textContent = ''

      if (isNaN(Number(item))) {
        wrapper.dataset.countdown = 'text';
        const strip = document.createElement('div');
        strip.dataset.countdown = 'text';
        strip.textContent = item;
        wrapper.appendChild(strip);
      } else {
        wrapper.dataset.countdown = 'item';
        wrapper.dataset.number = item;   
        const group = document.createElement('div');
        group.dataset.countdown = 'group';

        for (let i = 0; i <= 20; i++) {
          const strip = document.createElement('div');
          strip.dataset.countdown = 'number';
          if (i === 20) {
            strip.textContent = 0;
          } else {
            strip.textContent = i >= 10 ? i - 10 : i;
          }
          group.appendChild(strip);
        }

        wrapper.appendChild(group);
      }

      this.wrap.appendChild(wrapper);
    });
  }

  start() {
    const items = this.wrap.querySelectorAll('[data-countdown="item"]');
    const len = items.length;
    let n = 1;
    const speed = 100;

    const act = (v) => {
      const wrap = items[v - 1];
      const group = wrap.querySelector('[data-countdown="group"]');
      const strip = group.querySelector('[data-countdown="number"]');
      const h = strip.offsetHeight;
      let result = Number(wrap.dataset.number);

      result === 0 ? result = 10 : '';

      group.style.transition = `transform ${speed * (result + 10)}ms ease-in-out`;
      group.style.transform = `translateY(-${h * (result + 10)}px)`;

      setTimeout(() => {
        if (n < len) {
          n = n + 1;
          act(n); 
        }
      }, (speed * (result + 10) / 4))
    }
    act(1);
  }
}