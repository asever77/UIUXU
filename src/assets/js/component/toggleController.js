export default class ToggleController {
  constructor(opt = {}) {
    const defaults = {
      area: document.body,
      callback: null,
    };
    this.option = { ...defaults, ...opt };
    this.container = this.option.area;
    this.toggles = this.container.querySelectorAll('[data-toggle-object]');
    this.init();
  }
  init() {
    console.log(this.toggles);
    this.toggles.forEach(toggle => {
      console.log('toggle', toggle);
      toggle.addEventListener('click', this.handleToggle);
    });
  }
  handleToggle = (e) => {
    const target = e.currentTarget;
    const toggleCallback = target.dataset.toggleCallback;
    const name = target.dataset.toggleObject;
    const toggles = this.container.querySelectorAll(`[data-toggle-object="${name}"]`);
    const targets = this.container.querySelectorAll(`[data-toggle-target="${name}"]`);

    const currentState = target.dataset.state === 'selected';
    const newState = currentState ? '' : 'selected';

    toggles.forEach(item => item.dataset.state = newState);
    targets.forEach(item => item.dataset.state = newState);

    console.log(target)

    if (toggleCallback && UI.exe.toggle?.[toggleCallback]) {
      UI.exe.toggle[toggleCallback]({
        state: currentState ? false : true,
        event: e.type,
        name,
      });
    }
  }
}