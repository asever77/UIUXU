export default class Roulette {
  /**
   * @typedef {object} RouletteOptions
   * @property {string} id - 룰렛 요소의 ID.
   * @property {string[]} data - 룰렛 휠에 표시될 항목들의 배열.
   * @property {number} [turns=5] - 휠이 회전할 기본 바퀴 수.
   * @property {number} [speed=6000] - 애니메이션 지속 시간 (밀리초).
   * @property {Function} [onStart] - 회전 시작 시 호출될 함수.
   */

  /**
   * Roulette 클래스의 새 인스턴스를 만듭니다.
   * @param {RouletteOptions} options - 설정 옵션.
   */
  constructor(options) {
    const { id, data, turns, speed, onStart } = options;

    if (!id || !data) {
      throw new Error('룰렛 생성자는 `id`와 `data` 옵션이 필요합니다.');
    }

    this.id = id;
    this.data = data;
    this.baseTurns = turns ?? 5; // `turns` 값이 없으면 기본값 5 사용
    this.speed = speed ?? 6000;  // `speed` 값이 없으면 기본값 6000 사용
    this.onStart = onStart;

    this.roulette = document.querySelector(`[data-roulette="${this.id}"]`);
    this.wrap = this.roulette.querySelector('[data-roulette="wrap"]');
    this.button = this.roulette.querySelector('[data-roulette="start"]');
    this.arrow = this.roulette.querySelector('[data-roulette="arrow"]'); // 화살표 요소 추가
    this.group = this.roulette.querySelector('[data-roulette="group"]');

    this.itemCount = this.data.length;
    this.itemDeg = 360 / this.itemCount;
    this.degData = [];

    // `spin` 메서드의 `this`를 인스턴스에 바인딩하여 이벤트 리스너로 사용
    this.handleSpin = this.spin.bind(this);
    this.state = 'ready';

    this.init();
  }

  /**
   * 룰렛을 초기화하고 스타일 및 이벤트 리스너를 설정합니다.
   */
  init() {
    this.wrap.style.transition = `transform ${this.speed}ms cubic-bezier(0.32, 0.92, 0.71, 1.01)`;
    this.button.addEventListener('click', this.handleSpin);
    this.render();
  }

  /**
   * 데이터에 따라 룰렛 항목들을 렌더링합니다.
   */
  render() {
    this.group.innerHTML = '';
    this.group.style.transform = `rotate(90deg)`;

    this.data.forEach((item, index) => {
      const rotation = 360 - (this.itemDeg * index);
      this.group.insertAdjacentHTML(
        'beforeend',
        `
        <div data-roulette="item" style="transform: rotate(${rotation}deg) translateX(-50%);">
          <div>${item}</div>
          <div data-roulette="line" style="transform: rotate(${this.itemDeg / 2}deg);"></div>
        </div>
      `
      );
    });
  }

  /**
   * 회전 동작을 처리합니다. 버튼을 비활성화하고 시작 콜백을 호출합니다.
   */
  spin() {
    if (this.state !== 'ready') return;
    
    this.button.disabled = true;
    this.roulette.dataset.state = 'spinning';
    this.onStart?.(); // 선택적 onStart 콜백 호출
  }

  /**
   * 룰렛을 회전시키고 결과를 처리합니다.
   * @param {object} options - 회전 옵션.
   * @param {string} options.result - 룰렛이 멈출 항목.
   * @returns {Promise<string>} - 룰렛이 멈추면 결과와 함께 resolve되는 프로미스.
   */
  startSpin(options) {
    return new Promise((resolve) => {
      // 룰렛 항목들의 각도 데이터를 계산
      let currentDeg = 0;
      this.degData = this.data.map((element) => {
        const deg = currentDeg;
        currentDeg += this.itemDeg;
        return [element, deg];
      });

      // 결과 항목의 모든 각도를 찾음
      const filteredDegData = this.degData.filter(item => item[0] === options.result);
      if (filteredDegData.length === 0) {
        throw new Error('결과 항목을 룰렛 데이터에서 찾을 수 없습니다.');
      }
      
      // 결과 항목 중 무작위로 하나를 선택
      const randomItem = filteredDegData[Math.floor(Math.random() * filteredDegData.length)];
      
      // 약간의 무작위 오차를 더해 회전을 더 자연스럽게 만듦
      const scope = (Math.floor(Math.random() * (this.itemDeg - 10)) / 2) * (Math.random() < 0.5 ? -1 : 1);
      const finalDeg = randomItem[1] + (this.baseTurns * 360) + scope;

      // CSS transform 속성을 업데이트하여 회전 시작
      this.wrap.style.transform = `rotate(${finalDeg}deg)`;
      this.roulette.dataset.state = 'spinning';

      // 애니메이션 종료 시 이벤트 처리
      this.wrap.addEventListener('transitionend', () => {
        this.roulette.dataset.state = 'complete';
        this.button.disabled = false;
        resolve(options.result);
      }, { once: true });
    });
  }

  /**
   * 룰렛을 초기 상태로 재설정합니다.
   */
  reset() {
    this.wrap.style.transition = 'none';
    this.wrap.style.transform = 'rotate(0deg)';
    this.roulette.dataset.state = 'ready';
    this.button.disabled = false;
    
    // 다음 이벤트 루프에서 트랜지션 다시 활성화
    setTimeout(() => {
      this.wrap.style.transition = `transform ${this.speed}ms cubic-bezier(0.32, 0.92, 0.71, 1.01)`;
    }, 50);
  }
}