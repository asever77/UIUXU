export default class RangeSlider {
  constructor(opt) {
    const defaults = {
      tooltip :true,
      range: 19,
    };

    this.option = { ...defaults, ...opt };
    this.rangeSlider = document.querySelector(`[data-rangeslider="${this.option.id}"]`);
    this.rangeInput = document.querySelector(`#${this.option.id}`);
    this.tooltip = this.option.tooltip;
    this.range = this.option.range;
    this.pointerWidth = this.option.pointerWidth;
    this.rangeLabel = null;
    this.updateRangeStyle = this.updateRangeStyle.bind(this);
    this.min = parseInt(this.rangeInput.min, 10);
    this.max = parseInt(this.rangeInput.max, 10);

    this.init()
  }

  init() {
    if (this.tooltip) {
      console.log(this.rangeSlider)
      this.rangeSlider.insertAdjacentHTML('beforeend',`<div data-rangeslider-label="${this.option.id}">${this.rangeInput.min}~${this.rangeInput.max}</div>`);
      this.rangeLabel = this.rangeSlider.querySelector('[data-rangeslider-label]');
    }

    this.updateRangeStyle(this.rangeInput);
    this.rangeInput.addEventListener('input', this.updateRangeStyle);

    window.addEventListener('resize', () => {
      this.updateRangeLabel(parseInt(this.rangeInput.value, 10));
    });
  }

  updateRangeStyle(e) {
    let value;
    if (e.target) {
      value = (parseInt(e.target.value, 10));
    } else  {
      value = (parseInt(e.value, 10));
    }

    const percent = ((value - this.min) / (this.max - this.min)) * 100;
    this.rangeInput.style.setProperty('--percent', `${percent}%`);
    this.tooltip && this.updateRangeLabel(value);
  }
  updateRangeLabel(value) {
    const range = this.max - this.min;
    const end = value + this.range > this.max ? this.max : value + this.range;
    this.rangeLabel.textContent = (this.range === 0) ? value : `${value} ~ ${end}`;
    const percent = (value - this.min) / range;
    const left = percent * 100 ;
    const add = left < 50 ? 
    (this.pointerWidth / 2) * (Math.abs((left - 50) * 2) / 100) :
    (this.pointerWidth / 2) * (Math.abs((left - 50) * 2) / 100) * -1;
    this.rangeLabel.style.left = `calc(${left}% + ${add}px)`;
  }
}