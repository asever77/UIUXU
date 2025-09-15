export default class RangeSlider {
  constructor(opt) {
    this.id = opt.id;
    this.title = opt.title || '';
    this.step = opt.step || 1;
    this.tickmark = opt.tickmark || false;
    this.orientation = opt.orientation || 'horizontal';
    this.isVertical = this.orientation === 'vertical';
    this.minGap = typeof opt.minGap === 'number' ? opt.minGap : 0;
    this.formatValue = typeof opt.formatValue === 'function' ? opt.formatValue : null;
    this.onInput = typeof opt.onInput === 'function' ? opt.onInput : null;
    this.onChange = typeof opt.onChange === 'function' ? opt.onChange : null;
    this.mode = opt.mode || 'range'; // 'single' | 'range'

    this.el_range = document.querySelector(`.ui-range[data-id="${this.id}"]`);
    if (!this.el_range) {
      console.error(`Element with data-id="${this.id}" not found.`);
      return;
    }

    this.el_from = this.el_range.querySelector('.ui-range-inp[data-range="from"]');
    this.el_to = this.el_range.querySelector('.ui-range-inp[data-range="to"]');
    this.isRange = this.mode !== 'single' && !!this.el_to;

    const initialValues = opt.initialValues || opt.value || [Number(this.el_from?.value) || 0, Number(this.el_to?.value) || Number(this.el_from?.value) || 0];
    this.values = Array.isArray(initialValues) ? initialValues : [initialValues, initialValues];

    this.min = typeof opt.min === 'number' ? opt.min : Number(this.el_from.min || 0);
    this.max = typeof opt.max === 'number' ? opt.max : Number(this.el_from.max || 100);

    this.eventName = 'input';
  }

  init() {
    this.el_range.setAttribute('data-orient', this.isVertical ? 'vertical' : 'horizontal');
    if (!this.isRange && this.el_to) {
      this.el_to.setAttribute('hidden', '');
    }
    this.setupInputs();
    this.renderSlider();
    this.updateSlider();
    this.bindEvents();
  }

  setupInputs() {
    this.el_from.min = this.min;
    this.el_from.max = this.max;
    this.el_from.step = this.step;
    this.el_from.value = this.values[0];

    if (this.isRange && this.el_to) {
      this.el_to.min = this.min;
      this.el_to.max = this.max;
      this.el_to.step = this.step;
      this.el_to.value = this.values[1];
    }

    // ARIA setup
    const ariaOrientation = this.isVertical ? 'vertical' : 'horizontal';
    this.el_from.setAttribute('role', 'slider');
    this.el_from.setAttribute('aria-orientation', ariaOrientation);
    this.el_from.setAttribute('aria-valuemin', String(this.min));
    this.el_from.setAttribute('aria-valuemax', String(this.max));
    if (this.isRange && this.el_to) {
      this.el_to.setAttribute('role', 'slider');
      this.el_to.setAttribute('aria-orientation', ariaOrientation);
      this.el_to.setAttribute('aria-valuemin', String(this.min));
      this.el_to.setAttribute('aria-valuemax', String(this.max));
    }
  }

  renderSlider() {
    const existingTrack = this.el_range.querySelector('.ui-range-track');
    const existingMarks = this.el_range.querySelectorAll('.ui-range-marks');

    existingTrack?.remove();
    existingMarks.forEach(mark => mark.remove());

    let html = `
      <div class="ui-range-track">
        <div class="ui-range-bar"></div>
        <span class="left ui-range-point" data-range="from" aria-hidden="true">
          <em class="ui-range-txt" data-from="${this.id}"></em>
        </span>
    `;

    if (this.isRange && this.el_to) {
      html += `
        <span class="right ui-range-point" data-range="to" aria-hidden="true">
          <em class="ui-range-txt" data-to="${this.id}"></em>
        </span>
      `;
    }

    html += `</div>`;

    if (this.tickmark) {
      const len = this.tickmark.length;
      const stepValue = (this.max - this.min) / (len - 1);

      html += `<div class="ui-range-marks" id="${this.id}_tickmarks_from" data-from="true">`;
      for (let i = 0; i < len; i++) {
        const value = this.min + (stepValue * i);
        html += this.createTickmarkButton(value, 'from', this.title, this.tickmark[i]);
      }
      html += '</div>';

      if (this.isRange && this.el_to) {
        html += `<div class="ui-range-marks" id="${this.id}_tickmarks_to" data-to="true">`;
        for (let i = 0; i < len; i++) {
          const value = this.min + (stepValue * i);
          html += this.createTickmarkButton(value, 'to', this.title, this.tickmark[i]);
        }
        html += '</div>';
      }
    }

    this.el_range.insertAdjacentHTML('beforeend', html);
    this.el_left = this.el_range.querySelector(".ui-range-point.left");
    this.el_right = this.el_range.querySelector(".ui-range-point.right");
    this.el_bar = this.el_range.querySelector(".ui-range-bar");
    this.el_marks_from = this.el_range.querySelector(`#${this.id}_tickmarks_from`);
    this.el_marks_to = this.el_range.querySelector(`#${this.id}_tickmarks_to`);

    // Cache text nodes within this range root
    this.$txtFrom = this.el_range.querySelectorAll(`[data-from="${this.id}"]`);
    this.$txtTo = this.el_range.querySelectorAll(`[data-to="${this.id}"]`);
  }

  createTickmarkButton(value, type, title, text) {
    const selectedState = '';
    const ariaLabel = type === 'to' ? `${title} 최대` : `${title} 최소`;
    return `
      <button type="button" class="ui-range-btn" data-id="${this.id}" data-value="${value}" aria-pressed="false">
        <span class="a11y-hidden">${ariaLabel} </span>
        <span>${text}</span>
        <span class="a11y-hidden state">${selectedState}</span>
      </button>
    `;
  }

  bindEvents() {
    // Input events
    this.el_from.addEventListener(this.eventName, this.updateSlider);
    this.el_from.addEventListener('change', this.handleChange);
    if (this.isRange && this.el_to) {
      this.el_to.addEventListener(this.eventName, this.updateSlider);
      this.el_to.addEventListener('change', this.handleChange);
    }

    // Tickmark events
    this.el_range.querySelectorAll('.ui-range-btn').forEach(btn => {
      btn.addEventListener('click', this.handleClick);
    });

    // Handle events for slider points (mouse/touch)
    if (!this.isCoarsePointer()) {
      this.el_left?.addEventListener('mouseover', this.handlePointHover);
      if (this.isRange && this.el_to) {
        this.el_right?.addEventListener('mouseover', this.handlePointHover);
      }
    } else {
      this.el_left?.addEventListener('touchstart', this.handlePointTouch);
      if (this.isRange && this.el_to) {
        this.el_right?.addEventListener('touchstart', this.handlePointTouch);
      }
    }
  }

  updateSlider = (e) => {
    if (e) {
      const _this = e.currentTarget;
      const type = _this.dataset.range;
      
      if (type === 'from') {
        this.updateFromRange();
      } else if (this.isRange && this.el_to) {
          this.updateToRange();
      }
    } else {
      this.updateFromRange();
      if (this.isRange && this.el_to) {
        this.updateToRange();
      }
    }
    if (this.isRange && this.el_to) {
      this.checkSameValue();
    } 

    // Callbacks on input
    if (this.onInput) {
      this.onInput({ from: Number(this.el_from.value), to: this.isRange && this.el_to ? Number(this.el_to.value) : undefined });
    }
  }

  handleChange = () => {
    if (this.onChange) {
      this.onChange({ from: Number(this.el_from.value), to: this.isRange && this.el_to ? Number(this.el_to.value) : undefined });
    }
  }

  updateFromRange(value = this.el_from.value) {
    let fromValue = +value;
    if (this.isRange && this.el_to) {
      const minAllowed = +this.el_to.value - this.minGap;
      if (fromValue > minAllowed) {
        fromValue = minAllowed;
      }
      this.el_from.value = fromValue;
    }

    const percent = ((fromValue - this.min) / (this.max - this.min)) * 100;
    this.el_left.style.left = `${percent}%`;
    this.el_bar.style.left = `${percent}%`;
    this.el_from.setAttribute('aria-valuenow', String(fromValue));
    this.el_from.setAttribute('aria-label', `${this.title} 최소 ${this.format(fromValue)}`);

    this.updateTextDisplay('from', fromValue);
    this.updateTickmarks('from', fromValue);
    this.el_range.setAttribute('data-from', fromValue);
    this.el_from.classList.add('on');
    this.el_left.classList.add('on');
    this.el_to?.classList.remove('on');
    this.el_right?.classList.remove('on');
  }

  updateToRange(value = this.el_to.value) {
    let toValue = +value;
    const maxAllowed = +this.el_from.value + this.minGap;
    if (toValue < maxAllowed) {
      toValue = maxAllowed;
      this.el_to.value = toValue;
    }

    const percent = ((toValue - this.min) / (this.max - this.min)) * 100;
    this.el_right.style.right = `${100 - percent}%`;
    this.el_bar.style.right = `${100 - percent}%`;
    this.el_to.setAttribute('aria-valuenow', String(toValue));
    this.el_to.setAttribute('aria-label', `${this.title} 최대 ${this.format(toValue)}`);

    this.updateTextDisplay('to', toValue);
    this.updateTickmarks('to', toValue);
    this.el_range.setAttribute('data-to', toValue);
    this.el_to.classList.add('on');
    this.el_right.classList.add('on');
    this.el_from.classList.remove('on');
    this.el_left.classList.remove('on');
  }

  updateTextDisplay(type, value) {
    const selector = type === 'from' ? `[data-from="${this.id}"]` : `[data-to="${this.id}"]`;
    const elements = this.el_range.querySelectorAll(selector);
    elements.forEach(el => {
      el.textContent = this.format(value);
    });
  }

  updateTickmarks(type, currentValue) {
    if (!this.tickmark) return;

    const fromMarks = this.el_marks_from?.querySelectorAll('.ui-range-btn') || [];
    const toMarks = this.el_marks_to?.querySelectorAll('.ui-range-btn') || [];
    
    // Update 'from' tickmarks
    fromMarks.forEach(btn => {
      const btnValue = Number(btn.dataset.value);
      this.resetTickmarkState(btn);
      if (currentValue === btnValue) {
        this.setTickmarkState(btn, 'from', '선택됨');
      } else if (this.el_to && Number(this.el_to.value) < btnValue) {
        this.setTickmarkDisabled(btn);
      }
    });

    // Update 'to' tickmarks
    if (this.el_to) {
      toMarks.forEach(btn => {
        const btnValue = Number(btn.dataset.value);
        this.resetTickmarkState(btn);
        if (Number(this.el_to.value) === btnValue) {
          this.setTickmarkState(btn, 'to', '선택됨');
        } else if (Number(this.el_from.value) > btnValue) {
          this.setTickmarkDisabled(btn);
        }
      });
    }
  }

  resetTickmarkState(btn) {
    btn.dataset.from = 'false';
    btn.dataset.to = 'false';
    btn.querySelector('.state').textContent = '';
    btn.disabled = false;
    btn.removeAttribute('tabindex');
    btn.setAttribute('aria-pressed', 'false');
  }

  setTickmarkState(btn, type, stateText) {
    btn.dataset[type] = 'true';
    btn.querySelector('.state').textContent = stateText;
    btn.setAttribute('aria-pressed', 'true');
  }

  setTickmarkDisabled(btn) {
    btn.disabled = true;
    btn.setAttribute('tabindex', -1);
    btn.setAttribute('role', 'none');
  }

  checkSameValue() {
    if (this.el_from.value === this.el_to.value) {
      this.el_range.classList.add('same');
    } else {
      this.el_range.classList.remove('same');
    }
  }

  handleClick = (e) => {
    const btn = e.currentTarget;
    const value = Number(btn.dataset.value);
    const marks = btn.closest('.ui-range-marks');
    const isFrom = !!marks.dataset.from;
    
    if (isFrom) {
      this.updateFromRange(value);
    } else {
      this.updateToRange(value);
    }
  }

  handlePointHover = (e) => {
    const rangeType = e.currentTarget.dataset.range;
    if (rangeType === 'to') {
      this.el_to.classList.add('on');
      this.el_from.classList.remove('on');
      this.el_to.focus();
    } else {
      this.el_from.classList.add('on');
      this.el_to?.classList.remove('on');
      this.el_from.focus();
    }
  }

  handlePointTouch = (e) => {
    const rangeType = e.currentTarget.dataset.range;
    if (rangeType === 'to') {
      this.el_right.classList.add('on');
      this.el_left.classList.remove('on');
      this.el_to.classList.add('on');
      this.el_from.classList.remove('on');
      this.el_to.focus();
    } else {
      this.el_left.classList.add('on');
      this.el_right.classList.remove('on');
      this.el_from.classList.add('on');
      this.el_to.classList.remove('on');
      this.el_from.focus();
    }
  }

  isCoarsePointer() {
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  }

  format(value) {
    return this.formatValue ? this.formatValue(value) : String(value);
  }

  destroy() {
    // remove events
    this.el_from.removeEventListener(this.eventName, this.updateSlider);
    this.el_from.removeEventListener('change', this.handleChange);
    if (this.isRange && this.el_to) {
      this.el_to.removeEventListener(this.eventName, this.updateSlider);
      this.el_to.removeEventListener('change', this.handleChange);
    }
    this.el_range.querySelectorAll('.ui-range-btn').forEach(btn => {
      btn.removeEventListener('click', this.handleClick);
    });
    this.el_left?.removeEventListener('mouseover', this.handlePointHover);
    this.el_right?.removeEventListener('mouseover', this.handlePointHover);
    this.el_left?.removeEventListener('touchstart', this.handlePointTouch);
    this.el_right?.removeEventListener('touchstart', this.handlePointTouch);

    // remove generated DOM
    this.el_range.querySelector('.ui-range-track')?.remove();
    this.el_range.querySelectorAll('.ui-range-marks')?.forEach(n => n.remove());
  }
}

// To use this class, you would create a new instance like this:
// const mySlider = new RangeSlider({
//   id: 'your_slider_id',
//   value: [0, 50],
//   title: 'Your Slider Title',
//   min: 0,
//   max: 100,
//   step: 1,
//   text: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
//   tickmark: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100']
// });