export default class WheelPicker2 {
  // 클래스 내부 static 속성으로 상수 정의
  static DEFAULT_OPTIONS = {
    el: '',
    type: 'infinite',
    count: 20,
    sensitivity: 0.8,
    source: [],
    value: null,
    onChange: null
  };

  static EASING = {
    easeOutQuart: function(pos) {
      return -(Math.pow((pos - 1), 4) - 1);
    }
  };

  constructor(options) {
    this.options = { ...WheelPicker2.DEFAULT_OPTIONS, ...options };
    this.options.count = this.options.count - this.options.count % 4;
    Object.assign(this, this.options);

    this.halfCount = this.options.count / 2;
    this.quarterCount = this.options.count / 4;
    this.deceleration = this.options.sensitivity * 10;
    this.minVelocity = Math.sqrt(1 / this.deceleration);

    this.selected = null;
    this.exceedDeceleration = 10;
    this.animationFrameId = null;
    this.isMoving = false;

    this.elements = {
      container: document.querySelector(this.options.el),
      circleList: null,
      circleItems: null,
      highlight: null,
      highlightList: null,
      highlightItems: null
    };

    // Calculate dimensions
    this.itemHeight = this.elements.container.offsetHeight * 3 / this.options.count;
    this.itemAngle = 360 / this.options.count;
    this.radius = this.itemHeight / Math.tan(this.itemAngle * Math.PI / 180);

    this.scroll = 0; // In units of item height (or degrees)
    this.touchData = {
      startY: 0,
      yHistory: [],
      scroll: 0
    };

    this._init();
  }

  _init() {
    this._create(this.options.source);

    // Set up event listeners
    this.elements.container.addEventListener('mousedown', this._handleStart);
    this.elements.container.addEventListener('touchstart', this._handleStart, {
      passive: false
    });
    document.addEventListener('mouseup', this._handleEnd);
    document.addEventListener('touchend', this._handleEnd);

    if (this.source.length) {
      this.value = this.value !== null ? this.value : this.source[0].value;
      this.select(this.value);
    }
  }

  _handleStart = (e) => {
    e.preventDefault();
    if (!this.source.length) return;

    // Add mousemove and touchmove listeners
    document.addEventListener('mousemove', this._handleMove);
    document.addEventListener('touchmove', this._handleMove, {
      passive: false
    });

    const eventY = e.clientY || e.touches[0].clientY;
    this.touchData.startY = eventY;
    this.touchData.yHistory = [
      [eventY, new Date().getTime()]
    ];
    this.touchData.scroll = this.scroll;
    this._stopAnimation();
  };

  _handleMove = (e) => {
    const eventY = e.clientY || e.touches[0].clientY;
    this.touchData.yHistory.push([eventY, new Date().getTime()]);

    if (this.touchData.yHistory.length > 5) {
      this.touchData.yHistory.shift();
    }

    const scrollChange = (this.touchData.startY - eventY) / this.itemHeight;
    let targetScroll = this.scroll + scrollChange;

    if (this.type === 'normal') {
      if (targetScroll < 0) {
        targetScroll *= 0.3;
      } else if (targetScroll > this.source.length - 1) {
        targetScroll = (this.source.length - 1) + (targetScroll - (this.source.length - 1)) * 0.3;
      }
    } else {
      targetScroll = this._normalizeScroll(targetScroll);
    }

    this.touchData.scroll = this._moveTo(targetScroll);
  };

  _handleEnd = (e) => {
    document.removeEventListener('mousemove', this._handleMove);
    document.removeEventListener('touchmove', this._handleMove);

    let velocity = 0;
    if (this.touchData.yHistory.length > 1) {
      const lastPoint = this.touchData.yHistory[this.touchData.yHistory.length - 1];
      const secondLastPoint = this.touchData.yHistory[this.touchData.yHistory.length - 2];
      const timeDiff = lastPoint[1] - secondLastPoint[1];
      const yDiff = secondLastPoint[0] - lastPoint[0];
      velocity = (yDiff / this.itemHeight) * 1000 / timeDiff;

      // Cap velocity
      const sign = velocity > 0 ? 1 : -1;
      velocity = Math.abs(velocity) > 30 ? 30 * sign : velocity;
    }

    this.scroll = this.touchData.scroll;
    this._animateScrollByVelocity(velocity);
  };

  _create(source) {
    if (!source.length) {
      return;
    }

    // Set up source for infinite scroll
    if (this.type === 'infinite') {
      let concatSource = [...source];
      while (concatSource.length < this.halfCount) {
        concatSource = concatSource.concat(source);
      }
      source = concatSource;
    }
    this.source = source;
    const sourceLength = source.length;

    let circleListHTML = '';
    let highlightHTML = '';

    for (let i = 0; i < source.length; i++) {
      circleListHTML += `<li class="wheel-picker-option" aria-hidden="true" role="option" data-index="${i}" 
        style="
          top: ${this.itemHeight * -0.5}px;
          height: ${this.itemHeight}px;
          line-height: ${this.itemHeight}px;
          transform: rotateX(${-this.itemAngle * i}deg) translate3d(0, 0, ${this.radius}px);">
        ${source[i].text}</li>`;
      highlightHTML += `<li class="wheel-picker-highlight-item" style="height: ${this.itemHeight}px;">${source[i].text}</li>`;
    }

    // Add padding for infinite scroll
    if (this.type === 'infinite') {
      for (let i = 0; i < this.quarterCount; i++) {
        const preppedText = source[sourceLength - i - 1].text;
        const postText = source[i].text;

        circleListHTML = `<li class="wheel-picker-option" aria-hidden="true" role="option" data-index="${-i - 1}"
          style="
            top: ${this.itemHeight * -0.5}px;
            height: ${this.itemHeight}px;
            line-height: ${this.itemHeight}px;
            transform: rotateX(${this.itemAngle * (i + 1)}deg) translate3d(0, 0, ${this.radius}px);">
          ${preppedText}</li>` + circleListHTML;

        circleListHTML += `<li class="wheel-picker-option" aria-hidden="true" role="option" data-index="${i + sourceLength}"
          style="
            top: ${this.itemHeight * -0.5}px;
            height: ${this.itemHeight}px;
            line-height: ${this.itemHeight}px;
            transform: rotateX(${-this.itemAngle * (i + sourceLength)}deg) translate3d(0, 0, ${this.radius}px);">
          ${postText}</li>`;
      }
    }

    this.elements.container.innerHTML = `
      <div class="wheel-picker-wrap" tabindex="0" role="listbox">
        <ul class="wheel-picker-options" style="transform: translate3d(0, 0, ${-this.radius}px) rotateX(0deg);">
          ${circleListHTML}
        </ul>
        <div class="wheel-picker-highlight">
          <ul class="wheel-picker-highlight-list">
            ${highlightHTML}
          </ul>
        </div>
      </div>
    `;

    // Cache elements
    this.elements.circleList = this.elements.container.querySelector('.wheel-picker-options');
    this.elements.circleItems = this.elements.container.querySelectorAll('.wheel-picker-option');
    this.elements.highlight = this.elements.container.querySelector('.wheel-picker-highlight');
    this.elements.highlightList = this.elements.container.querySelector('.wheel-picker-highlight-list');
    this.elements.highlightItems = this.elements.container.querySelectorAll('.wheel-picker-highlight-item');

    if (this.type === 'infinite') {
      this.elements.highlightList.style.top = -this.itemHeight + 'px';
    }

    this.elements.highlight.style.height = this.itemHeight + 'px';
    this.elements.highlight.style.lineHeight = this.itemHeight + 'px';

    // Add keyboard navigation for accessibility
    this.elements.container.addEventListener('keydown', this._handleKeydown);
  }
  
  _handleKeydown = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const direction = e.key === 'ArrowUp' ? -1 : 1;
      const targetScroll = this.scroll + direction;
      this._animateToScroll(this.scroll, targetScroll, 0.3, 'easeOutQuart');
      this._selectByScroll(targetScroll);
    }
  };


  _normalizeScroll(scroll) {
    let normalizedScroll = scroll;
    while (normalizedScroll < 0) {
      normalizedScroll += this.source.length;
    }
    return normalizedScroll % this.source.length;
  }

  _moveTo(scroll) {
    if (this.type === 'infinite') {
      scroll = this._normalizeScroll(scroll);
    }

    this.elements.circleList.style.transform = `translate3d(0, 0, ${-this.radius}px) rotateX(${this.itemAngle * scroll}deg)`;
    this.elements.highlightList.style.transform = `translate3d(0, ${-scroll * this.itemHeight}px, 0)`;

    // Hide or show items based on visibility
    [...this.elements.circleItems].forEach(item => {
      const index = parseInt(item.dataset.index, 10);
      item.style.visibility = Math.abs(index - scroll) > this.quarterCount ? 'hidden' : 'visible';
    });

    return scroll;
  }

  async _animateScrollByVelocity(velocity) {
    let startScroll = this.scroll;
    let finalScroll;
    let deceleration;
    let time;

    if (this.type === 'normal' && (startScroll < 0 || startScroll > this.source.length - 1)) {
      deceleration = this.exceedDeceleration;
      finalScroll = startScroll < 0 ? 0 : this.source.length - 1;
      const totalScroll = startScroll - finalScroll;
      time = Math.sqrt(Math.abs(totalScroll / deceleration));
    } else {
      deceleration = velocity > 0 ? -this.deceleration : this.deceleration;
      time = Math.abs(velocity / deceleration);
      const totalScroll = velocity * time + deceleration * time * time / 2;
      finalScroll = Math.round(startScroll + totalScroll);

      if (this.type === 'normal') {
        finalScroll = Math.max(0, Math.min(this.source.length - 1, finalScroll));
      }
    }

    await this._animateToScroll(startScroll, finalScroll, time, 'easeOutQuart');
    this._selectByScroll(this.scroll);
  }

  _animateToScroll(initScroll, finalScroll, duration, easingName = 'easeOutQuart') {
    if (initScroll === finalScroll || duration === 0) {
      this._moveTo(initScroll);
      return;
    }

    const startTime = new Date().getTime() / 1000;
    const totalScrollChange = finalScroll - initScroll;

    return new Promise((resolve) => {
      this.isMoving = true;
      const tick = () => {
        const elapsedTime = new Date().getTime() / 1000 - startTime;
        if (elapsedTime < duration) {
          this.scroll = this._moveTo(initScroll + EASING[easingName](elapsedTime / duration) * totalScrollChange);
          this.animationFrameId = requestAnimationFrame(tick);
        } else {
          this.scroll = this._moveTo(finalScroll);
          this._stopAnimation();
          resolve();
        }
      };
      tick();
    });
  }

  _stopAnimation() {
    this.isMoving = false;
    cancelAnimationFrame(this.animationFrameId);
  }

  _selectByScroll(scroll) {
    scroll = this._normalizeScroll(scroll);
    const selectedIndex = Math.round(scroll);
    const prevSelected = this.selected;

    // Remove aria-selected from previous item
    if (prevSelected) {
      const prevIndex = this.source.findIndex(item => item.value === prevSelected.value);
      const prevItem = this.elements.circleItems[prevIndex];
      if (prevItem) {
        prevItem.removeAttribute('aria-selected');
      }
    }

    // Update selected state and accessibility attributes
    this.selected = this.source[selectedIndex];
    this.value = this.selected.value;

    const currentItem = this.elements.circleItems[selectedIndex];
    if (currentItem) {
      currentItem.setAttribute('aria-selected', 'true');
      this.elements.container.setAttribute('aria-activedescendant', currentItem.id);
    }
    
    // Ensure the final position is exactly on the selected item
    this._moveTo(selectedIndex);
    this.scroll = selectedIndex;

    if (this.onChange && this.selected.value !== (prevSelected ? prevSelected.value : null)) {
      this.onChange(this.selected);
    }
  }

  updateSource(source) {
    this._create(source);
    if (!this.isMoving) {
      this._selectByScroll(this.scroll);
    }
  }

  select(value) {
    const targetIndex = this.source.findIndex(item => item.value === value);
    if (targetIndex !== -1) {
      this._stopAnimation();
      let initScroll = this._normalizeScroll(this.scroll);
      let finalScroll = targetIndex;
      const duration = Math.sqrt(Math.abs((finalScroll - initScroll) / this.deceleration));
      this._animateToScroll(initScroll, finalScroll, duration);
      setTimeout(() => this._selectByScroll(targetIndex));
    }
  }

  destroy() {
    this._stopAnimation();
    this.elements.container.removeEventListener('mousedown', this._handleStart);
    this.elements.container.removeEventListener('touchstart', this._handleStart);
    document.removeEventListener('mouseup', this._handleEnd);
    document.removeEventListener('touchend', this._handleEnd);
    this.elements.container.removeEventListener('keydown', this._handleKeydown);

    // Clean up DOM
    this.elements.container.innerHTML = '';
    this.elements = null;
  }
}