/**
 * ui.global.js
 * User Interface script 
 * modify: 2023.03.10
 * ver: 1.0.14
 * desc: 
 * 1.0.3 (23.01.10) datepicker update : 날짜 클릭 시 값전달 및 창닫기 옵션 추가. isFooter : true
 * 1.0.4 (23.01.11) modal full height 값설정, modal dim 클릭 시 close
 * 1.0.5 (23.01.16) datepicker button 자동생성 및 값 적용으로 인한 기존 마크업 버튼 삭제 후 재생성
 * 1.0.5 (23.01.16) rangeSlider 눈금옵션추가 및 자동생성
 * 1.0.6 (23.01.19) select callback 작업
 * 1.0.7 (23.01.20) scroll.move customscroll 여부에 따른 동작분리
 * 1.0.8 (23.01.30) rangeSlider : step, text 추가
 * 1.0.9 (23.02.08) datepicker,sheet 포커스 이동 수정
 * 1.0.10 (23.02.20) datepicker callback 추가, select, dropdown back click 
 * 1.0.11 (23.02.21) datepicker callback 없는 경우 에러 수정 
 * 1.0.12 (23.02.26) datepicker 공휴일, 대체휴일 설정 추가
 * 1.0.13 (23.03.06) select 위치설정 inner 추가
 * 1.0.14 (23.03.10) modal drag close 추가
 * 1.0.15 (23.03.13) modal drag close - top,bottom 경우 추가
 * 1.0.16 (23.03.14) tab keys 수정
 * 1.0.17 (23.03.23) input clear - search, data-keep인 경우 x버튼 노출 수정
 */
(() => {

	'use strict';

	const global = 'netive';

	window[global] = {};

	const Global = window[global];
	const UA = navigator.userAgent.toLowerCase();
	const deviceSize = [1920, 1600, 1440, 1280, 1024, 960, 840, 720, 600, 480, 400, 360];
	const deviceInfo = ['android', 'iphone', 'ipod', 'ipad', 'blackberry', 'windows ce', 'windows','samsung', 'lg', 'mot', 'sonyericsson', 'nokia', 'opeara mini', 'opera mobi', 'webos', 'iemobile', 'kfapwi', 'rim', 'bb10'];
	//const filter = "win16|win32|win64|mac|macintel";
	
	//requestAnimationFrame
	window.requestAFrame = (() => {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
			//if all else fails, use setTimeout
			function (callback) {
				return window.setTimeout(callback, 1000 / 60); //shoot for 60 fp
			};
	})();
	window.cancelAFrame = (() => {
		return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame ||
			function (id) {
				window.clearTimeout(id);
			};
	})();

	Global.callback = {};
	
	/**
	 * STATE : 기본 상태 정보
	 * in use: Global.state,
	 */
	Global.state = {
		isSystemModal: false,
		device: {
			info: (() => {
				for (let i = 0, len = deviceInfo.length; i < len; i++) {
					if (UA.match(deviceInfo[i]) !== null) {
						return deviceInfo[i];
					}
				}
			})(),
			width: window.innerWidth,
			height: window.innerHeight,
			breakpoint: null,
			colClass: null,
			ios: (/ip(ad|hone|od)/i).test(UA),
			android: (/android/i).test(UA),
			app: UA.indexOf('appname') > -1 ? true : false,
			touch: null,
			mobile: null,
			os: (navigator.appVersion).match(/(mac|win|linux)/i)
		},
		browser: {
			ie: UA.match(/(?:msie ([0-9]+)|rv:([0-9\.]+)\) like gecko)/i),
			local: (/^http:\/\//).test(location.href),
			firefox: (/firefox/i).test(UA),
			webkit: (/applewebkit/i).test(UA),
			chrome: (/chrome/i).test(UA),
			opera: (/opera/i).test(UA),
			safari: (/applewebkit/i).test(UA) && !(/chrome/i).test(UA),	
			size: null
		},
		keys: { 
			tab: 9, 
			enter: 13, 
			alt: 18, 
			esc: 27, 
			space: 32, 
			pageup: 33, 
			pagedown: 34, 
			end: 35, 
			home: 36, 
			left: 37, 
			up: 38, 
			right: 39, 
			down: 40
		},
		scroll: {
			y: 0,
			direction: 'down'
		},		
		breakPoint: [600, 905],
		effect: { //http://cubic-bezier.com - css easing effect
			linear: '0.250, 0.250, 0.750, 0.750',
			ease: '0.250, 0.100, 0.250, 1.000',
			easeIn: '0.420, 0.000, 1.000, 1.000',
			easeOut: '0.000, 0.000, 0.580, 1.000',
			easeInOut: '0.420, 0.000, 0.580, 1.000',
			easeInQuad: '0.550, 0.085, 0.680, 0.530',
			easeInCubic: '0.550, 0.055, 0.675, 0.190',
			easeInQuart: '0.895, 0.030, 0.685, 0.220',
			easeInQuint: '0.755, 0.050, 0.855, 0.060',
			easeInSine: '0.470, 0.000, 0.745, 0.715',
			easeInExpo: '0.950, 0.050, 0.795, 0.035',
			easeInCirc: '0.600, 0.040, 0.980, 0.335',
			easeInBack: '0.600, -0.280, 0.735, 0.045',
			easeOutQuad: '0.250, 0.460, 0.450, 0.940',
			easeOutCubic: '0.215, 0.610, 0.355, 1.000',
			easeOutQuart: '0.165, 0.840, 0.440, 1.000',
			easeOutQuint: '0.230, 1.000, 0.320, 1.000',
			easeOutSine: '0.390, 0.575, 0.565, 1.000',
			easeOutExpo: '0.190, 1.000, 0.220, 1.000',
			easeOutCirc: '0.075, 0.820, 0.165, 1.000',
			easeOutBack: '0.175, 0.885, 0.320, 1.275',
			easeInOutQuad: '0.455, 0.030, 0.515, 0.955',
			easeInOutCubic: '0.645, 0.045, 0.355, 1.000',
			easeInOutQuart: '0.770, 0.000, 0.175, 1.000',
			easeInOutQuint: '0.860, 0.000, 0.070, 1.000',
			easeInOutSine: '0.445, 0.050, 0.550, 0.950',
			easeInOutExpo: '1.000, 0.000, 0.000, 1.000',
			easeInOutCirc: '0.785, 0.135, 0.150, 0.860',
			easeInOutBack: '0.680, -0.550, 0.265, 1.550'
		}
	}
	
	/**
	 * PARTS : 기본적인 여러가지 자질구리한 기능
	 * in use: Global.state,
	 */
	Global.parts = {
		scroll(){
			let last_know_scroll_position = 0;
			let ticking = false;

			const doSomething = (scroll_pos) => {
				Global.state.scroll.direction = 
					Global.state.scroll.y > scroll_pos ? 'up' : Global.state.scroll.y < scroll_pos ? 'down' : ''; 
				Global.state.scroll.y = scroll_pos;
			}
			window.addEventListener('scroll', (e) => {
				last_know_scroll_position = window.scrollY;

				if (!ticking) {
					window.requestAnimationFrame(() => {
						doSomething(last_know_scroll_position);
						ticking = false;
					});

					ticking = true;
				}
			});
		},
		//resize state
		resizeState() {
			let timerWin;

			const act = () => {
				const browser = Global.state.browser;
				const device = Global.state.device;

				device.width = window.innerWidth;
				device.height = window.innerHeight;

				device.touch = device.ios || device.android || (document.ontouchstart !== undefined && document.ontouchstart !== null);
				device.mobile = device.touch && (device.ios || device.android);
				device.os = device.os ? device.os[0] : '';
				device.os = device.os.toLowerCase();

				device.breakpoint = device.width >= deviceSize[5] ? true : false;
				device.colClass = device.width >= deviceSize[5] ? 'col-12' : device.width > deviceSize[8] ? 'col-8' : 'col-4';

				if (browser.ie) {
					browser.ie = browser.ie = parseInt( browser.ie[1] || browser.ie[2] );
					( 11 > browser.ie ) ? support.pointerevents = false : '';
					( 9 > browser.ie ) ? support.svgimage = false : '';
				} else {
					browser.ie = false;
				}
				
				const clsBrowser = browser.chrome ? 'chrome' : browser.firefox ? 'firefox' : browser.opera ? 'opera' : browser.safari ? 'safari' : browser.ie ? 'ie' + browser.ie : 'other';
				const clsMobileSystem = device.ios ? "ios" : device.android ? "android" : 'etc';
				const clsMobile = device.mobile ? device.app ? 'ui-a ui-m' : 'ui-m' : 'ui-d';
				const el_html = document.querySelector('html');

				el_html.classList.remove('col-12', 'col-8', 'col-4');
				el_html.classList.add(device.colClass);
				el_html.classList.add(clsBrowser);
				el_html.classList.add(clsMobileSystem);
				el_html.classList.add(clsMobile);
			
				const w = window.innerWidth;

				clearTimeout(timerWin);
				timerWin = setTimeout(() => {
					el_html.classList.remove('size-tablet');
					el_html.classList.remove('size-desktop');
					el_html.classList.remove('size-mobile');
						el_html.classList.remove('size-desktop');

					if (w < Global.state.breakPoint[0]) {
						Global.state.browser.size = 'mobile';
						el_html.classList.add('size-mobile');
					} else if (w < Global.state.breakPoint[1]) {
						Global.state.browser.size = 'tablet';
						el_html.classList.add('size-tablet');
					} else {
						Global.state.browser.sizee = 'desktop';
						el_html.classList.add('size-desktop');
					}
				},200);
			}
			window.addEventListener('resize', act);
			act();
		},
		pageName() {
			const page = document.URL.substring(document.URL.lastIndexOf("/") + 1);
			const pagename = page.split('?');

			return pagename[0];
		},
		/**
		* append html : 지정된 영역 안에 마지막에 요소 추가하기
		* @param {object} el target element
		* @param {string} str 지정된 영역에 들어갈 값
		* @param {string} htmltag HTML tag element
		*/
		appendHtml(el, str, htmltag) {
			const _htmltag = !!htmltag ? htmltag : 'div';
			const div = document.createElement(_htmltag);

			div.innerHTML = str;

			while (div.children.length > 0) {
				el.appendChild(div.children[0]);
			}
		},

		/**
		* delete parent tag : 지정된 요소의 부모태그 삭제
		* @param {object} child target element
		*/
		deleteParent(child) {
			const parent = child.parentNode;

			parent.parentNode.removeChild(parent);
		},

		/**
		* wrap tag : 지정된 요소의 tag 감싸기
		* @param {object} child target element
		*/
		wrapTag(front, selector, back) {
			const org_html = selector.innerHTML;
			const new_html = front + org_html + back;

			selector.innerHTML = '';
 			selector.insertAdjacentHTML('beforeend', new_html) ;
		},

		//숫자 세자리수마다 ',' 붙이기
		comma(n) {
			var parts = n.toString().split(".");

			return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
		},

		//숫자 한자리수 일때 0 앞에 붙이기
		add0(x) {
			return Number(x) < 10 ? '0' + x : x;
		},

		//주소의 파라미터 값 가져오기
		para(paraname) {
			const _tempUrl = window.location.search.substring(1);
			const _tempArray = _tempUrl.split('&');

			for (let i = 0, len = _tempArray.length; i < len; i++) {
				const that = _tempArray[i].split('=');

				if (that[0] === paraname) {
					return that[1];
				}
			}
		},

		//기본 선택자 설정
		selectorType(v) {
			let base = document.querySelector('body');

			if (v !== null) {
				if (typeof v === 'string') {
					base = document.querySelector(v);
				} else {
					base = v;
				} 
			}

			return base;
		},

		RAF(start, end, startTime, duration){
			const _start = start;
			const _end = end;
			const _duration = duration ? duration : 300;
			const unit = (_end - _start) / _duration;
			const endTime = startTime + _duration;

			let now = new Date().getTime();
			let passed = now - startTime;

			if (now <= endTime) {
				Global.parts.RAF.time = _start + (unit * passed);
				requestAnimationFrame(scrollTo);
			} else {
				!!callback && callback();
			}
		},

		getIndex(ele) {
			let _i = 0;
			while((ele = ele.previousSibling) != null ) {
				console.log( typeof ele);
				_i++;
			}

			return _i;
		}
	}
	Global.parts.resizeState();
	Global.parts.scroll();

	// Global.option = {
	// 	join(org, add){
	// 		const object1 = {};

	// 		Object.defineProperties(object1, org, add);
	// 	}
	// }

	/**
	 * LOADING 
	 * in use: Global.state,
	 */
	Global.loading = {
		timerShow : {}, 
		timerHide : {},
		options : {
			selector: null,
			message : null,
			styleClass : 'orbit' //time
		},
		show(option){
			const opt = Object.assign({}, this.options, option);
			const selector = opt.selector; 
			const styleClass = opt.styleClass; 
			const message = opt.message;
			const el = (selector !== null) ? selector : document.querySelector('body');
			const el_loadingHides = document.querySelectorAll('.ui-loading:not(.visible)');

			for (let i = 0, len = el_loadingHides.length; i < len; i++) {
				const that = el_loadingHides[i];

				that.remove();
			}

			let htmlLoading = '';

			(selector === null) ?
				htmlLoading += '<div class="ui-loading '+ styleClass +'">':
				htmlLoading += '<div class="ui-loading type-area '+ styleClass +'">';

			htmlLoading += '<div class="ui-loading-wrap">';

			(message !== null) ?
				htmlLoading += '<strong class="ui-loading-message"><span>'+ message +'</span></strong>':
				htmlLoading += '';

			htmlLoading += '</div>';
			htmlLoading += '</div>';

			const showLoading = () => {
				const el_child = el.childNodes;
				let is_loading = false;

				for (let i = 0; i < el_child.length; i++) {
					if (el_child[i].nodeName === 'DIV' && el_child[i].classList.contains('ui-loading')) {
						is_loading = true;
					}
				}

				!is_loading && el.insertAdjacentHTML('beforeend', htmlLoading);
				htmlLoading = null;		
				
				const el_loadings = document.querySelectorAll('.ui-loading');

				for (let i = 0, len = el_loadings.length; i < len; i++) {
					const that = el_loadings[i];

					that.classList.add('visible');
					that.classList.remove('close');
				}
			}
			clearTimeout(this.timerShow);
			clearTimeout(this.timerHide);
			this.timerShow = setTimeout(showLoading, 300);
		},
		hide(){
			clearTimeout(this.timerShow);
			this.timerHide = setTimeout(() => {
				const el_loadings = document.querySelectorAll('.ui-loading');

				for (let i = 0, len = el_loadings.length; i < len; i++) {
					const that = el_loadings[i];

					that.classList.add('close');
					setTimeout(() => {
						that.classList.remove('visible')
						that.remove();
					},300);
				}
			},300);
		}
	}

	/**
	 * AJAX : 동적 파일 
	 * in use: (Global.loading)
	 */
	Global.ajax = {
		options : {
			page: true,
			add: false,
			prepend: false,
			effect: false,
			loading:false,
			callback: false,
			errorCallback: false,
			type: 'GET',
			cache: false,
			async: true,
			contType: 'application/x-www-form-urlencoded',
			dataType: 'html'
		},
		init (option){
			if (option === undefined) {
				return false;
			}

			const opt = Object.assign({}, this.options, option);
			//const opt = {...this.options, ...option};
			const xhr = new XMLHttpRequest();
			const area = opt.area;
			const loading = opt.loading;
			const effect = opt.effect;
			const type = opt.type;
			const url = opt.url;
			const page = opt.page;
			const add = opt.add;
			const prepend = opt.prepend;
			const mimeType = opt.mimeType;
			const contType = opt.contType;
			const callback = opt.callback || false;
			const errorCallback = opt.errorCallback === undefined ? false : opt.errorCallback;
	
			loading && Global.loading.show();

			if (!!effect && !!document.querySelector(effect)) {
				area.classList.remove(effect + ' action');
				area.classList.add(effect);
			}

			xhr.open(type, url);
			xhr.setRequestHeader(mimeType, contType);
			xhr.send();
			xhr.onreadystatechange = () => {
				if (xhr.readyState !== XMLHttpRequest.DONE) {
					return;
				}

				if (xhr.status === 200) {
					loading && Global.loading.hide();

					if (page) {
						if (add){
							prepend ? 
								area.insertAdjacentHTML('afterbegin', xhr.responseText) : 
								area.insertAdjacentHTML('beforeend', xhr.responseText);
						} else {							
							area.innerHTML = xhr.responseText;
						}

						callback && callback();
						effect && area.classList.add('action');
					} else {
						callback && callback(xhr.responseText);
					}

				} else {
					loading && Global.loading.hide();
					errorCallback && errorCallback();
				}
			};
		}
	}

	/**
	 * SCROLL : 기본적인 스크롤 동작, 값
	 * in use: Global.callback
	 */
	Global.scroll = {
		options : {
			selector: document.querySelector('html, body'),
			focus: false,
			top: 0,
			left:0,
			add: 0,
			align: 'default',
			effect:'smooth', //'auto'
			callback: false,	
		},
		init() {
			const el_areas = document.querySelectorAll('.ui-scrollmove-btn[data-area]');

			for (let i = 0, len = el_areas.length; i < len; i++) {
				const that = el_areas[i];

				that.removeEventListener('click', this.act);
				that.addEventListener('click', this.act);
			}
			// for (let that of el_areas) {
			// 	that.removeEventListener('click', this.act);
			// 	that.addEventListener('click', this.act);
			// }
		},
		act(e) {
			const el = e.currentTarget;
			const area = el.dataset.area;
			const name = el.dataset.name;
			const add = el.dataset.add === undefined ? 0 : el.dataset.add;
			const align = el.dataset.align === undefined ? 'default' : el.dataset.align;
			const callback = el.dataset.callback === undefined ? false : el.dataset.callback;
			let el_area = document.querySelector('.ui-scrollmove[data-area="'+ area +'"]');
			const item = el_area.querySelector('.ui-scrollbar-item');
			
			if (!!item) {
				el_area = el_area.querySelector('.ui-scrollbar-item');
			}

			const el_item = el_area.querySelector('.ui-scrollmove-item[data-name="'+ name +'"]');
			
			let top = (el_area.getBoundingClientRect().top - el_item.getBoundingClientRect().top) - el_area.scrollTop;
			let left = (el_area.getBoundingClientRect().left - el_item.getBoundingClientRect().left) - el_area.scrollLeft;

			if (align === 'center') {
				top = top - (el_item.offsetHeight / 2);
				left = left - (el_item.offsetWidth / 2);
			}

			Global.scroll.move({
				top: top,
				left: left,
				add: add,
				selector: el_area,
				align: align,
				focus: el_item,
				callback: callback
			});
		},
		move(option) {
			const opt = Object.assign({}, this.options, option);
			//const opt = {...this.options, ...option};
			const top = opt.top;
			const left = opt.left;
			const callback = opt.callback;
			const align = opt.align;
			const add = opt.add;
			const focus = opt.focus;
			const effect = opt.effect;
			let selector = opt.selector;
			const item = selector.querySelector('.ui-scrollbar-item');
			const isCustomScroll = selector.classList.contains('ui-scrollbar');

			if (!!item && !!isCustomScroll) {
				selector = selector.querySelector('.ui-scrollbar-item');
			}
			
			switch (align) {
				case 'center':
					selector.scrollTo({
						top: Math.abs(top) - (selector.offsetHeight / 2) + add,
						left: Math.abs(left) - (selector.offsetWidth / 2) + add,
						behavior: effect
					});
					break;
				
				case 'default':
				default :
					selector.scrollTo({
						top: Math.abs(top) + add,
						left: Math.abs(left) + add,
						behavior: effect
					});
			}
			this.checkEnd({
				selector : selector,
				nowTop : selector.scrollTop, 
				nowLeft : selector.scrollLeft,
				align : align,
				callback : callback,
				focus : focus
			});
		},
		checkEndTimer : {},
		checkEnd(opt) {
			const el_selector = opt.selector;
			const align = opt.align
			const focus = opt.focus
			const callback = opt.callback
			
			let nowTop = opt.nowTop;
			let nowLeft = opt.nowLeft;

			Global.scroll.checkEndTimer = setTimeout(() => {
				//스크롤 현재 진행 여부 판단
				if (nowTop === el_selector.scrollTop && nowLeft === el_selector.scrollLeft) {
					clearTimeout(Global.scroll.checkEndTimer);
					//포커스가 위치할 엘리먼트를 지정하였다면 실행
 					if (!!focus ) {
						focus.setAttribute('tabindex', 0);
						focus.focus();
					}
					//스크롤 이동후 콜백함수 실행
					if (!!callback) {
						if (typeof callback === 'string') {
							Global.callback[callback]();
						} else {
							callback();
						}
					}
				} else {
					nowTop = el_selector.scrollTop;
					nowLeft = el_selector.scrollLeft;

					Global.scroll.checkEnd({
						selector: el_selector,
						nowTop: nowTop,
						nowLeft: nowLeft,
						align: align,
						callback: callback,
						focus: focus
					});
				}
			},100);
		}
	}

	/**
	 * URL PARAMETER : 주소값의 파라미터 값
	 * @param {string} paraname 주소창의 파라미터 값 (?parname=1)
	 */
	Global.para = {
		get(paraname) {
			const _tempUrl = window.location.search.substring(1);
			const _tempArray = _tempUrl.split('&');

			for (let i = 0, len = _tempArray.length; i < len; i++) {
				const that = _tempArray[i].split('=');

				if (that[0] === paraname) {
					return that[1];
				}
			}
		}
	}

	/**
	 * FOCUS : 특정 영역 탭 이동 시 무한루프 포커스
	 * @param {object} selector 무한루프 포커스 영역 설정
	 */
	Global.focus = {
		loop(opt) {
			const el = opt.selector;

			if (opt === undefined ) {
				return false;
			}

			const tags = el.querySelectorAll('*');
			const tagLen = tags.length;
			
			for (let i = 0; i < tagLen; i++) {
				const _tag = tags[i];
				const tag_name = _tag.tagName;
				if (tag_name === 'BUTTON' || tag_name === 'A' || tag_name === 'INPUT' || tag_name === 'TEXTAREA') {
					_tag.classList.add('ui-focusloop-start');
					break;
				}
			}

			if (!!el.querySelector('.ui-dialog-wrap') && !el.querySelector('.ui-dialog-wrap .ui-dialog-last') && !el.getAttribute('aria-live')) {
				const modal_wrap = el.querySelector('.ui-dialog-wrap');
				const last = '<button type="button" class="ui-dialog-last ui-focusloop-end ui-dialog-close" aria-label="'+ (el.querySelector('.ui-dialog-tit') && el.querySelector('.ui-dialog-tit').textContent) +' 레이어 문서 마지막 지점입니다. 모달 창 닫기"></button>'
				modal_wrap.insertAdjacentHTML('beforeend', last);
			} else if (!el.querySelector('.ui-focusloop-end')) {
				for (let i = tagLen - 1; i >= 0; i--) {
					const _tag = tags[i];
					const tag_name = _tag.tagName;
					if (tag_name === 'BUTTON' || tag_name === 'A' || tag_name === 'INPUT' || tag_name === 'TEXTAREA') {
						_tag.classList.add('ui-focusloop-end');
						break;
					}
				}
			}
			
			const el_start = el.querySelector('.ui-focusloop-start');
			const el_end = el.querySelector('.ui-focusloop-end');

			const keyStart = (e) => {
				if (e.shiftKey && e.keyCode == 9) {
					e.preventDefault();
					el_end.focus();
				}
			}
			const keyEnd = (e) => {
				if (!e.shiftKey && e.keyCode == 9) {
					e.preventDefault();
					el_start.focus();
				}
			}

			el_start.focus();
			// (!el.getAttribute('aria-live')) ? el.focus() : el_start.focus();
			
			el_start.addEventListener('keydown', keyStart);
			el_end.addEventListener('keydown', keyEnd);
		}
	}

	/**
	 * SHEETS : 화면하단 고정된 보충 콘텐츠
	 * in use: Global.focus
	 */
	Global.sheets = {
		dim(opt){
			const show = opt.show;
			const callback = opt.callback;
			let dim;

 			if (show) {
				const sheet = document.querySelector('.sheet-bottom[data-id="'+opt.id+'"]');
				sheet.insertAdjacentHTML('beforeend', '<div class="sheet-dim"></div>');

				dim = document.querySelector('.sheet-dim');
				dim.classList.add('on');

				!!callback && callback();
			} else {
				dim = document.querySelector('.sheet-dim');
				dim.classList.remove('on');
			}
		},
		bottom(opt){
			const id = opt.id;
			const state = opt.state;
			const callback = opt.callback;
			const el_focus = opt.focus;
			const el_base = document.querySelector('#'+ id);
			let el_sheet = document.querySelector('[data-id*="'+id+'"]');

			const scr_t = document.documentElement.scrollTop;
			const win_w = window.innerWidth;
			const win_h = window.innerHeight;
			const off_t = el_base.getBoundingClientRect().top;
			const off_l = el_base.getBoundingClientRect().left;
			const base_w = el_base.offsetWidth;
			const base_h = el_base.offsetHeight;
			const is_expanded = !!el_sheet;
			let show = !is_expanded || is_expanded === 'false';

			let endfocus = opt.endfocus === false ? document.activeElement : opt.endfocus;

			if (state !== undefined) {
				show = state;
			}

			if (show) {
				!!callback && callback(); 
				
				el_sheet = document.querySelector('[data-id*="'+ id +'"]');
				el_sheet.classList.add('sheet-bottom');

				const wrap_w = Number(el_sheet.offsetWidth.toFixed(2));
				const wrap_h = Number(el_sheet.offsetHeight.toFixed(2));

				Global.sheets.dim({
					id: id,
					show: true,
					callback: () => {
						const dim = document.querySelector('.sheet-dim');
						const dimAct = () => {
							Global.sheets.bottom({
								id: id,
								state: false
							});
						}
						dim.addEventListener('click', dimAct);
					}
				});

				el_sheet.classList.add('on');
				el_sheet.style.left = ((wrap_w + off_l) > win_w) ? (off_l - (wrap_w - base_w))+ 'px' : off_l + 'px';
				el_sheet.style.top = (win_h - ((off_t - scr_t) + base_h) > wrap_h) ? (off_t + base_h) + scr_t + 'px' : (off_t - wrap_h) + scr_t + 'px';
				
				Global.focus.loop({
					selector: el_sheet
				});

				el_sheet.querySelector('.ui-focusloop-start').focus();
			} else {
				//hide
				el_sheet.classList.remove('on');
				el_sheet.classList.add('off');
				
				setTimeout(() => {
					!!callback && callback();
					el_sheet.remove();

					!!el_focus ? el_focus.focus() :  document.querySelector('#'+id).focus();
				},300);
			}
		}
	}

	/**
	 * in use: Global.parts
	 * - init
	 * - destory
	 * - reset
	 */
	Global.scrollBar = {
		options : {
			scope: document.querySelector('body'),
			selector: false,
			callback:false,
			infiniteCallback:false,
			space: false,
			remove: false
		},
		init (option) {
			const opt = Object.assign({}, Global.scrollBar.options, option);
			const el_scope = !!opt.scope ? opt.scope : document.querySelector('body');
			let scrollBars = el_scope.querySelectorAll('.ui-scrollbar');
			
			if (!!opt.infiniteCallback) {
				Global.scrollBar[option.selector] = option.infiniteCallback;
			}

			(sessionStorage.getItem('scrollbarID') === null) && sessionStorage.setItem('scrollbarID', 0);
			
			const create = (scrollId) => {
				const callback = opt.callback;
				const infiniteCallback = opt.infiniteCallback;
				const el_scrollbar = document.querySelector('[data-scroll-id="' + scrollId +'"]');
				
				let timer;
				let prevHeightPercent = 0;
				let scrollDirection = 'keep';

				//+reset
				if (el_scrollbar.dataset.ready === 'yes') {
					return false;
				}

				el_scrollbar.classList.remove('ready');
				el_scrollbar.dataset.ready = 'no';
				el_scrollbar.dataset.direction = scrollDirection;
				
				const wrapW = el_scrollbar.offsetWidth;
				const wrapH = el_scrollbar.offsetHeight;

				Global.parts.wrapTag('<div class="ui-scrollbar-item"><div class="ui-scrollbar-wrap">', el_scrollbar ,'</div></div>');

				//++make
				const el_item = el_scrollbar.querySelector('.ui-scrollbar-item');
				const el_itemWrap = el_item.querySelector('.ui-scrollbar-wrap');

				el_itemWrap.style.display = 'block';
				el_itemWrap.style.width = '100%';
				el_item.style.width = '100%';
				el_scrollbar.style.overflow = 'hidden';

				let itemW = el_item.scrollWidth;
				let itemH = el_item.scrollHeight;

				el_scrollbar.dataset.itemH = itemH;
				el_scrollbar.dataset.itemW = itemW;
				el_scrollbar.dataset.wrapH = wrapH;
				el_scrollbar.dataset.wrapW = wrapW;
				
				const scrollbarUpdate = (el_scrollbar, wrapH, wrapW, itemH, itemW) => {
					const _el_scrollbar = el_scrollbar;
					const el_item = _el_scrollbar.querySelector('.ui-scrollbar-item');
					
					if (!el_item) {
						return false;
					}

					const nWrapH = _el_scrollbar.offsetHeight;
					const nWrapW = _el_scrollbar.offsetWidth;
					const nItemH = el_item.scrollHeight;
					const nItemW = el_item.scrollWidth;
					const changeH = (itemH !== nItemH || wrapH !== nWrapH);
					const changeW = (itemW !== nItemW || wrapW !== nWrapW);

					//resizing
					if (changeH || changeW) {
						let barH = Math.floor(nWrapH / (nItemH / 100));
						let barW = Math.floor(nWrapW / (nItemW / 100));
						const el_barY = _el_scrollbar.querySelector('.ui-scrollbar-barwrap.type-y .ui-scrollbar-bar');
						const el_barX = _el_scrollbar.querySelector('.ui-scrollbar-barwrap.type-x .ui-scrollbar-bar');

						if (changeH) {
							el_barY.style.height = barH + '%';
							el_barY.dataset.height = barH;
						} 
						if (changeW) {
							el_barX.style.width = barW + '%';
							el_barX.dataset.width = barW;
						}
						
						(nWrapH < nItemH) ? 
							_el_scrollbar.classList.add('view-y') : 
							_el_scrollbar.classList.remove('view-y');
						(nWrapW < nItemW) ? 
							_el_scrollbar.classList.add('view-x') : 
							_el_scrollbar.classList.remove('view-x');

						el_scrollbar.dataset.itemH = nItemH;
						el_scrollbar.dataset.itemW = nItemW;
						el_scrollbar.dataset.wrapH = nWrapH;
						el_scrollbar.dataset.wrapW = nWrapW;
					}

					setTimeout(() => {
						scrollbarUpdate(el_scrollbar, nWrapH, nWrapW, nItemH, nItemW);
					}, 300);
				}

				const eventFn = (v) => {
					const _el_scrollbar = el_scrollbar;
					const el_item = _el_scrollbar.querySelector('.ui-scrollbar-item');
					const el_bar = _el_scrollbar.querySelectorAll('.ui-scrollbar-bar');
	
					el_item.addEventListener('scroll', scrollEvent);
					
					for (let i = 0, len = el_bar.length; i < len; i++) {
						const that = el_bar[i];

						that.addEventListener('mousedown', dragMoveAct);
					}
				}	
				
				const scrollEvent = (event, el_item) => {
					const _el_item = !!event ? event.target : el_item;
					const el_scrollbar = _el_item.closest('.ui-scrollbar');
					const itemH = Number(el_scrollbar.dataset.itemH);
					const itemW = Number(el_scrollbar.dataset.itemW);
					const wrapH = Number(el_scrollbar.dataset.wrapH);
					const wrapW = Number(el_scrollbar.dataset.wrapW);
	
					//el_scrollbar.dataset 값이 없을 경우 4개의 값중 하나라도 없으면 중단
					if (wrapW === undefined) {
						return false;
					}
	
					const el_barY = el_scrollbar.querySelector('.type-y .ui-scrollbar-bar');
					const el_barX = el_scrollbar.querySelector('.type-x .ui-scrollbar-bar');
					const scrT = _el_item.scrollTop;
					const scrL = _el_item.scrollLeft;
					const barH = Number(el_barY.dataset.height);
					const barW = Number(el_barX.dataset.width);
					const hPer = Math.round(scrT / (itemH - wrapH) * 100);
					const wPer = Math.round(scrL / (itemW - wrapW) * 100);
					const _hPer = (barH / 100) * hPer;
					const _wPer = (barW / 100) * wPer;
					
					el_barY.style.top = hPer - _hPer + '%';
					el_barX.style.left = wPer - _wPer + '%';
					
					if (el_barY.offsetHeight > wrapH / 100 * barH) {
						el_barY.style.marginTop = '-' + ((el_barY.offsetHeight - (wrapH / 100 * barH)) / 100) * (hPer - _hPer) + 'px';
					}
					
					
					if (prevHeightPercent < scrT) {
						scrollDirection = 'down';
					} else if (prevHeightPercent > scrT) {
						scrollDirection = 'up';
					} else {
						scrollDirection = 'keep';
					}
	
					el_scrollbar.dataset.direction = scrollDirection;
					prevHeightPercent = scrT;
					
					if (hPer === 100 && scrollDirection === 'down') {
						clearTimeout(timer);
						timer = setTimeout(() => {
							if (!!infiniteCallback) {
								el_scrollbar.setAttribute('data-end', 'true');
								Global.scrollBar[el_scrollbar.getAttribute('data-scroll-id')]();
								infiniteCallback();
							}
						},200);
					}
				}
				
				const dragMoveAct = (event) => {
					const body = document.querySelector('body');
					const el_bar = event.target;
					const el_scrollbar = el_bar.closest('.ui-scrollbar');
					const el_barWrap = el_bar.closest('.ui-scrollbar-barwrap');
					const el_item = el_scrollbar.querySelector('.ui-scrollbar-item');
					const itemH = Number(el_scrollbar.dataset.itemH);
					const itemW = Number(el_scrollbar.dataset.itemW);
					const el_barWrapRect = el_barWrap.getBoundingClientRect();
					const off_t = el_barWrapRect.top + document.documentElement.scrollTop;
					const off_l = el_barWrapRect.left + document.documentElement.scrollLeft;
					const w_h = el_barWrapRect.height;
					const w_w = el_barWrapRect.width;
					const barH = el_bar.getAttribute('data-height');
					const barW = el_bar.getAttribute('data-width');
					const isXY = el_bar.getAttribute('data-scrollxy');
	
					body.classList.add('scrollbar-move');
	
					const mousemoveAct = (event) => {
						let y_m; 
						let x_m;
						
						if (event.touches === undefined) {
							if (event.pageY !== undefined) {
								y_m = event.pageY;
							} else if (event.pageY === undefined) {
								y_m = event.clientY;
							}
	
							if (event.pageX !== undefined) {
								x_m = event.pageX;
							} else if (event.pageX === undefined) {
								x_m = event.clientX;
							}
						}
	
						let yR = y_m - off_t;
						let xR = x_m - off_l;
	
						yR = yR < 0 ? 0 : yR;
						yR = yR > w_h ? w_h : yR;
						xR = xR < 0 ? 0 : xR;
						xR = xR > w_w ? w_w : xR;
	
						const yRPer = yR / w_h * 100;
						const xRPer = xR / w_w * 100;
						const nPerY = (yRPer - (barH / 100 * yRPer)).toFixed(2);
						const nPerX = (xRPer - (barW / 100 * xRPer)).toFixed(2);
	
						if (isXY === 'y') {
							el_bar.style.top = nPerY + '%';
							el_item.scrollTop = itemH * nPerY / 100;
						} else {
							el_bar.style.left = nPerX + '%';
							el_item.scrollLeft = itemW * nPerX / 100;
						}
					}
					const mouseupAct = () => {
						body.classList.remove('scrollbar-move');
						document.removeEventListener('mousemove', mousemoveAct);
						document.removeEventListener('mouseup', mouseupAct);
					}

					document.addEventListener('mousemove', mousemoveAct);
					document.addEventListener('mouseup', mouseupAct);
				}

				if (el_scrollbar.dataset.ready === 'no') {
					el_scrollbar.dataset.ready = 'yes';
					el_scrollbar.classList.add('ready');
					el_item.setAttribute('tabindex', 0);
					el_scrollbar.style.height = wrapH + 'px';

					const html_barwrap = document.createElement('div');
					const html_barwrapX = document.createElement('div');
					const html_button = document.createElement('button');
					const html_buttonX = document.createElement('button');

					html_barwrap.classList.add('ui-scrollbar-barwrap');
					html_barwrap.classList.add('type-y');
					html_button.classList.add('ui-scrollbar-bar');
					html_button.setAttribute('type', 'button');
					html_button.setAttribute('aria-hidden', true);
					html_button.setAttribute('aria-label', 'vertical scroll button');
					html_button.setAttribute('tabindex', '-1');
					html_button.dataset.scrollxy = 'y';

					html_barwrapX.classList.add('ui-scrollbar-barwrap');
					html_barwrapX.classList.add('type-x');
					html_buttonX.classList.add('ui-scrollbar-bar');
					html_buttonX.setAttribute('type', 'button');
					html_buttonX.setAttribute('aria-hidden', true);
					html_buttonX.setAttribute('aria-label', 'vertical scroll button');
					html_buttonX.setAttribute('tabindex', '-1');
					html_buttonX.dataset.scrollxy = 'x';
					
					html_barwrap.append(html_button);
					html_barwrapX.append(html_buttonX);
					el_scrollbar.prepend(html_barwrap);
					el_scrollbar.prepend(html_barwrapX);

					(wrapH < itemH) ? 
						el_scrollbar.classList.add('view-y') : 
						el_scrollbar.classList.remove('view-y');

					(wrapW < itemW) ? 
						el_scrollbar.classList.add('view-x') : 
						el_scrollbar.classList.remove('view-x');

					let barH = Math.floor(wrapH / (itemH / 100));
					let barW = Math.floor(wrapW / (itemW / 100));
					const el_barY = el_scrollbar.querySelector('.ui-scrollbar-barwrap.type-y .ui-scrollbar-bar');
					const el_barX = el_scrollbar.querySelector('.ui-scrollbar-barwrap.type-x .ui-scrollbar-bar');

					!!el_barY ? el_barY.style.height = barH + '%' : '';
					!!el_barX ? el_barX.style.width = barW + '%' : '';
					!!el_barY ? el_barY.dataset.height = barH : '';
					!!el_barX ? el_barX.dataset.width = barW : '';

					el_scrollbar.classList.add('view-scrollbar');
					!!callback && callback(); 

					scrollEvent(false, el_item);
					scrollbarUpdate(el_scrollbar, wrapH, wrapW, itemH, itemW);
					eventFn(el_scrollbar);
				}
			}
			
			if (!!option && !!opt.selector) {
				scrollBars = document.querySelector('[data-scroll-id="'+ opt.selector +'"]');

				const that = scrollBars;
				let scrollId = opt.selector;

				if (that.dataset.ready !== 'yes') {
					//selector로 개별 실행
					if (!scrollId) {
						const idN = Number(JSON.parse(sessionStorage.getItem('scrollbarID'))) + 1;
							
						sessionStorage.setItem('scrollbarID', idN);
						scrollId = 'item' + idN;
						that.dataset.scrollId = scrollId;
					} 
					
					scrollId = opt.id !== undefined ? opt.id : scrollId

					setTimeout(() => {
						create(scrollId);
					},0);
				}
			} else {
				//기본 selector 없이 실행
				for (let i = 0, len = scrollBars.length; i < len; i++) {
					const that = scrollBars[i];
					let scrollId = that.getAttribute('data-scroll-id');
	
					if (that.dataset.ready !== 'yes') {
						//data-scroll-id가 없다면 섹션스토리지에서 생성한 아이디를 가져와 +1 하여 넣어준다.
						if (!scrollId) {
							const idN = Number(JSON.parse(sessionStorage.getItem('scrollbarID'))) + 1;
								
							sessionStorage.setItem('scrollbarID', idN);
							scrollId = 'item' + idN;
							that.dataset.scrollId = scrollId;
						} 
						
						scrollId = opt.id !== undefined ? opt.id : scrollId
	
						setTimeout(() => {
							create(scrollId);
						},0);
					}
				}
			}
		},
		destroy(v) {
			const el_scrollbar = document.querySelector('[data-scroll-id="' + v +'"]');
			const inner_scrollbars = el_scrollbar.querySelectorAll('[data-scroll-id]');
			const act = (el) => {
				const that = el;
				const el_barwrap = that.querySelectorAll('.ui-scrollbar-barwrap');
				const el_item = that.querySelector('.ui-scrollbar-item');
				let wrapHtml;
				let el_wrap;

				if (el_item !== null) {
					el_wrap = el_item.querySelector('.ui-scrollbar-wrap');
					wrapHtml = el_wrap.innerHTML;
				}

				that.dataset.ready = 'no';
				that.classList.remove('ready');
				that.classList.remove('view-y');
				that.classList.remove('view-x');
				that.classList.remove('view-scrollbar');
				that.style.overflow = 'auto';

				console.log(that);
				
				el_barwrap.forEach((userItem) => {
					that.removeChild(userItem);
				});

				if (el_item !== null) {
					that.removeChild(el_item);
					that.innerHTML = wrapHtml;
				}
				
				that.removeAttribute('data-scroll-id');
				that.removeAttribute('data-item-w');
				that.removeAttribute('data-item-h');
				that.removeAttribute('data-wrap-w');
				that.removeAttribute('data-wrap-h');
				that.removeAttribute('data-direction');
				that.removeAttribute('data-ready');
				that.removeAttribute('style');
			}

			if (inner_scrollbars.length) {
				for (const inner of inner_scrollbars) {
					act(inner);
				}
			} else {
				act(el_scrollbar);
			}
		},
		reset(v) {
			Global.scrollBar.destroy(v);
			Global.scrollBar.init(v);
		}
	}	

	/**
	 * COOKIE
	 * - set
	 * - get
	 * - del
	 */
	Global.cookie = {
		set(opt) {
			const name = opt.name;
			const value = opt.value;
			const term = opt.term;
			const path = opt.path;
			const domain = opt.domain;
			let cookieset = name + '=' + value + ';';
			let expdate;

			if (term) {
				expdate = new Date();
				
				let _hours = 23 - expdate.getHours();
				let _minutes = 59 - expdate.getMinutes();
				let _secondes = 59 - expdate.getSeconds();
				let _milliseconds = 999 - expdate.getSeconds();

				const _1d = 1000 * 60 * 60 * 24;
				const _1d_f = (1000 * 60 * 60 * _hours) + (1000 * 60 * _minutes) + (1000 * _secondes) + _milliseconds;
				const _1d_b = (1000 * 60 * 60 * expdate.getHours()) + (1000 * 60 * expdate.getMinutes())  + (1000 * expdate.getSeconds()) + expdate.getSeconds();
				let _add = 0;

				if (term > 1) {
					_add = 1000 * 60 * 60 * 24 * (term - 1);
				}

				expdate.setTime(expdate.getTime() + (_1d_b + _add)); // term 1 is a day
				cookieset += 'expires=' + expdate.toGMTString() + ';';
			}

			(path) ? cookieset += 'path=' + path + ';' : '';
			(domain) ? cookieset += 'domain=' + domain + ';' : '';

			document.cookie = cookieset;
		},
		get(name) {
			const match = ( document.cookie || ' ' ).match( new RegExp(name + ' *= *([^;]+)') );

			return (match) ? match[1] : null;
		},
		del(name){
			document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}
	}
	/*------------------------------------------------*/




	/**
	 * WINDOW POPUP
	 */
	Global.popup = {
		options: {
			name: 'new popup',
			width: 790,
			height: 620,
			align: 'center',
			top: 0,
			left: 0,
			toolbar: 'no',
			location: 'no',
			menubar: 'no',
			status: 'no',
			resizable: 'no',
			scrollbars: 'yes'
		},
		open(option) {
			const opt = Object.assign({}, this.options, option);
			const name = opt.name;
			const width = opt.width;
			const height = opt.height;
			const align = opt.align;
			const toolbar = opt.toolbar;
			const location = opt.location;
			const menubar = opt.menubar;
			const status = opt.status;
			const resizable = opt.resizable;
			const scrollbars = opt.scrollbars;
			const link = opt.link;
			let top = opt.top;
			let left = opt.left;

			if (align === 'center') {
				left = (window.innerWidth / 2) - (width / 2);
				top = (window.innerHeight / 2) - (height / 2);
			}

			const specs = 'width=' + width + ', height='+ height + ', left=' + left + ', top=' + top + ', toolbar=' + toolbar + ', location=' + location + ', resizable=' + resizable + ', status=' + status + ', menubar=' + menubar + ', scrollbars=' + scrollbars;
			
			window.open(link, name , specs);
		}
	}

	/**
	 * TABLE
	 * - scroll
	 */
	Global.table = {
		// sort(opt){
		// 	let table = document.querySelector('#' + opt.id);
		// 	let switchcount = 0;
		// 	let switching = true;
		// 	let dir = "asc";
		// 	let rows, o, x, y, shouldSwitch;

		// 	while (switching) {
		// 		switching = false;
		// 		rows = table.getElementsByTagName('TR');
		// 	}

		// 	for (o = 1; o < rows.length - 1; o++) {
		// 		shouldSwitch = false;
		// 		x = rows[o].getElementsByTagName('TD')[opt.n];
		// 		y = rows[o + 1].getElementsByTagName('TD')[opt.n];

		// 		if (dir === 'asc') {
		// 			if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
		// 				shouldSwitch = true;
		// 				break;
		// 			}
		// 		} else if(dir === 'desc') {
		// 			if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
		// 				shouldSwitch = true;
		// 				break;
		// 			}
		// 		}
		// 	}

		// 	if (shouldSwitch) {
		// 		rows[o].parentNode.insertBefore(rows[o + 1], rows[o]);
		// 		switching = true;
		// 		switchcount ++;
		// 	} else {
		// 		if (switchcount === 0 && dir === 'asc') {
		// 			dir = 'desc';
		// 			switching = true;
		// 		}
		// 	}
		// },
		
		scrollOption: {
			callback:false
		},
		scroll(option){
			const opt = Object.assign({}, this.scrollOption, option);
			const callback = opt.callback;
			const el_wraps = document.querySelectorAll('.ui-tablescroll');

			for (let i = 0, len = el_wraps.length; i < len; i++) {
				const that = el_wraps[i];
				const el_tblWrap = that.querySelector('.ui-tablescroll-wrap');
				const el_tbl = el_tblWrap.querySelector('table');
				const cloneTable = el_tbl.cloneNode(true);

				if (!that.querySelector('.ui-tablescroll-clone')) {
					that.prepend(cloneTable);

					const clone_tbl = that.querySelector('table:first-child');
					const clone_thead = clone_tbl.querySelector('thead');
					const clone_ths = clone_thead.querySelectorAll('th');
					const clone_caption = clone_tbl.querySelector('caption');
					const clone_tbodys = clone_tbl.querySelectorAll('tbody');
					
					let clone_td = '<tbody>';
					clone_caption.remove();

					for (let i = 0, len = clone_tbodys.length; i < len; i++) {
						clone_tbodys[i].remove();
					}

					clone_tbl.classList.add('ui-tablescroll-clone');
					clone_tbl.setAttribute('aria-hidden', true);
					for (let i = 0, len = clone_ths.length; i < len; i++) {
						clone_ths[i].setAttribute('aria-hidden', true);
						clone_td += '<td>'+ clone_ths[i].textContent +'</td>';
					}
					clone_td += '</tbody>';
					clone_thead.remove();
					clone_tbl.insertAdjacentHTML('beforeend',clone_td);
				}
			}

			!!callback && callback();
		}
	}

	/**
	 * INPUT TIME
	 * in use: Global.parts, Global.scroll
	 */
	Global.inputTime = {
		init() {
			const el_inps = document.querySelectorAll('.inp-base');
			for (const el_inp of el_inps) {
				el_inp.type === 'time' && this.set(el_inp);
			}
		},
		middayUnit : ['오전', '오후'],
		miuntUnit : 5, //분단위
		timerWheel : null,
		nowScrollTop : 0,
		hUnit : 0,
		set(v) {
			const inp = v;
			const id = inp.id;
			const inp_wrap = inp.parentNode;
			const unit = Number(this.miuntUnit);
			const now = new Date();
			const now_hour = Global.parts.add0(now.getHours());
			const now_minute = Global.parts.add0(unit * Math.floor(now.getMinutes() / unit));
			
			let time;
			let _time;
			let hour;
			let minute;
			let isPM;
			let hour12;

			//time modal 실행 버튼 생성
			let html = '<button type="button" class="ui-time-view" data-id="'+ id +'">';
			html += '<span class="ui-time-view-midday"></span>';
			html += '<span class="ui-time-view-hour"></span>';
			html += '<span class="ui-time-view-minute"></span>';
			html += '</button>'; 
			inp_wrap.insertAdjacentHTML('beforeend', html);
			html = '';

			const el_view = inp_wrap.querySelector('.ui-time-view');
			const el_view_midday = el_view.querySelector('.ui-time-view-midday');
			const el_view_hour = el_view.querySelector('.ui-time-view-hour');
			const el_view_minute = el_view.querySelector('.ui-time-view-minute');

			const timeSet = () => {
				time = !!inp.value ? inp.value : now_hour + ':' + now_minute;
				_time = time.split(':');
				hour = Number(_time[0]);
				minute = Number(_time[1]);
				isPM = 0;
				hour12 = hour;

				hour === 0 ? hour = 24 : '';
				hour > 11 ? isPM = 1 : '';
				hour > 23 ? isPM = 0 : '';

				inp.value = time;
				el_view_midday.textContent = Global.inputTime.middayUnit[isPM];
				el_view_hour.textContent = Global.parts.add0(hour12 === 0 ? 12 : hour12 > 12 ? hour12 - 12 : hour12);
				el_view_minute.textContent = Global.parts.add0(minute);
			}
			timeSet();
			
			inp.addEventListener('change', timeSet);
			el_view.addEventListener('click', this.show);
		},
		show(e){
			const body = document.querySelector('body');
			const that = e.currentTarget;
			const id = that.dataset.id;
			const inp = document.querySelector('#' + id);
			const title = inp.title;
			const txt_midday = Global.inputTime.middayUnit;
			const min_time = !!inp.min ? inp.min : null;
			const max_time = !!inp.max ? inp.max : null;
			const time = inp.value;

			let _time = time.split(':');
			let _time_min = min_time.split(':');
			let _time_max = max_time.split(':');
			let hour = Number(_time[0]);
			let minute = Number(_time[1]);
			let hour_min = Number(_time_min[0]) - 1 < 0 ? 0 : Number(_time_min[0]) - 1;
			let hour_max = Number(_time_max[0]);
			let minute_min = Number(_time_min[1]);
			let minute_max = Number(_time_max[1]);
			let isPM = 0;
			let hour12 = hour;
			let hour_len = 24;

			hour === 0 ? hour = 24 : '';
			hour > 11 ? isPM = 1 : '';
			hour > 23 ? isPM = 0 : '';

			let html = '<div class="ui-time-dialog">';
			html += '<div class="ui-time-wrap" data-id="'+ id +'">';
			html += '<h2 class="ui-time-tit">'+ title +'</h2>';
			html += '<div class="ui-time-line"><div></div><div></div><div></div></div>';
			html += '<div class="ui-time-midday" data-type="midday"><div class="ui-time-group"></div></div>';
			html += '<div class="ui-time-hour" data-type="hour"><div class="ui-time-group"></div></div>';
			html += '<div class="ui-time-minute" data-type="minute"><div class="ui-time-group"></div></div>';
			html += '<div class="ui-time-btns">';
			html += '<button type="button" class="btn-base ui-time-ok">선택완료</button>';
			html += '</div>';
			html += '<button type="button" class="btn-close ui-time-close" aria-label="'+ title +' 닫기"></button>';
			html += '</div>';
			html += '<div class="dim"></div>';
			html += '</div>';
			// inp.classList.add('a11y-hidden');
			body.insertAdjacentHTML('beforeend', html);
			html = '';

			const el_wrap = body.querySelector('.ui-time-wrap[data-id="'+ id +'"]');
			const el_midday = el_wrap.querySelector('.ui-time-midday');
			const el_hour = el_wrap.querySelector('.ui-time-hour');
			const el_minute = el_wrap.querySelector('.ui-time-minute');
			const el_ok = el_wrap.querySelector('.ui-time-ok');
			const el_close = el_wrap.querySelector('.ui-time-close');
			const el_modal = el_wrap.parentNode;
			const el_view = body.querySelector('.ui-time-view[data-id="'+ id +'"]');
			const el_view_midday = el_view.querySelector('.ui-time-view-midday');
			const el_view_hour = el_view.querySelector('.ui-time-view-hour');
			const el_view_minute = el_view.querySelector('.ui-time-view-minute');

			//show motion
			setTimeout(() => {
				el_modal.classList.add('on');
			},0)

			el_wrap.dataset.midday = isPM;
			el_wrap.dataset.hour = hour;
			el_wrap.dataset.minute = minute;
			el_wrap.dataset.hourMin = Number(_time_min[0]);
			el_wrap.dataset.hourMax = Number(_time_max[0]);
			el_wrap.dataset.minuteMin = Number(_time_min[1]);
			el_wrap.dataset.minuteMax = Number(_time_max[1]);
			el_view_midday.textContent = txt_midday[isPM];
			el_view_hour.textContent = Global.parts.add0(hour12 === 0 ? 12 : hour12 > 12 ? hour12 - 12 : hour12);
			el_view_minute.textContent = Global.parts.add0(minute);

			//오전,오후
			for (let i = 0; i < 2; i++) {
				const group = el_midday.querySelector('.ui-time-group');
				let btn = document.createElement('button');
				btn.type = 'button';
				btn.value = i;
				btn.textContent = txt_midday[i];

				if (isPM === i) {
					btn.dataset.selected = true;
				}

				group.appendChild(btn);
				btn = '';				
			}

			//시간
			for (let i = 1; i < hour_len + 1; i++) {
				const group = el_hour.querySelector('.ui-time-group');
				let btn = document.createElement('button');

				btn.type = 'button';
				btn.value = i;
				btn.textContent = i > 12 ? i - 12 : i;
				
				if ((hour_min + 1 > i && hour_min !== null) || (hour_max < i && hour_max !== null)) {
					btn.disabled = true;
				}
				if (hour === i) {
					btn.dataset.selected = true;
				} 

				group.appendChild(btn);
				btn = '';
			}

			//분
			for (let i = 0; i < 60; i++) {
				if (i === 0 || i % Global.inputTime.miuntUnit === 0) {
					const group = el_minute.querySelector('.ui-time-group');
					let btn = document.createElement('button');

					btn.type = 'button';
					btn.value = Global.parts.add0(i);
					btn.textContent = Global.parts.add0(i);

					if ((minute_min > i && minute_min !== null && minute_min !== minute_max) || (minute_max < i && minute_max !== null && minute_min !== minute_max)){
						btn.disabled = true;
					}
					if (minute === i) {
						btn.dataset.selected = true;
					}

					group.appendChild(btn);
				}
			}

			Global.inputTime.hUnit = el_hour.querySelectorAll('button')[0].offsetHeight;
			Global.scroll.move({ 
				top: Number(Global.inputTime.hUnit * (isPM ? 1 : 0)), 
				selector: el_midday, 
				effect: 'auto', 
				align: 'default' 
			});
			Global.scroll.move({ 
				top: Number(Global.inputTime.hUnit * (hour - 1)), 
				selector: el_hour, 
				effect: 'auto', 
				align: 'default' 
			});
			Global.scroll.move({ 
				top: Number(Global.inputTime.hUnit * Number(minute / Global.inputTime.miuntUnit)), 
				selector: el_minute, 
				effect: 'auto', 
				align: 'default' 
			});

			const el_midday_btns = el_midday.querySelectorAll('button');
			const el_hour_btns = el_hour.querySelectorAll('button');
			const el_minute_btns = el_minute.querySelectorAll('button');

			for (const btn of el_minute_btns) {
				btn.addEventListener('click', Global.inputTime.action);
			}
			for (const btn of el_hour_btns) {
				btn.addEventListener('click', Global.inputTime.action);
			}
			for (const btn of el_midday_btns) {
				btn.addEventListener('click', Global.inputTime.action);
			}

			
			el_midday.removeEventListener('touchstart', Global.inputTime.action);
			el_hour.removeEventListener('touchstart', Global.inputTime.action);
			el_minute.removeEventListener('touchstart', Global.inputTime.action);

			el_midday.addEventListener('touchstart', Global.inputTime.action);
			el_hour.addEventListener('touchstart', Global.inputTime.action);
			el_minute.addEventListener('touchstart', Global.inputTime.action);

			el_ok.addEventListener('click', Global.inputTime.complete);
			el_close.addEventListener('click', Global.inputTime.hide);	

			el_midday.addEventListener('mousedown', Global.inputTime.action);
			el_hour.addEventListener('mousedown', Global.inputTime.action);
			el_minute.addEventListener('mousedown', Global.inputTime.action);

			el_midday.addEventListener('wheel', Global.inputTime.action);
			el_hour.addEventListener('wheel', Global.inputTime.action);
			el_minute.addEventListener('wheel', Global.inputTime.action);

		},
		hide(e){
			const that = e.currentTarget;
			const el_mdoal = that.closest('.ui-time-dialog');
			el_mdoal.classList.remove('on');
			
			const act = () => {
				el_mdoal.removeEventListener('transitionend',act);
				el_mdoal.remove();
			}
			el_mdoal.addEventListener('transitionend',act);
		},
		complete(e){
			const that = e.currentTarget;
			const el_wrap = that.closest('.ui-time-wrap');
			const id = el_wrap.dataset.id;
			const val_midday = Number(el_wrap.dataset.midday);
			const val_hour = Number(el_wrap.dataset.hour);
			const val_minute = Number(el_wrap.dataset.minute);
			const el_view = document.querySelector('.ui-time-view[data-id="'+id+'"]');
			const view_midday = el_view.querySelector('.ui-time-view-midday');
			const view_hour = el_view.querySelector('.ui-time-view-hour');
			const view_minute = el_view.querySelector('.ui-time-view-minute');
			const el_inp = document.querySelector('#'+id);
			const val_hour_24 = val_hour === 24 ? 0 : val_hour;

			view_midday.textContent =  Global.inputTime.middayUnit[val_midday];
			view_hour.textContent = Global.parts.add0(val_hour_24 > 12 ? val_hour - 12 : val_hour);
			view_minute.textContent = Global.parts.add0(val_minute);
			el_inp.value = Global.parts.add0(val_hour_24) + ':' + Global.parts.add0(val_minute);

			Global.inputTime.hide(e);
		},
		
		action(e){
			const event = e;
			const that = e.currentTarget;
			const eType = e.type;
			const unit = Global.inputTime.miuntUnit;
			const el_wrap = that.closest('.ui-time-wrap');
			const el_midday = el_wrap.querySelector('.ui-time-midday');
			const el_midday_button = el_midday.querySelectorAll('button');
			const el_hour = el_wrap.querySelector('.ui-time-hour');
			const el_hour_button = el_hour.querySelectorAll('button');

			let isPM = Number(el_wrap.dataset.midday);
			let timerScroll = null;
			let touchMoving = null;
			let type_time = null;
			let that_wrap = null;
			let wrapT = 0;
			let getScrollTop = 0;
			let currentN = 0;
			let actEnd;

			const selectedInit = (v, el) => {
				const n = v;
				const btns = el;
				const val = btns[n].value;
				
				for (let i = 0, len = btns.length; i < len; i++) {
					if (!!btns[i].dataset.selected) {
						delete btns[i].dataset.selected;
					}
					if (val === btns[i].value) {
						btns[i].dataset.selected = true;
					} 
				}
			}
			const scrollSelect = (v, el) => {
				const btn = el.querySelectorAll('button');
				const len = btn.length;
				const n = v < 0 ? 0 : v > len - 1 ? len - 1 : v;
				
				el.scrollTo({
					top: Global.inputTime.hUnit * n,
					behavior: 'smooth'
				});
				selectedInit(n, el.querySelectorAll('button'));
			}
			const actMove = () => {
				touchMoving = true;
				getScrollTop = Math.abs(that_wrap.getBoundingClientRect().top - wrapT);
				that.addEventListener('touchcancel', actEnd);
				that.addEventListener('touchend', actEnd);
			}
			const actValue = (v, w) => {
				let n_hour = Number(v.dataset.hour);
				currentN = Math.floor((Math.floor(getScrollTop) + (Global.inputTime.hUnit / 2)) / Global.inputTime.hUnit);

				switch (eType) {
					case 'touchstart' :
					case 'mousedown' :
					case 'wheel' :
						scrollSelect(currentN, that);
						break;

					case 'click' : 
						currentN = w;
						break;
				}
				
				//dataset 값 설정
				switch (type_time) {
					case 'midday':
						el_hour_button[n_hour - 1].dataset.selected = false;

						if (currentN < 1) {
							//오전
							if (n_hour === 12) {
								isPM = 1;
								n_hour = n_hour + 12;
							} else if (n_hour > 12) {
								isPM = 0;
								n_hour = n_hour - 12;
							} else {
								isPM = 0;
							}
						} else {
							//오후
							if (n_hour === 24) {
								isPM = 0;
								n_hour = n_hour - 12;
							} else if (n_hour < 12) {
								isPM = 1;
								n_hour = n_hour + 12;
							} else {
								isPM = 1;
							}
						}

						el_hour_button[n_hour - 1].dataset.selected = true;
						Global.scroll.move({ 
							top: Number(Global.inputTime.hUnit * (n_hour - 1)), 
							selector: el_hour
						});

						el_wrap.dataset.midday = isPM;
						el_wrap.dataset.hour = n_hour;
						break;

					case 'hour':
						if (currentN + 1 < 12) {
							isPM = 0;
							el_midday_button[0].dataset.selected = true;
							el_midday_button[1].dataset.selected = false;
						} else if (currentN + 1 > 11 && currentN + 1 < 24) {
							isPM = 1;
							el_midday_button[1].dataset.selected = true;
							el_midday_button[0].dataset.selected = false;
						} else if (currentN + 1 > 23 ) {
							isPM = 0;
							el_midday_button[0].dataset.selected = true;
							el_midday_button[1].dataset.selected = false;
						}
						
						Global.scroll.move({ 
							top: Number(Global.inputTime.hUnit * isPM), 
							selector: el_midday
						});
						
						el_wrap.dataset.hour = currentN + 1;
						el_wrap.dataset.midday = isPM;
						break;
						
					case 'minute':
						el_wrap.dataset.minute = Global.parts.add0(currentN * unit);
						break;
				}
			}
			
			//touch 이벤트 종료시 가까운 값으로 추가 이동
			actEnd = () => {
				const scrollCompare = () => {
					timerScroll = setTimeout(() => {
						if (getScrollTop !== Math.abs(that_wrap.getBoundingClientRect().top - wrapT)) {
							getScrollTop = Math.abs(that_wrap.getBoundingClientRect().top - wrapT);
							scrollCompare();
						} else {
							actValue(that_wrap.closest('.ui-time-wrap'));
						}
						that.removeEventListener('touchmove', actMove);
						that.removeEventListener('touchend', actEnd);
						that.removeEventListener('touchcancel', actEnd);
					},180);
				} 
				touchMoving && scrollCompare();
			}
			
			//이벤트 click & touch
			const eventList = {
				click() {
					const el_p = that.parentNode;
					const el_pp = that.parentNode.parentNode;
					const btns = el_p.querySelectorAll('button');
					const nodes = [... e.target.parentElement.children];
					let index = Number(nodes.indexOf(e.target));

					that_wrap = el_pp.querySelector('.ui-time-group');
					type_time = el_pp.dataset.type;
					wrapT = el_pp.getBoundingClientRect().top;
					currentN = 0;

					el_pp.scrollTo({
						top: Global.inputTime.hUnit * index,
						behavior: 'smooth'
					});
					actValue(el_wrap, index);
					selectedInit(index, btns);
				},
				wheel(){
					type_time = that.dataset.type;
					that_wrap = that.closest('.ui-time-wrap');
					
					event.preventDefault();
					if (event.deltaY > 0) {//아래로
						getScrollTop = that.scrollTop + Global.inputTime.hUnit;
					} else if (event.deltaY < 0) {//위로
						getScrollTop = that.scrollTop - Global.inputTime.hUnit;
					}
					actValue(that_wrap);
				},
				mousedown() {
					const btns = that.querySelectorAll('button');
					const tn = that.scrollTop;
					const ts = e.pageY - tn;

					type_time = that.dataset.type;
					that_wrap = that.querySelector('.ui-time-group');
					wrapT = that.getBoundingClientRect().top;
					
					const onMouseMove = (e) => {
						const tm = e.pageY - tn;

						that.scrollTo(0, tn + ts - tm);

						for (const btn of btns) {
							btn.removeEventListener('click', Global.inputTime.action);
						}
					}
					
					document.addEventListener('mousemove', onMouseMove);
					document.onmouseup = (e) => {
						document.removeEventListener('mousemove', onMouseMove);
						document.onmouseup = null;
						getScrollTop = Math.abs(that_wrap.getBoundingClientRect().top - wrapT);

						actValue(that_wrap.closest('.ui-time-wrap'));

						setTimeout(() => {
							for (const btn of btns) {
								btn.addEventListener('click', Global.inputTime.action);
							}
						},0);
					}
				},
				touchstart() {
					that_wrap = that.querySelector('.ui-time-group');
					type_time = that.dataset.type;
					wrapT = that.getBoundingClientRect().top;
					currentN = 0;
					getScrollTop = Math.abs(that_wrap.getBoundingClientRect().top - wrapT);

					clearTimeout(timerScroll);
					that.addEventListener('touchmove', actMove);
				}
			}
			eventList[eType]();
		}
	}

	/**
	 * FORM 
	 * in use: Global.sheets
	 */
	Global.form = {
		init() {
			const el_inps = document.querySelectorAll('.inp-base');
			const prefix = (inp) => {
				const wrap = inp.parentElement;

				if (!wrap.querySelector('.prefix')){
					const preFixTxt = document.createElement('span');
					const theFirstChild = wrap.firstChild;
					const txt = inp.dataset.prefix;

					preFixTxt.classList.add('prefix');
					preFixTxt.textContent = txt;
					wrap.insertBefore(preFixTxt, theFirstChild);

					const w = wrap.querySelector('.prefix').offsetWidth;

					wrap.querySelector('.inp-base').style.paddingLeft = w + 'px';
				}
			}
			const suffix = (inp) => {
				const wrap = inp.parentElement;

				if (!wrap.querySelector('.suffix')){
					const fixTxt = document.createElement('span');
					const txt = inp.dataset.suffix;

					fixTxt.classList.add('suffix');
					fixTxt.textContent = txt;
					wrap.appendChild(fixTxt);

					const w = wrap.querySelector('.suffix').offsetWidth;

					inp.dataset.suf = w;
					wrap.querySelector('.inp-base').style.paddingRight = w + 'px';
				}
			}

			for (let i = 0, len = el_inps.length; i < len; i++) {
				const inp = el_inps[i];

				inp.addEventListener('focus', this.actClear);
				inp.addEventListener('input', this.actClear);
				inp.addEventListener('blur', this.actClear);
				
				//prefix, suffix text
				!!inp.dataset.prefix && prefix(inp);
				!!inp.dataset.suffix && suffix(inp);
				!!inp.value && (!!inp.dataset.clear || inp.type === 'search') && (!!inp.dataset.keep || inp.type === 'search') && this.actClear(inp);
			}
		},
		clearTimer:{},
		actClear(event) {
			let inp;
			const isInput = event.type === 'text' || event.type === 'search' || event.type === 'number' || event.type === 'tel' || event.type === 'email' || event.type === 'file' || event.type === 'password' || event.type === 'url' || event.type === 'tel' || event.type === 'date';
			if (isInput) {
				inp = event;
			} else {
				inp = event.currentTarget;
			}

			// const id = inp.id;
			const title = inp.title;
			const wrap = inp.parentElement;
			const suffix = wrap.querySelector('.suffix');
			const isValue = inp.value;
			let eventType = event.type;
			const isClear = inp.dataset.clear || inp.type === 'search' ? true : false;
			let isKeep = inp.dataset.keep;
			const w_suffix = !!suffix ? suffix.offsetWidth : 0;
			const paddingR = Number((inp.style.paddingRight).split('px')[0]);

			if (!isClear) {
				return false;
			}

			if (isInput) {
				eventType = 'input';
			}
			
			if (inp.type === 'search') {
				isKeep = true;
			}
			
			const clear = () => {
				clearTimeout(this.clearTimer);
				inp.value = '';
				inp.focus();
			}
			const beforeClear = () => {
				const btn = wrap.querySelector('.ui-clear');
				const btnclear = () => {
					if (!!btn) {
						const w = btn.offsetWidth;
						inp.style.paddingRight = paddingR - w + 'px';
						btn.removeEventListener('click', clear);
						btn.remove();
					}
				}
				(!!isKeep) ? (!inp.value) && btnclear() : btnclear();
			}

			switch (eventType) {
				case 'focus' :
				case 'input' :
					if (!!isValue) {
						if (!wrap.querySelector('.ui-clear')) {
							const clearbutton = document.createElement('button');
							clearbutton.type = 'button';
							clearbutton.classList.add('btn-clear');
							clearbutton.classList.add('ui-clear');
							clearbutton.setAttribute('aria-label', title + ' 값 삭제');
							// clearbutton.dataset.id = id;
							
							inp.after(clearbutton);

							const btn = wrap.querySelector('.ui-clear');
							const w = btn.offsetWidth + w_suffix;

							inp.style.paddingRight = w + 'px'
							btn.style.marginRight = w_suffix + 'px';

							btn.addEventListener('focus', () => clearTimeout(this.clearTimer));
							btn.addEventListener('blur', beforeClear);
							btn.removeEventListener('click', clear);
							btn.addEventListener('click', clear);
						}
					} else {
						beforeClear();
					}
					break;

				case 'blur' :
					if (!!wrap.querySelector('.ui-clear')) {
						this.clearTimer = setTimeout(() => {
							beforeClear();
						},300);
					}
					break;
			}
		},

		fileUpload() {
			const el_files = document.querySelectorAll('.ui-file-inp');
			const fileTypes = [
				"image/apng",
				"image/bmp",
				"image/gif",
				"image/jpeg",
				"image/pjpeg",
				"image/png",
				"image/svg+xml",
				"image/tiff",
				"image/webp",
				"image/x-icon"
			];

			const fileDelete = (e) => {
				const id = e.currentTarget.dataset.id;
				
				const list = document.querySelector('.ui-file-list[data-id="'+ id +'"]');
				const list_ul = list.querySelector('ul');
				const list_li = list.querySelectorAll('li');
				const inp = document.querySelector('#'+ id);
				const nodes = [... list_ul.children];
				const index = Number(nodes.indexOf(e.currentTarget.closest('li')));

				const dataTransfer = new DataTransfer();
				const _files = inp.files;	
				let fileArray = Array.from(_files);
				
				fileArray.splice(index, 1);
				fileArray.forEach((file) => { 
					dataTransfer.items.add(file); 
				});
				list_li[index].remove();
				inp.files = dataTransfer.files;	
			}
			const validFileType = (file) => {
				return fileTypes.includes(file.type);
			}
			const returnFileSize = (number) => {
				if(number < 1024) {
					return number + 'bytes';
				} else if(number >= 1024 && number < 1048576) {
					return (number/1024).toFixed(1) + 'KB';
				} else if(number >= 1048576) {
					return (number/1048576).toFixed(1) + 'MB';
				}
			}

			const updateImageDisplay = (e) => {
				const el_file = e.currentTarget;
				const id = el_file.id;
				const preview = document.querySelector('.ui-file-list[data-id="'+ id +'"]');
				const curFiles = el_file.files;

				while(preview.firstChild) {
					preview.removeChild(preview.firstChild);
				}

				if(curFiles.length === 0) {
					const para = document.createElement('p');
					para.textContent = 'No files currently selected for upload';
					preview.appendChild(para);
				} else {
					const list = document.createElement('ul');
					const title = document.createElement('h4');
					
					title.textContent = 'File upload list';
					title.classList.add('a11y-hidden');
					preview.classList.add('on');
					preview.appendChild(title);
					preview.appendChild(list);
					
					for (let i = 0, len = curFiles.length; i < len; i++) {
						const that = curFiles[i];
						const listItem = document.createElement('li');
						const para = document.createElement('p');
						const delbutton = document.createElement('button');

						delbutton.type = 'button';
						delbutton.classList.add('ui-file-del');
						delbutton.title = '파일 삭제';
						delbutton.dataset.id = id;
						delbutton.dataset.n = i;

						para.textContent = that.name + ', ' + returnFileSize(that.size) + '.';

						if(validFileType(that)) {
							const image = document.createElement('img');
							image.src = URL.createObjectURL(that);

							listItem.appendChild(image);
						} 
							
						listItem.appendChild(para);
						listItem.appendChild(delbutton);
						list.appendChild(listItem);
						delbutton.addEventListener('click', fileDelete);
					}
				}
			}

			for (let i = 0, len = el_files.length; i < len; i++) {
				const that = el_files[i];

				if (!that.dataset.ready) {
					that.addEventListener('change', updateImageDisplay);
					that.dataset.ready = true;
				}
			}
		},
		allCheck(opt) {
			const el_parents = document.querySelectorAll('[data-allcheck-parent]');
			const el_childs = document.querySelectorAll('[data-allcheck-child]');
			const opt_callback = opt.allCheckCallback;

			const allCheckParent = () => {
				isAllChecked({
					name: this.dataset.allcheckParent, 
					type: 'parent'
				});
			}

			const allCheckChild = () => {
				isAllChecked({
					name: this.dataset.allcheckChild, 
					type: 'child'
				});
			}
			
			const isAllChecked = (opt) =>{
				const isType = opt.type;
				const isName = opt.name;
				const parent = document.querySelector('[data-allcheck-parent="' + isName + '"]');
				const childs = document.querySelectorAll('[data-allcheck-child="' + isName + '"]');
				const allChecked = parent.checked;
				const len = childs.length;
				let n_checked = 0;
				let n_disabled = 0;

				for (let i = 0; i < len; i++) {
					const child = childs[i];
					
					if (isType === 'parent' && !child.disabled) {
						child.checked = allChecked;
					} 
					
					n_checked = child.checked && !child.disabled ? ++n_checked : n_checked;
					n_disabled = child.disabled ? ++n_disabled : n_disabled;
				}

				parent.checked = (len !== n_checked + n_disabled) ? false : true;

				opt_callback({
					group: isName,
					allChecked: parent.checked
				});
			}
			
			for (let i = 0; i < el_parents.length; i++) {
				if (!el_parents[i].dataset.apply) {
					el_parents[i].addEventListener('change', allCheckParent);
					isAllChecked({
						name: el_parents[i].dataset.allcheckParent, 
						type: 'child'
					});
				}

				el_parents[i].dataset.apply = '1';
			}

			for (let i = 0; i < el_childs.length; i++) {
				if (!el_childs[i].dataset.apply) {
					el_childs[i].addEventListener('change', allCheckChild);
				}

				el_childs[i].dataset.apply = '1';
			}
		}
	}

	/**
	 * ACCORDION
	 * in use: Global.state, Global.para
	 */
	Global.accordion = {
		data: {},
		options: {
			current: null,
			autoclose: false,
			callback: false,
			effect: Global.state.effect.easeInOut,
			effTime: '.2'
		},
		init(option){
			const opt = Object.assign({}, Global.accordion.options, option);
			const accoId = opt.id;
			const callback = opt.callback;
			let current = opt.current;
			let autoclose = opt.autoclose;
			const el_acco = document.querySelector('.ui-acco[data-id="' + accoId +'"]');
			const el_wrap = document.querySelectorAll('.ui-acco[data-id="' + accoId +'"] > .ui-acco-wrap');
			const len = el_wrap.length;
			const para = Global.para.get('acco');

			let paras;
			let paraname;
			
			//set up : parameter > current
			if (!!para) {
				if (para.split('+').length > 1) {
					//2 or more : acco=exeAcco1*2+exeAcco2*3
					paras = para.split('+');
	
					for (let j = 0; j < paras.length; j++ ) {
						paraname = paras[j].split('*');
						accoId === paraname[0] ? current = [Number(paraname[1])] : '';
					}
				} else {
					//only one : tab=1
					if (para.split('*').length > 1) {
						paraname = para.split('*');
						accoId === paraname[0] ? current = [Number(paraname[1])] : '';
					} else {
						current = [Number(para)];
					}
				}
			}

			el_acco.dataset.n = len;

			//panel의 aria, 높이값, 이벤트 등 기본 설정 & 전체열림일 경우 panel 설정
			for (let i = 0; i < len; i++) {
				const that = el_wrap[i];
				const el_tit = that.querySelector('.ui-acco-tit');
				const el_pnl = that.querySelector('.ui-acco-pnl');
				const el_btn = el_tit.querySelector('.ui-acco-btn');
				const el_hide = el_btn.querySelector('.hide');
				const el_pnl_wrap = that.querySelector('.ui-acco-pnl-wrap');
				
				that.dataset.n = i;
				(el_tit.tagName !== 'DT') && el_tit.setAttribute('role','heading');

				el_btn.id = accoId + 'Btn' + i;
				el_btn.dataset.selected = false;
				el_btn.setAttribute('aria-expanded', false);
				!!el_hide ? el_hide.textContent = '열기' : '';
				el_btn.removeAttribute('data-order');
				el_btn.dataset.n = i;

				//패널이 있다면
				if (!!el_pnl) {
					el_pnl.id = accoId + 'Pnl' + i;
					el_btn.setAttribute('aria-controls', el_pnl.id);
					el_pnl.setAttribute('aria-labelledby', el_btn.id);
					
					if (accoId === el_pnl_wrap.closest('.ui-acco').dataset.id) {
						el_pnl.dataset.height = el_pnl_wrap.offsetHeight;
					}

					el_pnl.classList.add('off');
					el_pnl.setAttribute('aria-hidden', true);
					el_pnl.dataset.n = i;
					el_pnl.style.height = '0px';

					//전체 열림이 설정이라면
					if (current === 'all') {
						el_pnl.classList.remove('off');
						// el_pnl.style.height = 'auto';
						el_btn.dataset.selected = true;
						el_btn.setAttribute('aria-expanded', true);
						!!el_hide ? el_hide.textContent = '닫기' : '';
						el_pnl.setAttribute('aria-hidden', false);
					}
				}

				if (i === 0) {el_btn.dataset.order = 'first';}
				if (i === len - 1) {el_btn.dataset.order = 'last';}

				el_btn.removeEventListener('click', Global.accordion.evtClick);
				el_btn.removeEventListener('keydown', Global.accordion.evtKeys);
				el_btn.addEventListener('click', Global.accordion.evtClick);
				el_btn.addEventListener('keydown', Global.accordion.evtKeys);
			}

			//열려있는 panel 설정
			//current값은 array형식으로 하나이상의 구성
			const currentLen = current === null ? 0 : current === 'all' ? len :current.length;

			for (let i = 0; i < currentLen; i++) {
				const n = (current === 'all') ? i : current[i];
				const this_wrap = el_acco.querySelector('.ui-acco-wrap[data-n="'+ n +'"]');
				const _tit = this_wrap.querySelector('.ui-acco-tit');
				const _btn = _tit.querySelector('.ui-acco-btn');
				const _pnl = this_wrap.querySelector('.ui-acco-pnl');
				const _el_hide = _btn.querySelector('.hide');

				//direct children 
				if (accoId === this_wrap.closest('.ui-acco').dataset.id && !!_pnl) {
					_btn.dataset.selected = true;
					_btn.setAttribute('aria-expanded', true);
					_pnl.classList.remove('off');
					_pnl.style.height = 'auto';
					_pnl.setAttribute('aria-hidden', false);
					_btn.dataset.selected = true;
					_pnl.style.height = _pnl.offsetHeight + 'px';
					!!_el_hide ? _el_hide.textContent = '닫기' : '';
				} 
			}
			
			//콜백실행
			!!callback && callback();
			//개별 아코딩언마다 네임스페이스 생성하여 정보 저장
			Global.accordion[accoId] = {
				callback: callback,
				autoclose: autoclose,
				current: current
			};
		},
		evtClick(event) {
			const that = event.currentTarget;
			const btnId = that.id;
			const n = that.dataset.n;
			const wrap = that.closest('.ui-acco-pnl');
			let accoId = btnId.split('Btn');
				accoId = accoId[0];

			if (!!btnId) {
				event.preventDefault();

				if (!!wrap) {
					wrap.style.height = 'auto';
				} 
				
				Global.accordion.toggle({ 
					id: accoId, 
					current: [n]
				});
			}
		},
		evtKeys (event) {
			const that = event.currentTarget;
			const btnId = that.id;
			const n = Number(that.dataset.n);
			const keys = Global.state.keys;

			let accoId = btnId.split('Btn');
				accoId = accoId[0];

			const acco = document.querySelector('.ui-acco[data-id="' + accoId +'"]');
			const len = Number(acco.dataset.n);

			const upLeftKey = (event) => {
				event.preventDefault();
				that.dataset.order !== 'first' ?
				acco.querySelector('#' + accoId + 'Btn' + (n - 1)).focus():
				acco.querySelector('#' + accoId + 'Btn' + (len - 1)).focus();
			}
			const downRightKey = (event) => {
				event.preventDefault();
				that.dataset.order !== 'last' ?
				acco.querySelector('#' + accoId + 'Btn' + (n + 1)).focus():
				acco.querySelector('#' + accoId + 'Btn0').focus();
			}
			const endKey = (event) => {
				event.preventDefault();
				acco.querySelector('#' + accoId + 'Btn' + (len - 1)).focus();
			}
			const homeKey = (event) => {
				event.preventDefault();
				acco.querySelector('#' + accoId + 'Btn0').focus();
			}

			switch(event.keyCode){
				case keys.up:	
				case keys.left: upLeftKey(e);
					break;

				case keys.down:
				case keys.right: downRightKey(e);
					break;

				case keys.end: endKey(e);
					break;

				case keys.home: homeKey(e);
					break;
			}
		},
		timer : null,
		toggle(opt){
			const accoId = opt.id;
			const el_acco = document.querySelector('.ui-acco[data-id="' + accoId +'"]');
			const current = opt.current === undefined ? null : opt.current;
			const callback = opt.callback === undefined ? opt.callback : Global.accordion[accoId].callback;
			const state = opt.state === undefined ? 'toggle' : opt.state;
			const autoclose = opt.autoclose === undefined ? Global.accordion[accoId].autoclose : opt.autoclose;
			let el_wraps = el_acco.querySelectorAll('.ui-acco-wrap');
			let el_pnl;
			let el_tit;
			let el_btn;
			let len = el_wraps.length;
			
			const act = (v) => {
				const isHide = !(v === 'hide'); //true | false
				const toggleSlide = (opt) => {
					let isShow = false;
					const el = opt.el;
					const btnID = el.getAttribute('aria-labelledby');
					const el_btn = document.querySelector('#' + btnID);
					const el_hide = el_btn.querySelector('.hide');
					const state = opt.state;
				
					//accordion inner
					const el_child = el.querySelector('.ui-acco-pnl-wrap');
					const acco = el.closest('.ui-acco');
					const acco_parent = acco.closest('.ui-acco-pnl');

					el_btn.dataset.selected = isHide;
					el_btn.setAttribute('aria-expanded', isHide);
					if (el_hide) {
						isHide ? el_hide.textContent = '닫기' : el_hide.textContent = '열기';
					}
					 
					//show 동작
					const show = () => {
						isShow = true;
						el_btn.setAttribute('aria-expanded', true);
						el_btn.dataset.selected = true;
						el.setAttribute('aria-hidden', false);
						el.classList.remove('off');
						el.style.height = el_child.offsetHeight + 'px';
						if (el_hide) {
							el_hide.textContent = '닫기';
						}
					}

					//hide 동작
					const hide = () => {
						isShow = false;						
						el_btn.setAttribute('aria-expanded', false);
						el_btn.dataset.selected = false;
						el.style.height = 0;
						if (el_hide) {
							el_hide.textContent = '열기';
						}
					}
					//end 동작
					const end = () => {
						if (el.style.height === '0px') {
							el.classList.add('off');
							el.setAttribute('aria-hidden', true);
						}  

						if (!!acco_parent) {
							acco_parent.style.height = acco_parent.querySelector('.ui-acco-pnl-wrap').offsetHeight + 'px';
						} 

						el.removeEventListener('transitionend', end);
					}

					el.addEventListener('transitionend', end);
		
					(state === 'toggle') ?
						(el_btn.dataset.selected === 'true') ? show() : hide() :
						(state === 'show') ? show() : hide();
				}

				//set up close
				if (!!autoclose || current === 'all') {
					for (let i = 0, len = el_wraps.length; i < len; i++) {
						const that = el_wraps[i];
						const _tit = that.querySelector('.ui-acco-tit');
						const _btn = _tit.querySelector('.ui-acco-btn');
						const _pnl = that.querySelector('.ui-acco-pnl');
						const _el_hide = _btn.querySelector('.hide');

						//direct children 
						if (accoId === that.closest('.ui-acco').dataset.id) {
							if (!!_pnl) {
								//자동닫히기
								if (!!autoclose && Number(current[0]) !== Number(i)) {
									_btn.dataset.selected = false;
									_btn.setAttribute('aria-expanded', false);
									_pnl.setAttribute('aria-hidden', true);
									if (_el_hide) {
										_el_hide.textContent = '열기';
									}
									toggleSlide({
										el: _pnl, 
										state: 'hide'
									});
								}
								//전체 열고 닫기
								if (current === 'all') {
									_btn.dataset.selected = isHide;
									_btn.setAttribute('aria-expanded', isHide);
									_pnl.setAttribute('aria-hidden', !isHide);
									if (_el_hide) {
										isHide ? _el_hide.textContent = '닫기' : _el_hide.textContent = '열기';
									}
									toggleSlide({
										el: _pnl, 
										state: !isHide ? 'show' : 'hide'
									});
								}
							}
						}
					}
				}
				
				//기본
				if (current !== 'all') {
					if (!!el_pnl) {
						// el_pnl.setAttribute('aria-hidden', isHide);
						toggleSlide({
							el: el_pnl, 
							state: 'toggle'
						});
					}
				}
			}

			//선택값이 없다면 0 , 있다면 선택값 전체갯수
			const currentLen = current === null ? 0 : current.length;
			if (current !== 'all') {
				
				//전체선택이 아닌 일반적인 경우

				for (let i = 0; i < currentLen; i++) {
					const this_wrap = el_acco.querySelector('.ui-acco-wrap[data-n="'+ current[i] +'"]');
					el_tit = this_wrap.querySelector('.ui-acco-tit');
					el_pnl = this_wrap.querySelector('.ui-acco-pnl');
					el_btn = el_tit.querySelector('.ui-acco-btn');

					//direct children 
					if (accoId === this_wrap.closest('.ui-acco').dataset.id && !!el_pnl) {
						switch(state) {
							case 'toggle' : (el_btn.dataset.selected === 'true') ? act('hide') : act('show');
								break;
							case 'open' : act('show');
								break;
							case 'close' : act('hide');
								break;
						}
					}
				}

				!!callback && callback({ 
					id: accoId, 
					current: current
				});
			} else if (current === 'all') {
				//state option 
				if (state === 'open') {
					check = 0;
					el_acco.dataset.allopen = false;
				} else if (state === 'close') {
					check = len;
					el_acco.dataset.allopen = true;
				}

				//all check action
				if (el_acco.dataset.allopen !== 'true') {
					el_acco.dataset.allopen = true;
					act('hide');
				} else {
					el_acco.dataset.allopen = false;
					act('show');
				}
			}
		}
	}
	
	/**
	 * RANGE SLIDER
	 * in use: Global.state
	 */
	Global.rangeSlider = {
		init(opt){
			const id = opt.id;
			const values = opt.value;
			const title = opt.title ? opt.title : '';
			const el_range = document.querySelector('.ui-range[data-id="'+ id +'"]');
			const el_from = el_range.querySelector('.ui-range-inp[data-range="from"]');
			const el_to = el_range.querySelector('.ui-range-inp[data-range="to"]');
			const el_inp = el_range.querySelectorAll('.ui-range-inp');
			const isText = !!opt.text ? opt.text : false;
			const track = el_range.querySelector('.ui-range-track');
			const isMarks = el_range.querySelectorAll('.ui-range-marks');
			const step = !!opt.step ? opt.step : 1;
			const min = !!opt.min ? opt.min : Number(el_inp[0].min);
			const max = !!opt.max ? opt.max : Number(el_inp[0].max);
			const tickmark = !!opt.tickmark ? opt.tickmark : false;

			Global.rangeSlider[id] = {
				id: id,
				text: isText,
				tickmark: tickmark,
				title: title
			}
			
			el_from.value = values[0];
			el_from.min = min;
			el_from.max = max;
			el_from.step = step;
			
			if (!!el_to) {
				el_from.setAttribute('aria-label', title + ' 최소 ' + isText[el_from.value]);
				el_to.value = values[1];
				el_to.min = min;
				el_to.max = max;
				el_to.step = step;
				el_to.setAttribute('aria-label', title + ' 최대 ' + isText[el_to.value]);
			} else {
				el_from.setAttribute('aria-label',title + ' ' + isText[el_from.value]);
			}

			!!track && track.remove();
			if (!!isMarks) {
				for (const isMark of isMarks) {
					isMark.remove();
				}
			} 

			let html = '<div class="ui-range-track">';
			html += '<div class="ui-range-bar"></div>';
			html += '<span class="left ui-range-point" data-range="from" aria-hidden="true"><em class="ui-range-txt" data-from="'+ id +'"></em></span>';

			if (!!el_to) {
				html += '<span class="right ui-range-point" data-range="to"  aria-hidden="true"><em class="ui-range-txt" data-to="'+ id +'"></em></span>';
			}
			
			html += '</div>';
			if (!!tickmark) {
				html += '<div class="ui-range-marks" id="'+ id +'_tickmarks_from" data-from="true">';
				const len = tickmark.length;
				
				for (let i = 0; i < len; i++) {
					const n = (max - min) / (len - 1);
					let isSame = '';

					if (!!el_from) {
						isSame = Number(el_from.value) === (n * i + min) ? '선택됨' : '';
					}

					(!!el_to) ? 
					html += '<button class="ui-range-btn" data-id="'+ id +'" type="button" data-value="'+ (n * i + min) +'"><span class="a11y-hidden">'+ title +' 최소 </span><span>'+ tickmark[i] +'</span><span class="a11y-hidden state">'+ isSame +'</span></button>':
					html += '<button class="ui-range-btn" data-id="'+ id +'" type="button" data-value="'+ (n * i + min) +'"><span class="a11y-hidden">'+ title +' </span><span>'+ tickmark[i] +'</span><span class="a11y-hidden state">'+ isSame +'</span></button>';
				}

				html += '</div>';

				if (!!el_to) {
					html += '<div class="ui-range-marks" id="'+ id +'_tickmarks_to" data-to="true">';
				
					for (let i = 0; i < len; i++) {
						const n = (max - min) / (len - 1);
						let isSame = '';

						if (!!el_to && isSame === '') {
							isSame = Number(el_to.value) === (n * i + min) ? '선택됨' : '';
						}

						html += '<button class="ui-range-btn" data-id="'+ id +'" type="button" data-value="'+ (n * i + min) +'"><span class="a11y-hidden">'+ title +' 최대 </span><span>'+ tickmark[i] +'</span><span class="a11y-hidden state">'+ isSame +'</span></button>'
					}
				}
				
				html += '</div>';

			}

			el_range.insertAdjacentHTML('beforeend', html);
			html = '';

			// if (!el_to) {
			// 	html = '<strong class="a11y-hidden">'+ el_from.value +'</strong>';
			// } else {
			// 	html = '<strong class="a11y-hidden">'+ el_from.value +'부터 '+ el_to.value +'까지</strong>';
			// }
			el_range.insertAdjacentHTML('beforeend', html);

			const el_from_btn = el_range.querySelector('.ui-range-point.left');
			const el_to_btn = el_range.querySelector('.ui-range-point.right');
			const eventName = !!Global.state.browser.ie ? 'click' : 'input';
			const marks = el_range.querySelectorAll('.ui-range-marks');

			el_from_btn.dataset.range = 'from';
			el_to_btn ? el_to_btn.dataset.range = 'to' : '';
			el_range.dataset.from = '0';
			el_range.dataset.to = '0';

			if (!!marks) {
				for (let mark of marks) {
					const btns = mark.querySelectorAll('.ui-range-btn');

					for (let btn of btns) {
						btn.addEventListener('click', Global.rangeSlider.clcikRange);
					}
				}
			}

			if (el_from && el_to) {
				//range
				Global.rangeSlider.rangeFrom({
					id: id,
					value: values[0]
				});
				Global.rangeSlider.rangeTo({
					id: id,
					value: values[1]
				});

				//input - click input event
				el_from.addEventListener(eventName, () => {
					Global.rangeSlider.rangeFrom({
						id: id
					});
				});
				el_to.addEventListener(eventName, () => {
					Global.rangeSlider.rangeTo({
						id: id
					});
				});
				
				//point - mouseover event
				if (!Global.state.device.mobile) {
					el_to_btn.addEventListener('mouseover', Global.rangeSlider.inputFocus);
					el_from_btn.addEventListener('mouseover', Global.rangeSlider.inputFocus);
				} else {
					//point - touchstart event
					el_to_btn.addEventListener('touchstart', Global.rangeSlider.touchFocus);
					el_from_btn.addEventListener('touchstart', Global.rangeSlider.touchFocus);
				}

				el_inp[0].step = step;
				el_inp[1].step = step;
				el_inp[0].min = min;
				el_inp[0].max = max;
				el_inp[1].min = min;
				el_inp[1].max = max;
				if (!!Global.state.device.mobile) {
					el_inp[0].setAttribute('aria-hidden', true);
					el_inp[1].setAttribute('aria-hidden', true);
				} else {
					el_inp[0].setAttribute('tabindex', -1);
					el_inp[1].setAttribute('tabindex', -1);
				}
			} else {
				//single
				Global.rangeSlider.rangeFrom({
					id: id,
					type: 'single'
				});
				el_from.addEventListener(eventName, () => {
					Global.rangeSlider.rangeFrom({
						id: id,
						type: 'single'
					});
				});

				el_from_btn.addEventListener('mouseover', () => {
					el_from.classList.add('on');
					el_from.focus();
				});

				el_inp[0].step = step;
				el_inp[0].min = min;
				el_inp[0].max = max;
				if (!!Global.state.device.mobile) {
					el_inp[0].setAttribute('aria-hidden', true);
				} else {
					el_inp[0].setAttribute('tabindex', -1);
				}
			}
			el_from.classList.add('on');
			!!el_to && el_to.classList.remove('on');
		},
		clcikRange(e){
			const btn = e.currentTarget;
			const id = btn.dataset.id;
			const value = Number(btn.dataset.value);
			const btn_text = btn.textContent;
			const range = btn.closest('.ui-range');
			const marks = btn.closest('.ui-range-marks');
			const isFrom = marks.dataset.from;
			const type = range.dataset.type;
			const to = Number(range.dataset.to);
			const from = Number(range.dataset.from);
			const rg = range.querySelector('.ui-range-inp.on').dataset.range;

			if (!!isFrom) {
				Global.rangeSlider.rangeFrom({
					id : id,
					value : value
				});
			} else {
				Global.rangeSlider.rangeTo({
					id : id,
					value : value
				});
			}
			


			// if (type === 'single') {
			// 	Global.rangeSlider.rangeFrom({
			// 		id : id,
			// 		value : value
			// 	});
			// } else {
			// 	if (value === to && rg !== 'to') {
			// 		Global.rangeSlider.rangeFrom({
			// 			id : id,
			// 			value : value
			// 		});
			// 	} else if (value === from && rg !== 'from') {
			// 		Global.rangeSlider.rangeTo({
			// 			id : id,
			// 			value : value
			// 		});
			// 	} else {
			// 		if ((((to - from) / 2) + from) > value) {
			// 			Global.rangeSlider.rangeFrom({
			// 				id : id,
			// 				value : value
			// 			});
			// 		} else {
			// 			Global.rangeSlider.rangeTo({
			// 				id : id,
			// 				value : value
			// 			});
			// 		}
			// 	}
			// }
		},
		touchFocus(e) {
			const point = e.currentTarget
			const toFrom = point.dataset.range;
			const eType = e.type;
			const point_parent = point.parentNode;
			const uirange = point.closest('.ui-range');
			const el_to = uirange.querySelector('.ui-range-inp[data-range="to"]');
			const el_from = uirange.querySelector('.ui-range-inp[data-range="from"]');
			const el_point_to = point_parent.querySelector('.ui-range-point[data-range="to"]');
			const el_point_from = point_parent.querySelector('.ui-range-point[data-range="from"]');

			if (toFrom === 'to') {
				el_point_to.classList.add('on');
				el_point_from.classList.remove('on');
				el_to.classList.add('on');
				el_from.classList.remove('on');
				el_to.focus();
	
			} else {
				el_point_from.classList.add('on');
				el_point_to.classList.remove('on');
				el_to.classList.remove('on');
				el_from.classList.add('on');
				el_from.focus();
			}	
		},
		inputFocus(e) {
			const point = e.currentTarget
			const toFrom = point.dataset.range;
			const eType = e.type;
			const point_parent = point.parentNode;
			const uirange = point.closest('.ui-range');
			const el_to = uirange.querySelector('.ui-range-inp[data-range="to"]');
			const el_from = uirange.querySelector('.ui-range-inp[data-range="from"]');
			const el_point_to = point_parent.querySelector('.ui-range-point[data-range="to"]');
			const el_point_from = point_parent.querySelector('.ui-range-point[data-range="from"]');
			point.removeEventListener('mouseover', Global.rangeSlider.inputFocus);
		
			if (toFrom === 'to') {
				el_to.classList.add('on');
				el_from.classList.remove('on');
				el_to.focus();
				el_to.addEventListener('change', Global.rangeSlider.valuecheck);
				el_point_from.addEventListener('mouseover', Global.rangeSlider.inputFocus);
	
			} else {
				el_to.classList.remove('on');
				el_from.classList.add('on');
				el_from.focus();
				el_from.addEventListener('change', Global.rangeSlider.valuecheck);
				el_point_to.addEventListener('mouseover', Global.rangeSlider.inputFocus);
			}	
		},
		valuecheck(e){
			const el = e.currentTarget;
			const uirange = el.closest('.ui-range');
			const el_to = uirange.querySelector('.ui-range-inp[data-range="to"]');
			const el_from = uirange.querySelector('.ui-range-inp[data-range="from"]');

			if (el_to.value === el_from.value) {
				uirange.classList.add('same');
			} else {
				uirange.classList.remove('same')
			}
		},
		
		rangeFrom(opt){
			const id = opt.id;
			const v = opt.value;
			const el_range = document.querySelector('.ui-range[data-id="'+ id +'"]');
			const type = !!opt.type ? opt.type : !!el_range.dataset.type ? el_range.dataset.type : null;
			const el_from = el_range.querySelector('.ui-range-inp[data-range="from"]');
			const el_to = el_range.querySelector('.ui-range-inp[data-range="to"]');
			const el_left = el_range.querySelector(".ui-range-point.left");
			const el_right = el_range.querySelector(".ui-range-point.right");
			const el_bar = el_range.querySelector(".ui-range-bar");
			const inp_froms = document.querySelectorAll('[data-from="'+ id +'"]');
			const el_marks = el_range.querySelector('#' + id + '_tickmarks_from');
			const el_marks_to = el_range.querySelector('#' + id + '_tickmarks_to');
			const txtArray = Global.rangeSlider[id].text;
			const txtALen = txtArray.length;
			let percent;
			let min = Number(el_from.min);
			let max = Number(el_from.max);

			if (v !== undefined) {
				el_from.value = v;
			}

			let from_value = +el_from.value;

			if (type !== 'single') {
				if (+el_to.value - from_value < 0) {
					from_value = +el_to.value - 0;
					el_from.value = from_value;
				}

				percent = ((from_value - +min) / (+max - +min)) * 100;

				el_right.classList.remove('on');
				el_to.classList.remove('on');
				el_left.style.left = percent + '%';
				el_bar.style.left = percent + '%';
			} else {
				if (from_value < 0) {
					from_value = 0;
				}
				percent = ((from_value - +min) / (+max - +min)) * 100;
				el_left.style.left = percent + '%';
				el_bar.style.right = (100 - percent) + '%';
			}

			el_left.classList.add('on');
			el_from.classList.add('on');
			
			for (let i = 0, len = inp_froms.length; i < len; i++) {
				const that = inp_froms[i];

				if (that.tagName === 'INPUT') {
					that.value = from_value;
				} else {
					
					if (!!txtArray) {
						const u = Number(max - min) / (txtALen - 1);
						
						for (let j = 0; j < txtALen; j++) {
							that.textContent = txtArray[j];

							const v_min = u * j <= 0 ? min : u * j + min;
							if (from_value <= v_min) {
								break;
							}
						}
					} else {
						that.textContent = from_value;
					}
				}
			}

			// el_range.dataset.from = from_value;
			el_range.setAttribute('data-from', from_value);	
			if (!!el_to) {
				if (el_to.value === el_from.value) {
					el_range.classList.add('same');
				} else {
					el_range.classList.remove('same')
				}
			}

			if (el_marks) {
				const el_marks_items = el_marks.querySelectorAll('.ui-range-btn');

				for (let item of el_marks_items) {
					const _v = Number(item.dataset.value);

					if (!item.dataset.to || item.dataset.to === 'false') {
						item.querySelector('.state').textContent = '';
					}
					item.dataset.from = false;
					item.disabled = false;
					item.removeAttribute('tabindex');
					item.removeAttribute('role');

					if (from_value == _v) {
						item.dataset.from = true;
						item.querySelector('.state').textContent = '선택됨';
					} else if (!!el_to && el_to.value < _v) {
						item.disabled = true;
						item.setAttribute('tabindex', -1);
						item.setAttribute('role', 'none');
					}
				}
				if (!!el_to) {
					const el_marks_items = el_marks_to.querySelectorAll('.ui-range-btn');

					for (let item of el_marks_items) {
						const _v = Number(item.dataset.value);

						if (!item.dataset.from || item.dataset.from === 'false') {
							item.querySelector('.state').textContent = '';
						} 

						item.disabled = false;
						item.dataset.to = false;
						item.removeAttribute('tabindex');
						item.removeAttribute('role');
						if (Number(el_to.value) == _v) {
							item.dataset.to = true;
							item.querySelector('.state').textContent = '선택됨';
						} else if (el_from.value > _v) {
							item.disabled = true;
							item.setAttribute('tabindex', -1);
							item.setAttribute('role', 'none');
						}
					}
				}
			}
			!!el_to ?
				el_from.setAttribute('aria-label', Global.rangeSlider[id].title + ' 최소 ' + txtArray[el_from.value]):
				el_from.setAttribute('aria-label', Global.rangeSlider[id].title + ' ' + txtArray[el_from.value]);
		},
		rangeTo(opt){
			const id = opt.id;
			const v = opt.value;
			const el_range = document.querySelector('.ui-range[data-id="'+ id +'"]');
			const el_from = el_range.querySelector('.ui-range-inp[data-range="from"]');
			const el_to = el_range.querySelector('.ui-range-inp[data-range="to"]');
			const el_left = el_range.querySelector(".ui-range-point.left");
			const el_right = el_range.querySelector(".ui-range-point.right");
			const el_bar = el_range.querySelector(".ui-range-bar");
			const inp_tos = document.querySelectorAll('[data-to="'+ id +'"]');
			const el_marks = el_range.querySelector('#' + id + '_tickmarks_to');
			const el_marks_from = el_range.querySelector('#' + id + '_tickmarks_from');
			let value = el_to.value;
			let min = Number(el_from.min);
			let max = Number(el_from.max);
			
			const txtArray = Global.rangeSlider[id].text;
			const txtALen = txtArray.length;

			if (v !== undefined) {
				el_to.value = v;
			}

			let to_value = +el_to.value;

			if (+value - +el_from.value < 0) {
				to_value = +el_from.value + 0;
				el_to.value = to_value;
			}
			
			let percent = ((to_value - +min) / (+max - +min)) * 100;

			el_right.classList.add('on');
			el_left.classList.remove('on');
			el_to.classList.add('on');
			el_from.classList.remove('on');
			el_right.style.right = (100 - percent) + '%';
			el_bar.style.right = (100 - percent) + '%';

			for (let i = 0, len = inp_tos.length; i < len; i++) {
				const that = inp_tos[i];

				if (that.tagName === 'INPUT') {
					that.value = el_to.value;
				} else {
					if (!!txtArray) {
						const u = Number(max - min) / (txtALen - 1);
						
						for (let j = 0; j < txtALen; j++) {
							that.textContent = txtArray[j];

							const v_min = u * j <= 0 ? min : u * j + min;
							if (el_to.value <= v_min) {
								break;
							}
						}
					} else {
						that.textContent = el_to.value;
					}
				}
			}

			// el_range.dataset.to = el_to.value;
			el_range.setAttribute('data-to', el_to.value);

			if (!!el_from) {
				if (el_to.value === el_from.value) {
					el_range.classList.add('same');
				} else {
					el_range.classList.remove('same')
				}
			}
			if (el_marks) {
				const el_marks_items = el_marks.querySelectorAll('.ui-range-btn');

				for (let item of el_marks_items) {
					const _v = Number(item.dataset.value);

					if (!item.dataset.from || item.dataset.from === 'false') {
						item.querySelector('.state').textContent = '';
					} 

					item.disabled = false;
					item.dataset.to = false;
					item.removeAttribute('tabindex');
					item.removeAttribute('role');

					if (Number(el_to.value) == _v) {
						item.dataset.to = true;
						item.querySelector('.state').textContent = '선택됨';
					} else if (el_from.value > _v) {
						item.disabled = true;
						item.setAttribute('tabindex', -1);
						item.setAttribute('role', 'none');
					}
				}
				if (!!el_from) {
					const el_marks_items = el_marks_from.querySelectorAll('.ui-range-btn');

					for (let item of el_marks_items) {
						const _v = Number(item.dataset.value);

						if (!item.dataset.to || item.dataset.to === 'false') {
							item.querySelector('.state').textContent = '';
						}
						
						item.dataset.from = false;
						item.disabled = false;
						item.removeAttribute('tabindex');
						item.removeAttribute('role');
						
						if (el_from.value == _v) {
							item.dataset.from = true;
							item.querySelector('.state').textContent = '선택됨';
						} else if (!!el_to && el_to.value < _v) {
							item.disabled = true;
							item.setAttribute('tabindex', -1);
							item.setAttribute('role', 'none');
						}
					}
				}
			}
			el_to.setAttribute('aria-label', Global.rangeSlider[id].title + ' 최대 ' + txtArray[el_to.value]);
		}
	}






	/**
	 * DATE PICKER
	 * in use: Global.state, Global.sheets, Global.parts
	 */
	Global.datepicker = {
		isFooter: false,
		specialday:{
			"1":[
				{"solar":true, "day":1, "holiday":true, "name":"신정", "sub":false},
				{"solar":false, "day":1, "holiday":true, "name":"설날", "sub":true},
				{"solar":false, "day":2, "holiday":true, "name":"설날 다음날", "sub":true}
			],
			"2":[],
			"3":[
				{"solar":true, "day":1, "holiday":true, "name":"삼일절", "sub":true}
			],
			"4":[
				{"solar":false, "day":8, "holiday":true, "name":"석가탄신일", "sub":false}
			],
			"5":[
				{"solar":true, "day":5, "holiday":true, "name":"어린이날", "sub":true}
			],
			"6":[
				{"solar":true, "day":6, "holiday":true, "name":"현충일", "sub":false}
			],
			"7":[],
			"8":[
				{"solar":true, "day":15, "holiday":true, "name":"광복절", "sub":true},
				{"solar":false, "day":14, "holiday":true, "name":"추석 전날", "sub":true},
				{"solar":false, "day":15, "holiday":true, "name":"추석", "sub":true},
				{"solar":false, "day":16, "holiday":true, "name":"추석 다음날", "sub":true}
			],
			"9":[],
			"10":[
				{"solar":true, "day":3, "holiday":true, "name":"개천절", "sub":true},
				{"solar":true, "day":9, "holiday":true, "name":"한글날", "sub":true}
			],
			"11":[
				{}
			],
			"12":[
				{"solar":true, "day":25, "holiday":true, "name":"성탄절", "sub":false},
				{"solar":false, "day":'last', "holiday":true, "name":"설날 전날", "sub":true}
			],
		},
		week : ['일', '월', '화', '수', '목', '금', '토', '년', '월' , '일'],
		baseTxt: ['년','월','일'],
		init(v){
			const btns = document.querySelectorAll('.ui-datepicker-btn');
			const datepickers = document.querySelectorAll('.ui-datepicker');
			Global.datepicker.week = v === undefined || v.week === undefined ? Global.datepicker.week : v.week;
			Global.datepicker.isFooter = v === undefined || v.isFooter === undefined ? Global.datepicker.isFooter : v.isFooter;

			const act = (e) => {
				Global.datepicker.open(e.currentTarget.dataset.target);
			}

			for (let i = 0; i < datepickers.length; i++) {
				const dp = datepickers[i];
				const inps = dp.querySelectorAll('input[type="date"]');
				const btns = dp.querySelector('.ui-datepicker-btn');
				
				!!btns && btns.remove();

				if (!!inps.length) {
					const id = inps[0].id;
					let v0 = inps[0].value.split('-');

					(!inps[0].value) ? v0 = Global.datepicker.baseTxt : '';

					!Global.callback[id] ? Global.callback[id] = () => {} : '';

					let html = '<button type="button" class="ui-datepicker-btn" data-target="'+ id +'" aria-label="달력 보기" tabindex="-1"></button>';
					// html += '<span class="datepicker-date">';
					// html += '<span class="datepicker-date-yyyy">'+ v0[0] +'</span>';
					// html += '<span class="datepicker-date-mm">'+ v0[1] +'</span>';
					// html += '<span class="datepicker-date-dd">'+ v0[2] +'</span>';
					// html += '<span class="a11y-hidden">선택</span>'; 
					// html += '</span>'; 
					dp.insertAdjacentHTML('beforeend', html);
					if (inps.length > 1) {	
						let v1 = inps[1].value.split('-');
						(!inps[1].value) ? v1 = Global.datepicker.baseTxt : '';
						// html += '<span class="form-text">~</span>';
						// html += '<span class="datepicker-date">';
						// html += '<span class="datepicker-date-yyyy">'+ v1[0] +'</span>';
						// html += '<span class="datepicker-date-mm">'+ v1[1] +'</span>';
						// html += '<span class="datepicker-date-dd">'+ v1[2] +'</span>';
						// html += '<span class="a11y-hidden">선택</span>'; 
						// html += '</span>'; 

						// inps[1].setAttribute('tabindex', -1);
						// inps[1].setAttribute('aria-hidden', true);
						inps[1].removeAttribute('readonly');
					}
					inps[0].removeAttribute('readonly');
					// inps[0].setAttribute('tabindex', -1);
					html = '';

					const btn = dp.querySelector('.ui-datepicker-btn');

					btn.addEventListener('click', act);
				}
			}

			//view
			const views = document.querySelectorAll('.ui-datepicker-view');

			for (let i = 0; i < views.length; i++) {
				// Global.datepicker.isFooter = true;
				const inp = document.querySelector('#' + views[i].dataset.target);
				
				Global.datepicker.make({
					id: views[i].dataset.target,
					area: views[i],
					date: inp.value,
					min: inp.min,
					max: inp.max,
					title: inp.title,
					week: this.week,
					period: inp.dataset.period,
					visible: true,
					callback: () => {}
				});
			}
		},
		destroy(opt){
			const is_dim = !!document.querySelector('.sheet-dim');
			const callback = opt === undefined || opt.callback === undefined ? false : opt.callback;
			let el_dp;

			if (is_dim) {
				Global.sheets.dim(false);
			}
			
			if (!opt) {
				el_dp = document.querySelectorAll('.datepicker');

				for (let i = 0, len = el_dp.length; i < len; i++) {
					const that = el_dp[i];

					if (that.dataset.visible !== 'true') {
						that.remove();
					}
				}
			} else {
				el_dp = document.querySelector('.datepicker[data-id="'+ opt.id +'"]');
				el_dp.remove();
			}

			!!callback && callback();
		},
		open(id) {
			const base = document.querySelector('#' + id);

			Global.sheets.bottom({
				id: base.id,
				callback: () => {
					Global.datepicker.make({
						id: base.id,
						date: base.value,
						min: base.min,
						max: base.max,
						title: base.title,
						period: base.dataset.period,
						callback: () => {}
					});
				}
			});
		},
		make(opt) {
			const setId = opt.id;
			const currentDate = opt.date;
			let wdate = opt.date;
			const title = opt.title;
			const el_inp = document.querySelector('#' + setId);
			const el_uidp = el_inp.closest('.ui-datepicker');
			const el_start = el_uidp.querySelector('[data-period="start"]');
			const el_end = el_uidp.querySelector('[data-period="end"]');
			const setDate = (opt.date === '' || opt.date === undefined) ? new Date(): opt.date;
			let period = (opt.period === '' || opt.period === undefined) ? false : opt.period;
			const area = (opt.area === '' || opt.area === undefined) ? document.querySelector('body') : opt.area;
			const date = new Date(setDate);
			const _viewYear = date.getFullYear();
			const _viewMonth = date.getMonth();
			let el_dp = document.querySelector('.datepicker[data-id="'+setId+'"]');
			const yyyymm = _viewYear + '-' + Global.parts.add0(_viewMonth + 1);
			const callback = opt === undefined || opt.callback === undefined ? false : opt.callback;
			let _dpHtml = '';
			const isFooter = Global.datepicker.isFooter;
			
			Global.datepicker.destroy();

			if (!!period || !!el_end) {
				period = true;
				wdate = el_end.value;
			}

			if (!el_dp) {
				if (period) {
					_dpHtml += '<section class="datepicker" data-id="'+setId+'" data-date="'+yyyymm+'" data-start="'+currentDate+'" data-end="'+wdate+'" data-period="start" data-visible="'+ opt.visible +'" aria-labelledby="'+setId+'_label" aria-describedby="'+setId+'_desc" aria-dialog="true">';
				} else {
					_dpHtml += '<section class="datepicker" data-id="'+setId+'" data-date="'+yyyymm+'" data-start="'+currentDate+'" data-visible="'+ opt.visible +'" aria-labelledby="'+setId+'_label" aria-dialog="true">';
				}
				
				_dpHtml += '<div class="datepicker-wrap">';
				_dpHtml += '<div class="datepicker-header">';
				_dpHtml += '<h3 class="datepicker-title" id="'+setId+'_label">'+title+'</h3>';
				_dpHtml += '<button type="button" class="ui-prev-y" data-dpid="'+setId+'"><span class="a11y-hidden">이전 년도</span></button>';
				_dpHtml += '<div class="datepicker-yy"></div>';
				_dpHtml += '<button type="button" class="ui-next-y" data-dpid="'+setId+'"><span class="a11y-hidden">다음 년도</span></button>';
				_dpHtml += '<button type="button" class="ui-prev-m" data-dpid="'+setId+'"><span class="a11y-hidden">이전 월</span></button>';
				_dpHtml += '<div class="datepicker-mm"></div>';
				_dpHtml += '<button type="button" class="ui-next-m" data-dpid="'+setId+'"><span class="a11y-hidden">다음 월</span></button>';
				_dpHtml += '<button type="button" class="ui-today" data-dpid="'+setId+'"><span class="a11y-hidden">오늘</span></button>';
				_dpHtml += '</div>';

				_dpHtml += '<div class="datepicker-body" id="'+setId+'_desc">';
				_dpHtml += '<table>';
				_dpHtml += '<caption>'+title+'</caption>';
				_dpHtml += '<colgroup>';
				_dpHtml += '<col span="7">';
				_dpHtml += '</colgroup>';
				_dpHtml += '<thead>';
				_dpHtml += '<tr>';
				_dpHtml += '<th scope="col">'+ this.week[0] +'</th>';
				_dpHtml += '<th scope="col">'+ this.week[1] +'</th>';
				_dpHtml += '<th scope="col">'+ this.week[2] +'</th>';
				_dpHtml += '<th scope="col">'+ this.week[3] +'</th>';
				_dpHtml += '<th scope="col">'+ this.week[4] +'</th>';
				_dpHtml += '<th scope="col">'+ this.week[5] +'</th>';
				_dpHtml += '<th scope="col">'+ this.week[6] +'</th>';
				_dpHtml += '</tr>';
				_dpHtml += '</thead>';
				_dpHtml += '<tbody class="datepicker-date"></tbody>';
				_dpHtml += '</table>';
				_dpHtml += '</div>';
				_dpHtml += '<div class="datepicker-footer '+ (!isFooter ? 'a11y-hidden' : '') +' ">';
				_dpHtml += '<div class="wrap-group">';
				_dpHtml += '<button type="button" class="btn-mix-outlined ui-confirm" data-confirm="'+ setId +'"><span>확인</span></button>';
				_dpHtml += '</div>';
				_dpHtml += '</div>';
				_dpHtml += '</div>';
				_dpHtml += '</section>';

				area.insertAdjacentHTML('beforeend',_dpHtml);
				//document.querySelector('#' + setId).parentNode.insertAdjacentHTML('beforeend',_dpHtml);
				el_dp = document.querySelector('.datepicker[data-id="'+setId+'"]');

				this.dateMake({
					setDate: date,
					currentDate: currentDate, 
					setId: setId,
					period: period,
				});
				
				_dpHtml = null;

				!!callback && callback();
				
				//event
				const nextY = el_dp.querySelector('.ui-next-y');
				const prevY = el_dp.querySelector('.ui-prev-y');
				const nextM = el_dp.querySelector('.ui-next-m');
				const prevM = el_dp.querySelector('.ui-prev-m');
				const today = el_dp.querySelector('.ui-today');
				
				nextY.addEventListener('click', Global.datepicker.nextYear);
				prevY.addEventListener('click', Global.datepicker.prevYear);
				nextM.addEventListener('click', Global.datepicker.nextMonth);
				prevM.addEventListener('click', Global.datepicker.prevMonth);
				today.addEventListener('click', Global.datepicker.goToday);
				
				if (isFooter || period) {
					const confirm = el_dp.querySelector('.ui-confirm');
					confirm.addEventListener('click', (e) => {
						Global.datepicker.confirm({
							id: e.currentTarget.dataset.confirm
						});
					});
				} 
			}
		},
		confirm(opt){
			const id = opt.id;
			const el_dp =  document.querySelector('.datepicker[data-id="'+ id +'"]');
			const startDay = el_dp.dataset.start;
			const endDay = el_dp.dataset.end;
			const el_inp = document.getElementById(id);
			const el_uidp = el_inp.closest('.ui-datepicker');	
			const el_start = el_uidp.querySelector('[data-period="start"]');
			const el_end = el_uidp.querySelector('[data-period="end"]');
			const el_btn =  document.querySelector('.ui-datepicker-btn[data-target="'+ id +'"]');
			const isView = el_inp.dataset.view === 'true' ? true : false;
			const isBtn = !!el_btn;

			const s_yy = el_btn.querySelectorAll('.datepicker-date-yyyy');
			const s_mm = el_btn.querySelectorAll('.datepicker-date-mm');
			const s_dd = el_btn.querySelectorAll('.datepicker-date-dd');

			const callback = opt === undefined || opt.callback === undefined ? false : opt.callback;
			let value_callback = [];

			el_inp.value = startDay;
			value_callback.push(startDay);

			const _startDay = startDay.split('-');
			
			// s_yy[0].textContent = !!startDay ? _startDay[0] : Global.datepicker.baseTxt[0];
			// s_mm[0].textContent = !!startDay ? _startDay[1] : Global.datepicker.baseTxt[1];
			// s_dd[0].textContent = !!startDay ? _startDay[2] : Global.datepicker.baseTxt[2];
			

			!!callback && callback();

			if (!!el_end) {
				el_end.value = endDay;
				value_callback.push(endDay);
				const _endDay = endDay.split('-');
				
				// s_yy[1].textContent = !!endDay ? _endDay[0] : Global.datepicker.baseTxt[0];
				// s_mm[1].textContent = !!endDay ? _endDay[1] : Global.datepicker.baseTxt[1];
				// s_dd[1].textContent = !!endDay ? _endDay[2] : Global.datepicker.baseTxt[2];
			}

			!!Global.callback[id] && Global.callback[id](value_callback);

			if (!isView) {
				el_btn.focus();
				if (el_dp.classList.contains('sheet-bottom')) {
					Global.sheets.bottom({
						id: id,
						state: false,
						focus: el_btn,
						callback: () => {
							Global.datepicker.destroy({
								id : id
							});
						}
					});
				} else {
					Global.datepicker.destroy({
						id : id
					});
				}
			}
		},
		solarToLunar(solYear, solMonth, solDay){
			const LUNAR_LAST_YEAR = 1939;
			var lunarMonthTable = [
				[2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 2],   /* 양력 1940년 1월은 음력 1939년에 있음 그래서 시작년도는 1939년*/
				[2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1],
				[2, 2, 1, 2, 2, 4, 1, 1, 2, 1, 2, 1],   /* 1941 */
				[2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 1, 2],
				[1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2],
				[1, 1, 2, 4, 1, 2, 1, 2, 2, 1, 2, 2],
				[1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 2],
				[2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2],
				[2, 5, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2],
				[2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2],
				[2, 2, 1, 2, 1, 2, 3, 2, 1, 2, 1, 2],
				[2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1],
				[2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2],   /* 1951 */
				[1, 2, 1, 2, 4, 2, 1, 2, 1, 2, 1, 2],
				[1, 2, 1, 1, 2, 2, 1, 2, 2, 1, 2, 2],
				[1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2],
				[2, 1, 4, 1, 1, 2, 1, 2, 1, 2, 2, 2],
				[1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2],
				[2, 1, 2, 1, 2, 1, 1, 5, 2, 1, 2, 2],
				[1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2],
				[1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
				[2, 1, 2, 1, 2, 5, 2, 1, 2, 1, 2, 1],
				[2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2],   /* 1961 */
				[1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1],
				[2, 1, 2, 3, 2, 1, 2, 1, 2, 2, 2, 1],
				[2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2],
				[1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 2],
				[1, 2, 5, 2, 1, 1, 2, 1, 1, 2, 2, 1],
				[2, 2, 1, 2, 2, 1, 1, 2, 1, 2, 1, 2],
				[1, 2, 2, 1, 2, 1, 5, 2, 1, 2, 1, 2],
				[1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1],
				[2, 1, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2],
				[1, 2, 1, 1, 5, 2, 1, 2, 2, 2, 1, 2],   /* 1971 */
				[1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1],
				[2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 2, 1],
				[2, 2, 1, 5, 1, 2, 1, 1, 2, 2, 1, 2],
				[2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2],
				[2, 2, 1, 2, 1, 2, 1, 5, 2, 1, 1, 2],
				[2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 1],
				[2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1],
				[2, 1, 1, 2, 1, 6, 1, 2, 2, 1, 2, 1],
				[2, 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2],
				[1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 2],   /* 1981 */
				[2, 1, 2, 3, 2, 1, 1, 2, 2, 1, 2, 2],
				[2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2],
				[2, 1, 2, 2, 1, 1, 2, 1, 1, 5, 2, 2],
				[1, 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2],
				[1, 2, 2, 1, 2, 2, 1, 2, 1, 2, 1, 1],
				[2, 1, 2, 2, 1, 5, 2, 2, 1, 2, 1, 2],
				[1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1],
				[2, 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2],
				[1, 2, 1, 1, 5, 1, 2, 1, 2, 2, 2, 2],
				[1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 2],   /* 1991 */
				[1, 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2],
				[1, 2, 5, 2, 1, 2, 1, 1, 2, 1, 2, 1],
				[2, 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2],
				[1, 2, 2, 1, 2, 2, 1, 5, 2, 1, 1, 2],
				[1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2],
				[1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1],
				[2, 1, 1, 2, 3, 2, 2, 1, 2, 2, 2, 1],
				[2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 1],
				[2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1],
				[2, 2, 2, 3, 2, 1, 1, 2, 1, 2, 1, 2],   /* 2001 */
				[2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1],
				[2, 2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2],
				[1, 5, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2],
				[1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 1],
				[2, 1, 2, 1, 2, 1, 5, 2, 2, 1, 2, 2],
				[1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 2],
				[2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2],
				[2, 2, 1, 1, 5, 1, 2, 1, 2, 1, 2, 2],
				[2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2],
				[2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1],   /* 2011 */
				[2, 1, 6, 2, 1, 2, 1, 1, 2, 1, 2, 1],
				[2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2],
				[1, 2, 1, 2, 1, 2, 1, 2, 5, 2, 1, 2],
				[1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 2, 1],
				[2, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2],
				[2, 1, 1, 2, 3, 2, 1, 2, 1, 2, 2, 2],
				[1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2],
				[2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2],
				[2, 1, 2, 5, 2, 1, 1, 2, 1, 2, 1, 2],
				[1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],   /* 2021 */
				[2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2],
				[1, 5, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2],
				[1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1],
				[2, 1, 2, 1, 1, 5, 2, 1, 2, 2, 2, 1],
				[2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2],
				[1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 2],
				[1, 2, 2, 1, 5, 1, 2, 1, 1, 2, 2, 1],
				[2, 2, 1, 2, 2, 1, 1, 2, 1, 1, 2, 2],
				[1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1],
				[2, 1, 5, 2, 1, 2, 2, 1, 2, 1, 2, 1],   /* 2031 */
				[2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2],
				[1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 5, 2],
				[1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1],
				[2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2],
				[2, 2, 1, 2, 1, 4, 1, 1, 2, 2, 1, 2],
				[2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2],
				[2, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1],
				[2, 2, 1, 2, 5, 2, 1, 2, 1, 2, 1, 1],
				[2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 2, 1],
				[2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2],   /* 2041 */
				[1, 5, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2],
				[1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 2]];

			// 음력 계산을 위한 객체
			function myDate(year, month, day, leapMonth) {
				this.year = year;
				this.month = month;
				this.day = day;
				this.leapMonth = leapMonth;
			}

			// 양력을 음력으로 계산
			function lunarCalc(year, month, day, type, leapmonth) {
				var solYear, solMonth, solDay;
				var lunYear, lunMonth, lunDay;

				// lunLeapMonth는 음력의 윤달인지 아닌지를 확인하기위한 변수
				// 1일 경우 윤달이고 0일 경우 음달
				var lunLeapMonth, lunMonthDay;
				var i, lunIndex;

				var solMonthDay = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

				/* range check */
				if (year < 1940 || year > 2040) {
					alert('1940년부터 2040년까지만 지원합니다');
					return;
				}

				/* 속도 개선을 위해 기준 일자를 여러개로 한다 */
				if (year >= 2000) {
					/* 기준일자 양력 2000년 1월 1일 (음력 1999년 11월 25일) */
					solYear = 2000;
					solMonth = 1;
					solDay = 1;
					lunYear = 1999;
					lunMonth = 11;
					lunDay = 25;
					lunLeapMonth = 0;

					solMonthDay[1] = 29;    /* 2000 년 2월 28일 */
					lunMonthDay = 30;   /* 1999년 11월 */
				}
				else if (year >= 1970) {
					/* 기준일자 양력 1970년 1월 1일 (음력 1969년 11월 24일) */
					solYear = 1970;
					solMonth = 1;
					solDay = 1;
					lunYear = 1969;
					lunMonth = 11;
					lunDay = 24;
					lunLeapMonth = 0;

					solMonthDay[1] = 28;    /* 1970 년 2월 28일 */
					lunMonthDay = 30;   /* 1969년 11월 */
				}
				else {
					/* 기준일자 양력 1940년 1월 1일 (음력 1939년 11월 22일) */
					solYear = 1940;
					solMonth = 1;
					solDay = 1;
					lunYear = 1939;
					lunMonth = 11;
					lunDay = 22;
					lunLeapMonth = 0;

					solMonthDay[1] = 29;    /* 1940 년 2월 28일 */
					lunMonthDay = 29;   /* 1939년 11월 */
				}

				lunIndex = lunYear - LUNAR_LAST_YEAR;

				// type이 1일때는 입력받은 양력 값에 대한 음력값을 반환
				// 2일 때는 입력받은 음력 값에 대한 양력값을 반환
				// 반복문이 돌면서 양력 값들과 음력 값들을 1일 씩 증가시키고
				// 입력받은 날짜값과 양력 값이 일치할 때 음력값을 반환함
				while (true) {
					if (type == 1 &&
						year == solYear &&
						month == solMonth &&
						day == solDay) {
						return new myDate(lunYear, lunMonth, lunDay, lunLeapMonth);
					}
					else if (type == 2 &&
						year == lunYear &&
						month == lunMonth &&
						day == lunDay &&
						leapmonth == lunLeapMonth) {
						return new myDate(solYear, solMonth, solDay, 0);
					}

					// 양력의 마지막 날일 경우 년도를 증가시키고 나머지 초기화
					if (solMonth == 12 && solDay == 31) {
						solYear++;
						solMonth = 1;
						solDay = 1;

						// 윤년일 시 2월달의 총 일수를 1일 증가
						if (solYear % 400 == 0)
							solMonthDay[1] = 29;
						else if (solYear % 100 == 0)
							solMonthDay[1] = 28;
						else if (solYear % 4 == 0)
							solMonthDay[1] = 29;
						else
							solMonthDay[1] = 28;

					}
					// 현재 날짜가 달의 마지막 날짜를 가리키고 있을 시 달을 증가시키고 날짜 1로 초기화
					else if (solMonthDay[solMonth - 1] == solDay) {
						solMonth++;
						solDay = 1;
					}
					else
						solDay++;

					// 음력의 마지막 날인 경우 년도를 증가시키고 달과 일수를 초기화
					if (lunMonth == 12 &&
						((lunarMonthTable[lunIndex][lunMonth - 1] == 1 && lunDay == 29) ||
							(lunarMonthTable[lunIndex][lunMonth - 1] == 2 && lunDay == 30))) {
						lunYear++;
						lunMonth = 1;
						lunDay = 1;

						if (lunYear > 2043) {
							alert("입력하신 달은 없습니다.");
							break;
						}

						// 년도가 바꼈으니 index값 수정
						lunIndex = lunYear - LUNAR_LAST_YEAR;

						// 음력의 1월에는 1 or 2만 있으므로 1과 2만 비교하면됨
						if (lunarMonthTable[lunIndex][lunMonth - 1] == 1)
							lunMonthDay = 29;
						else if (lunarMonthTable[lunIndex][lunMonth - 1] == 2)
							lunMonthDay = 30;
					}
					// 현재날짜가 이번달의 마지막날짜와 일치할 경우
					else if (lunDay == lunMonthDay) {

						// 윤달인데 윤달계산을 안했을 경우 달의 숫자는 증가시키면 안됨
						if (lunarMonthTable[lunIndex][lunMonth - 1] >= 3
							&& lunLeapMonth == 0) {
							lunDay = 1;
							lunLeapMonth = 1;
						}
						// 음달이거나 윤달을 계산 했을 겨우 달을 증가시키고 lunLeapMonth값 초기화
						else {
							lunMonth++;
							lunDay = 1;
							lunLeapMonth = 0;
						}

						// 음력의 달에 맞는 마지막날짜 초기화
						if (lunarMonthTable[lunIndex][lunMonth - 1] == 1)
							lunMonthDay = 29;
						else if (lunarMonthTable[lunIndex][lunMonth - 1] == 2)
							lunMonthDay = 30;
						else if (lunarMonthTable[lunIndex][lunMonth - 1] == 3)
							lunMonthDay = 29;
						else if (lunarMonthTable[lunIndex][lunMonth - 1] == 4 &&
							lunLeapMonth == 0)
							lunMonthDay = 29;
						else if (lunarMonthTable[lunIndex][lunMonth - 1] == 4 &&
							lunLeapMonth == 1)
							lunMonthDay = 30;
						else if (lunarMonthTable[lunIndex][lunMonth - 1] == 5 &&
							lunLeapMonth == 0)
							lunMonthDay = 30;
						else if (lunarMonthTable[lunIndex][lunMonth - 1] == 5 &&
							lunLeapMonth == 1)
							lunMonthDay = 29;
						else if (lunarMonthTable[lunIndex][lunMonth - 1] == 6)
							lunMonthDay = 30;
					}
					else
						lunDay++;
				}
			}
			// 날짜 형식이 안맞을 경우 공백 반환
            if (!solYear || solYear == 0 ||
                !solMonth || solMonth == 0 ||
                !solDay || solDay == 0) {
                return "";
            }

            // 양력의 달마다의 일수
            var solMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            // 윤년일 시 2월에 1일 추가
            if (solYear % 400 == 0 || (solYear % 4 == 0 && solYear % 100 != 0)) solMonthDays[1] += 1;


            if (solMonth < 1 || solMonth > 12 ||
                solDay < 1 || solDay > solMonthDays[solMonth - 1]) {

                return "";
            }

            /* 양력/음력 변환 */
            var date = lunarCalc(solYear, solMonth, solDay, 1);
			//(date.leapMonth ? "(윤)" : "") + 
            return date.month + "-" + date.day;
		},
		dateMake(opt){
			const setDate = opt.setDate;
			const setId = opt.setId;
			const el_dp = document.querySelector('.datepicker[data-id="' + setId + '"]');
			const el_inp = document.querySelector('#' + setId);
			const el_uidp = el_inp.closest('.ui-datepicker');	
			const el_start = el_uidp.querySelector('[data-period="start"]');
			const el_end = el_uidp.querySelector('[data-period="end"]');
			const isHoliyday = el_inp.dataset.holiday === 'true' ? true : false;

			if (!!el_dp.dataset.period) {
				if (el_dp.dataset.end !== '' && (el_dp.dataset.end !== el_dp.dataset.start)) {
					el_dp.dataset.period = 'end';
				}
			}

			let period = el_dp.dataset.period;
			let min = el_inp.getAttribute('min');
			let max = el_inp.getAttribute('max');

			if (period === 'end') {
				min = el_end.getAttribute('min');
				max = el_end.getAttribute('max');
			}

			let date = setDate;
			let today = new Date();
			let min_day = new Date(min);
			let max_day = new Date(max);
			let startDay = el_dp.dataset.start;
			let startDate = null;
			let endDay = null;
			let wdate = null;

			if (period === 'end') {
				endDay = el_dp.dataset.end;
			}

			//설정된 날
			let viewYear = date.getFullYear();
			let viewMonth = date.getMonth();
			let viewDay = date.getDate();
			//오늘
			const _viewYear = today.getFullYear();
			const _viewMonth = today.getMonth();
			const _viewDay = today.getDate();
			//선택한 날
			let start_viewYear = null;
			let start_viewMonth = null;
			let start_viewDay = null;
			//선택한 날
			let end_viewYear = null;
			let end_viewMonth = null;
			let end_viewDay = null;
			//최소
			const min_viewYear = min_day.getFullYear();
			const min_viewMonth = min_day.getMonth();
			const min_viewDay = min_day.getDate();
			//최대
			const max_viewYear = max_day.getFullYear();
			const max_viewMonth = max_day.getMonth();
			const max_viewDay = max_day.getDate();
			const week = this.week;
			//설정일자가 있는 경우
			if (!!setDate) {
				date = new Date(setDate);

				viewYear = date.getFullYear();
				viewMonth = date.getMonth();
				viewDay = date.getDate();	
			}

			//선택일자가 있는 경우
			if (startDay !== '') {
				startDate = new Date(startDay);
				start_viewYear = startDate.getFullYear();
				start_viewMonth = startDate.getMonth();
				start_viewDay = startDate.getDate();
			}
			if (endDay !== '') {
				wdate = new Date(endDay);
				end_viewYear = wdate.getFullYear();
				end_viewMonth = wdate.getMonth();
				end_viewDay = wdate.getDate();
			}

			//지난달 마지막 date, 이번달 마지막 date
			const prevLast = new Date(viewYear, viewMonth, 0);
			const thisLast = new Date(viewYear, viewMonth + 1, 0);
			const PLDate = prevLast.getDate();
			const PLDay = prevLast.getDay();
			const TLDate = thisLast.getDate();
			const TLDay = thisLast.getDay();
			let prevDates = [];
			let nextDates = [];
			let thisDates = [];
			//let thisDates = [...Array(TLDate + 1).keys()].slice(1);
			for (let i = 0, len = TLDate; i < len; i++) {
				thisDates.push(i + 1);
			}

			//prevDates 계산
			if (PLDay !== 6) {
				for(let i = 0; i < PLDay + 1; i++) {
					prevDates.unshift('');
				}
			}

			//nextDates 계산
			for(let i = 1; i < 7 - TLDay; i++) {
				nextDates.unshift('');
			}

			//dates 합치기
			const dates = prevDates.concat(thisDates, nextDates);
			let _dpHtml = '';
			Global.callback[setId].subDay = false;

			//dates 정리
			dates.forEach((date, i) => {
				let _class = '';
				let _disabled = false;
				let isHoliday = i % 7 === 0 || i % 7 === 6 ? true : false;
				let isHolidaySunday = i % 7 === 0 ? true : false;
				// _class = (i % 7 === 0) ? 'hday' : '';
				// _class = (i % 7 === 0) ? 'hday' : _class;

				//오늘날짜 설정
				_class = (date === _viewDay && viewYear === _viewYear && viewMonth === _viewMonth) ? _class + 'today' : _class;

				//max date
				if (viewYear === max_viewYear) {
					if (viewMonth === max_viewMonth) {
						if (date > max_viewDay) {
							_disabled = true;
						}
					} else if (viewMonth > max_viewMonth) {
						_disabled = true;
					}
					
				} else if (viewYear > max_viewYear ) {
					_disabled = true;
				}

				//min date
				if (viewYear === min_viewYear) {
					if (viewMonth === min_viewMonth) {
						if (date < min_viewDay) {
							_disabled = true;
						}
					} else if (viewMonth < min_viewMonth) {
						_disabled = true;
					}
					
				} else if (viewYear < min_viewYear ) {
					_disabled = true;
				}

				//selected date
				const _day = (date === start_viewDay && viewYear === start_viewYear && viewMonth === start_viewMonth) ? 
					_class + ' selected-start' : 
					(date === end_viewDay && viewYear === end_viewYear && viewMonth === end_viewMonth) ? _class + ' selected-end' : _class;

				if (!!endDay) {
					_class = _class + ' during';

					if (viewYear < start_viewYear || viewYear > end_viewYear) {
						_class = _class.replace(' during', '');
					}

					if (viewYear === start_viewYear && viewMonth < start_viewMonth) {
						_class = _class.replace(' during', '');
					}

					if (viewYear === start_viewYear && viewMonth === start_viewMonth && date <=  start_viewDay) {
						_class = _class.replace(' during', '');
					}

					if (viewYear === end_viewYear && viewMonth > end_viewMonth) {
						_class = _class.replace(' during', '');
					}

					if (viewYear === end_viewYear && viewMonth === end_viewMonth && date >=  end_viewDay) {
						_class = _class.replace(' during', '');
					}
				}

				//row
				if (!(i % 7)) {
					_dpHtml += (i !== 0) ? '</tr><tr>' : '<tr>';
				} else {
					_dpHtml += '';
				}
				
				const lunarDate = Global.datepicker.solarToLunar(viewYear,  (viewMonth + 1),  date);
				const lunarDate_m = Number(lunarDate.split('-')[0]);
				const lunarDate_d = Number(lunarDate.split('-')[1]);
				const specialdayMonth_solar = Global.datepicker.specialday[(viewMonth + 1)];
				const specialdayMonth_lunar = Global.datepicker.specialday[lunarDate_m];
				let specialdayName = '';
				let isPublicHoliday = false;

				if (!!date) {
					//양력 공휴일
					let holidayOverlap = false;
					if (specialdayMonth_solar.length > 0){
						for (let item of specialdayMonth_solar) {
							if (!!item.solar && !!item.holiday && item.day === date) {
								//대체휴일(토,일)
								if (isHoliday && item.sub) {
									Global.callback[setId].subDay = true;
								} 

								//2023년부터 석가탄신일, 성탄절도 대체공휴일 적용대상
								if (viewYear < 2023 && (viewMonth + 1) === 12 && date === 25) {
									Global.callback[setId].subDay = false;
								} 
								
								isHoliday = true;
								isPublicHoliday = true;
								holidayOverlap = true;
								specialdayName = item.name;
							} else if (!!item.solar && !item.holiday && item.day === date) {
								specialdayName = item.name;
							}
						}
					}
					// 음력공휴일
					if (specialdayMonth_lunar.length > 0) {
						for (let item of specialdayMonth_lunar) {
							if (!item.solar) {
								
								if (!!item.holiday && item.day === lunarDate_d) {
									//대체휴일: 석가탄신일(토,일,공휴일) 추석,설날(일,공휴일)
									if (lunarDate_m === 4 && lunarDate_d === 8) {
										if ((isHoliday || holidayOverlap) && item.sub ) {
											Global.callback[setId].subDay = true;
										} 
									} else {
										if ((isHolidaySunday || holidayOverlap) && item.sub ) {
											Global.callback[setId].subDay = true;
										} 
									} 
									
									isHoliday = true;
									isPublicHoliday = true;
									specialdayName = item.name;
								} else if (!!item.holiday && item.day === 'last') {
									//설 전날 마지막일 찾기
									let lunarDateNext = Global.datepicker.solarToLunar(viewYear,  (viewMonth + 1),  date + 1);
									if (!lunarDateNext) {
										lunarDateNext = Global.datepicker.solarToLunar(viewYear,  (viewMonth + 2),  1);
									}
									const lunarDateNext_m = Number(lunarDateNext.split('-')[0]);
									console.log(date, lunarDateNext, lunarDateNext_m, lunarDate_m);
									if (lunarDateNext_m !== undefined && lunarDate_m !== lunarDateNext_m){
										if ((isHolidaySunday || holidayOverlap) && item.sub ) {
											Global.callback[setId].subDay = true;
										} 

										isHoliday = true;
										isPublicHoliday = true;
										specialdayName = item.name;
									}
								}

								//2023년부터 석가탄신일, 성탄절도 대체공휴일 적용대상
								if (viewYear < 2023 && lunarDate_m === 4 && lunarDate_d === 8) {
									Global.callback[setId].subDay = false;
								}
							} 
						}
					}
				}

				_dpHtml += '<td class="'+ _class +'">';

				if (date !== '') {
					console.log(_day, _day === ' selected-start');
					_dpHtml += '<button type="button" class="datepicker-day '+ _day +'" data-date="'+ viewYear +'-'+ Global.parts.add0(viewMonth + 1)+'-'+ Global.parts.add0(date)+ '" data-holiday='+ (isPublicHoliday || _disabled || (!isHoliday && Global.callback[setId].subDay) ? 'true' : 'false') +' aria-label="'+ (_day === 'today' ? '오늘날짜 ' : _day === ' selected-start' ? '선택된 날짜 ' :'') + viewYear +'년 '+ (viewMonth + 1) +'월 '+ date + '일 ' + week[(i+7) % 7] + '요일 '+ (!!specialdayName ? specialdayName : Global.callback[setId].subDay ? '대체휴일' : '') +'" '+ (isHoliyday && (isPublicHoliday || isHoliday || Global.callback[setId].subDay) ? 'disabled' : '') +'>';
				}

				(!isHoliday && Global.callback[setId].subDay) ? Global.callback[setId].subDay = false : '';
				
				_dpHtml += '<span>'+ date +'</span>';
				_dpHtml += '<span class="week-word">' + (date && week[(i+7) % 7])  +'</span>';
				_dpHtml += '</button>';
				_dpHtml += '</td>';
			});

			const dp_tbody = el_dp.querySelector('.datepicker-date');
			const dp_y = el_dp.querySelector('.datepicker-yy');
			const dp_m = el_dp.querySelector('.datepicker-mm');
			const getData = el_dp.dataset.date.split('-');

			const dp_m_prev = el_dp.querySelector('.ui-prev-m');
			const dp_m_next = el_dp.querySelector('.ui-next-m');
			const dp_y_prev = el_dp.querySelector('.ui-prev-y');
			const dp_y_next = el_dp.querySelector('.ui-next-y');
			
			dp_y.innerHTML = getData[0];
			dp_m.innerHTML = getData[1];
			dp_tbody.innerHTML = _dpHtml;

			el_dp.querySelector('caption').textContent = getData[0] + week[8] + ' ' + getData[1] + week[8];
			dp_m_prev.querySelector('span').textContent = (Number(getData[1]) - 1 < 1 ? 12 : Number(getData[1]) - 1) + week[8];
			dp_m_next.querySelector('span').textContent = (Number(getData[1]) + 1 > 12 ? 1 : Number(getData[1]) + 1) + week[8];
			dp_y_prev.querySelector('span').textContent = (Number(getData[0]) - 1) + week[7];
			dp_y_next.querySelector('span').textContent = (Number(getData[0]) + 1) + week[7];

			const dayBtns = dp_tbody.querySelectorAll('.datepicker-day');
			const len = dayBtns.length;
			const dayClickConfirm = (e) => {
				const btn = e.currentTarget;
				const id = btn.closest('.datepicker').dataset.id;

				Global.datepicker.confirm({
					id: btn.closest('.datepicker').dataset.id
				});
				btn.removeEventListener('click', dayClickConfirm);
			}
			const keyMove = (e) => {
				const isShift = !!window.event.shiftKey;
				const n = Number(e.currentTarget.dataset.n);
				const keycode = e.keyCode;
				const keys = Global.state.keys;

				let current = n;

				switch (keycode) {
					case keys.up:
						e.preventDefault();

						current = (n - 7 < 0) ? 0 : n - 7;
						dp_tbody.querySelector('.datepicker-day[data-n="'+current+'"]').focus();
						break;
					case keys.left:
						e.preventDefault();

						current = (n - 1 < 0) ? 0 : n - 1;
						dp_tbody.querySelector('.datepicker-day[data-n="'+current+'"]').focus();
						break;
					case keys.down:
						e.preventDefault();

						current = (n + 7 > len - 1) ? len - 1 : n + 7;
						dp_tbody.querySelector('.datepicker-day[data-n="'+current+'"]').focus();
						break;
					case keys.right:
						e.preventDefault();

						current = (n + 1 > len - 1) ? len - 1 : n + 1;
						dp_tbody.querySelector('.datepicker-day[data-n="'+current+'"]').focus();
						break;
					// case keys.tab:
					// 	isShift ?
					// 		el_dp.querySelector('.datepicker-header .datepicker-title').focus(): 
					// 		el_dp.querySelector('.ui-confirm').focus();
					// 	break;
					case keys.enter:
						e.preventDefault();

						Global.datepicker.daySelect(e);
						(!Global.datepicker.isFooter) && dayClickConfirm(e);
						break;
				}
			}

			for (let i = 0; i < len; i++) {
				const that = dayBtns[i];

				if (Global.datepicker.isFooter || period) {
					that.addEventListener('click', Global.datepicker.daySelect);
				} else {
					that.addEventListener('click', (e) => {
						Global.datepicker.daySelect(e);
						that.dataset.n = i;
						dayClickConfirm(e);
					});
				}
				that.dataset.n = i;

				that.addEventListener('keydown', keyMove);
			}
		},
		daySelect(event) {
			const el_btn = event.currentTarget;
			const el_dp = el_btn.closest('.datepicker');
			const dayBtn = el_dp.querySelectorAll('.datepicker-day');
			const selectDay = el_btn.dataset.date;
			let period = el_dp.dataset.period;
			const n = 0;
			const id = el_dp.dataset.id;
			const date = new Date(el_dp.dataset.date);
			const el_inp = document.querySelector('#' + id);
			const el_uidp = el_inp.closest('.ui-datepicker');
			const el_start = el_uidp.querySelector('[data-period="start"]');
			const el_end = el_uidp.querySelector('[data-period="end"]');
			const isView = el_inp.dataset.view === 'true' ? true : false;

			period = (!!el_dp.dataset.end) ? 'end' : period;

			if (!period) {
				//single mode
				el_dp.dataset.start = selectDay;

				for (let i = 0, len = dayBtn.length; i < len; i++) {
					const that = dayBtn[i];

					that.classList.remove('selected-start');
				}
				el_btn.classList.add('selected-start');

				// if (isView) {
				// 	Global.datepicker.confirm({
				// 		id: id
				// 	});
				// } 
			} else {
				//period mode
				if (period === 'start') {
					//start
					el_dp.dataset.start = selectDay;
					el_dp.dataset.period = 'end';
					el_btn.classList.add('selected-start');
					//el_end.min = selectDay;
				} else {
					//end
					if (el_dp.dataset.start > selectDay) {
						el_dp.dataset.start = selectDay;
						el_dp.dataset.end = '';
						el_btn.classList.add('selected-start');
						el_dp.querySelector('.selected-start') && el_dp.querySelector('.selected-start').classList.remove('selected-start');
						el_dp.querySelector('.selected-end') && el_dp.querySelector('.selected-end').classList.remove('selected-end');
					} else {
						if (!el_dp.dataset.end) {
							//end 
							if (el_dp.dataset.start === selectDay) {
								el_dp.dataset.start = '';
								el_dp.dataset.end = '';
								el_dp.dataset.period = 'start';
								el_dp.querySelector('.selected-start') && el_dp.querySelector('.selected-start').classList.remove('selected-start');
							} else {
								el_dp.dataset.end = selectDay;
								el_btn.classList.add('selected-end');
							}
							if (!Global.datepicker.isFooter) {
								Global.datepicker.confirm({
									id: id
								});
							} 
							
						} else {
							//end값 수정`
							if (el_dp.dataset.start === selectDay) {
								el_dp.dataset.start = '';
								el_dp.dataset.end = '';
								el_dp.dataset.period = 'start';
								el_dp.querySelector('.selected-start') && el_dp.querySelector('.selected-start').classList.remove('selected-start');
								el_dp.querySelector('.selected-end') && el_dp.querySelector('.selected-end').classList.remove('selected-end');
							} else {
								if (el_dp.dataset.end === selectDay) {
									el_dp.dataset.end = '';
									el_dp.querySelector('.selected-end') && el_dp.querySelector('.selected-end').classList.remove('selected-end');
								} else {
									if (!!el_dp.querySelector('.selected-end')) {
										el_dp.querySelector('.selected-end').classList.remove('selected-end');
									}
								
									el_dp.dataset.end = selectDay;
									el_btn.classList.add('selected-end');
								}
							}
							if (!Global.datepicker.isFooter) {
								Global.datepicker.confirm({
									id: id
								});
							} 
						}
					}
				}

				const now_focus = document.activeElement;
				Global.datepicker.dateMake({
					setDate: date,
					setId: id
				});

				!!now_focus.dataset.date && el_dp.querySelector('.datepicker-day[data-date="'+ now_focus.dataset.date +'"]').focus();
			}
		},
		nextYear(event) {
			const dpId = event.target.dataset.dpid;
			const el_inp = document.querySelector('#' + dpId);
			const el_dp = document.querySelector('.datepicker[data-id="'+dpId+'"]');
			const el_next = el_dp.querySelector('.ui-next-y');
			const el_prev = el_dp.querySelector('.ui-prev-y');
			const el_next_m = el_dp.querySelector('.ui-next-m');
			const el_prev_m = el_dp.querySelector('.ui-prev-m');

			const date = new Date(el_dp.dataset.date);
			const year = date.getFullYear();
			const month = date.getMonth() + 1;
			const day = date.getDay();

			const max = el_inp.getAttribute('max');
			const max_date = new Date(max);
			const max_year = max_date.getFullYear();
			const max_month = max_date.getMonth() + 1;
			const max_day = max_date.getDay();

			const min = el_inp.getAttribute('min');
			const min_date = new Date(min);
			const min_year = min_date.getFullYear();
			const min_month = min_date.getMonth() + 1;
			const min_day = min_date.getDay();

			// if (year + 1 <= min_year) {
			// 	//el_prev.disabled = true;
			// } else {
			// 	//el_prev.disabled = false;
			// }

			// el_prev_m.disabled = false;
			// if (year + 1 === max_year) {
			// 	if (month > max_month) {
			// 		month = max_month;
			// 		//el_next_m.disabled = true;
			// 	}
			// 	date.setMonth(month - 1);
			// 	//el_next.disabled = true;
			// } else if (year > max_year) {
			// 	//return false;
			// }
			
			date.setFullYear(year + 1);

			el_dp.dataset.date = (year + 1) +'-'+ Global.parts.add0(month); 
			Global.datepicker.dateMake({
				setDate: date,
				setId: dpId
			});
		},
		prevYear(event) {
			const dpId = event.target.dataset.dpid;
			const el_inp = document.querySelector('#' + dpId);
			const el_dp = document.querySelector('.datepicker[data-id="'+dpId+'"]');
			const el_next = el_dp.querySelector('.ui-next-y');
			const el_prev = el_dp.querySelector('.ui-prev-y');
			const el_next_m = el_dp.querySelector('.ui-next-m');
			const el_prev_m = el_dp.querySelector('.ui-prev-m');

			const date = new Date(el_dp.dataset.date);
			const year = date.getFullYear();
			const month = date.getMonth() + 1;
			const day = date.getDay();

			const max = el_inp.getAttribute('max');
			const max_date = new Date(max);
			const max_year = max_date.getFullYear();
			const max_month = max_date.getMonth() + 1;

			const min = el_inp.getAttribute('min');
			const min_date = new Date(min);
			const min_year = min_date.getFullYear();
			const min_month = min_date.getMonth() + 1;

			// if (year - 1 >= max_year) {
			// 	el_next.disabled = true;
			// } else {
			// 	el_next.disabled = false;
			// }

			// el_next_m.disabled = false;
			// if (year - 1 === min_year) {
			// 	if (month < min_month) {
			// 		month = min_month;
			// 		el_prev_m.disabled = true;
			// 	}
			// 	date.setMonth(month - 1);
			// 	el_prev.disabled = true;
			// } else if (year < min_year) {
			// 	return false;
			// }
			
			date.setFullYear(year - 1);

			el_dp.dataset.date = (year - 1) +'-'+ Global.parts.add0(month); 

			Global.datepicker.dateMake({
				setDate: date,
				setId: dpId
			});
		},
		nextMonth(event) {
			const dpId = event.target.dataset.dpid;
			const el_dp = document.querySelector('.datepicker[data-id="'+dpId+'"]');
			let date = new Date(el_dp.dataset.date);
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			
			if (month > 11) {
				month = 0;
				year = year + 1;
				date.setFullYear(year);
			}

			date.setMonth(month);

			el_dp.dataset.date = year +'-'+ Global.parts.add0(month + 1); 

			Global.datepicker.dateMake({
				setDate: date,
				setId: dpId
			});
		},
		prevMonth(event) {
			const dpId = event.target.dataset.dpid;
			const el_dp = document.querySelector('.datepicker[data-id="'+dpId+'"]');
			let date = new Date(el_dp.dataset.date);
			let year = date.getFullYear();
			let month = date.getMonth();
			
			if (month < 1) {
				month = 12;
				year = year - 1;
				date.setFullYear(year);
			}

			date.setMonth(month - 1);

			el_dp.dataset.date = year +'-'+ Global.parts.add0(month); 

			Global.datepicker.dateMake({
				setDate: date,
				setId: dpId
			});
		},
		goToday(event) {
			const dpId = event.target.dataset.dpid;
			const el_dp = document.querySelector('.datepicker[data-id="'+dpId+'"]');
			const date = new Date();
			const year = date.getFullYear();
			const month = date.getMonth() + 1;
			
			el_dp.dataset.date = year +'-'+ Global.parts.add0(month); 

			Global.datepicker.dateMake({
				setDate: date,
				setId: dpId
			});
		},
		daySetting(opt) {
			const day = opt.day;
			const id = opt.id;
			const datepicker_date = !!day ? day : new Date();
			let datepicker_today;
			
			if (!!day) {
					datepicker_today = day;
			} else  {
					datepicker_today =  datepicker_date.getFullYear() + '-' + ("0" + (1 + datepicker_date.getMonth())).slice(-2) + '-' + ("0" + datepicker_date.getDate()).slice(-2);
			}
			
			document.querySelector('#' + id).value = datepicker_today;
			Global.datepicker.init();
		}
	}

	/**
	 * SELECT COMBO BOX
	 * in use: Global.state, (Global.scrollBar), Global.parts
	 */
	Global.select = {
		data: {},
		options: {
			id: false, 
			current: null,
			customscroll: true,
			callback: false,
			inner: true
		},
		init (option) {
			const opt = Object.assign({}, this.options, option);
			const current = opt.current;
			const callback = opt.callback;
			let customscroll = opt.customscroll;
			const id = opt.id;
			const isId = !!id ? document.querySelector('#' + opt.id) : false;
			const el_uiSelects = document.querySelectorAll('.ui-select');
			const keys = Global.state.keys;
			const isMobile = Global.state.device.mobile;
			const isInner = opt.inner;

			let el_select;
			let $selectCurrent;
			let selectID;
			let listID;
			let optionSelectedID;
			let selectN;
			let selectTitle;
			let selectDisabled;
			let btnTxt = '';
			let hiddenClass = '';
			let htmlOption = '';
			let htmlButton = '' ;
			let el_btn;
			let el_wrap;
			let el_dim ;
			let setOption;

			//init
			Global.state.device.mobile ? customscroll = false : '';

			//reset
			let idN = JSON.parse(sessionStorage.getItem('scrollbarID'));

			//event action
			const labelClick = (e) => {
				const that = e.currentTarget;
				const idname = that.getAttribute('for');
				const inp = document.querySelector('#' + idname);
 
				inp.focus();
			}
			const selectLeave = () => {
				const body = document.querySelector('body');

				body.dataset.selectopen = true;
			}
			const optBlur = (e) => {
				//if (document.querySelector('body').dataset.selectopen) { .. }); dim
				//optClose();
			}
			const openScrollMove = (el_uiselect) => {
				const el_html = document.querySelector('html, body');
				const dT = Math.floor(document.documentElement.scrollTop);
				const wH = window.innerHeight;
				const el_btn = el_uiselect.querySelector('.ui-select-btn');
				const elT = el_btn.getBoundingClientRect().top;
				const elH = el_btn.offsetHeight;
				const a = Math.floor(elT - dT);
				const b = wH - 240;

				el_uiselect.dataset.orgtop = dT;

				if (a > b) {
					el_html.scrollTo({
						top: a - b + elH + 10 + dT,
						behavior: 'smooth'
					});
				} 
			}
			const optOpen = (btn) => {
				const id = btn.id;
				const el_body = document.querySelector('body');
				const el_uiselect = btn.closest('.ui-select');
				const el_wrap = document.querySelector('.ui-select-wrap[data-id="'+ id +'"]');
				let el_optwrap = el_wrap.querySelector('.ui-select-opts');
				let el_opts = el_optwrap.querySelectorAll('.ui-select-opt');
				const el_select = el_uiselect.querySelector('select');
				const el_option = el_select.querySelectorAll('option');
				const offtop = el_uiselect.getBoundingClientRect().top;
				const offleft = el_uiselect.getBoundingClientRect().left;
				const scrtop = document.documentElement.scrollTop;
				const scrleft = document.documentElement.scrollLeft;
				let wraph = el_wrap.offsetHeight;
				const btn_h = btn.offsetHeight;
				const win_h = window.innerHeight;
				const n = el_select.selectedIndex;
				const state = !!el_uiselect.dataset.state ? el_uiselect.dataset.state : '';
				
				el_body.classList.add('dim-select');
				btn.dataset.expanded = true;
				btn.setAttribute('aria-expanded', true);
				el_uiselect.classList.add('on');
				el_wrap.classList.add('on');
				el_wrap.setAttribute('aria-hidden', false);
				el_opts[n].classList.add('selected');
				
				if (customscroll) {
					(el_wrap.dataset.scrollId) && Global.scrollBar.destroy(el_wrap.dataset.scrollId);
					Global.scrollBar.init();
				} 

				setTimeout(() => {
					el_optwrap = el_wrap.querySelector('.ui-select-opts');
					el_opts = el_optwrap.querySelectorAll('.ui-select-opt');
					wraph = el_wrap.offsetHeight;
					const opt_h = el_opts[0].offsetHeight;
					const opt_w = el_opts[0].offsetWidth;
					Global.scroll.move({ 
						top: Number(opt_h * n) , 
						selector: customscroll ? el_wrap.querySelector('.ui-scrollbar-item') : el_wrap, 
						effect: 'auto', 
						align: 'default' 
					});

					for (let i = 0, len = el_opts.length; i < len; i++) {
						const that = el_opts[i];
			
						that.addEventListener('click', Global.select.optClick);
						that.addEventListener('mouseover',  Global.select.selectOver);
					}
					
					el_wrap.addEventListener('mouseleave', selectLeave);
					el_wrap.addEventListener('blur', optBlur);

					if (!isMobile) {
						
						if ((win_h - wraph) + scrtop > offtop + scrtop + btn_h) {
							console.log(122);
							el_uiselect.dataset.ps = 'bottom';
							el_wrap.dataset.ps = 'bottom';
							el_wrap.dataset.state = state;

							if (isInner) {
								el_wrap.style.bottom = 'auto';
								el_wrap.style.top = btn_h - 1 + 'px';
								el_wrap.style.left = '0px';
							} else {
								el_wrap.style.top = offtop + scrtop + btn_h - 1 + 'px';
								el_wrap.style.left = offleft + scrleft + 'px';
							}
						} else {
							el_uiselect.dataset.ps = 'top';
							el_wrap.dataset.ps = 'top';
							el_wrap.dataset.state = state;

							if (isInner) {
								el_wrap.style.top = 'auto';
								el_wrap.style.bottom = btn_h - 1 + 'px';
								el_wrap.style.left = '0px';
							} else {
								el_wrap.style.top = offtop + scrtop - wraph + 1 + 'px';
								el_wrap.style.left = offleft + scrleft + 'px';
							}
						}

						el_wrap.style.minWidth = el_uiselect.offsetWidth + 'px';
						el_wrap.style.maxWidth = el_uiselect.offsetWidth + 'px';
						el_optwrap.style.minWidth = el_uiselect.offsetWidth + 'px';
					}
					
				}, 0);

				openScrollMove(el_uiselect);

				el_wrap.removeEventListener('touchstart', Global.select.wrapTouch);
				el_wrap.addEventListener('touchstart', Global.select.wrapTouch);
			}
			const optExpanded = (btn) => {
				if (Global.state.device.mobile) {
					optOpen(btn);
				} else {
					if (btn.getAttribute('aria-expanded') === 'false') {
						Global.select.hide();
						optOpen(btn);
					} else {
						Global.select.hide();
					}
				}
			}
			const selectClick = (e) => {
				const that = e.currentTarget;
				const el_uiselect = that.closest('.ui-select');
				const el_select = el_uiselect.querySelector('select');
				const opts = el_uiselect.querySelectorAll('option');
				const n = el_select.selectedIndex;
				selectID = el_select.id;

				that.dataset.sct = document.documentElement.scrollTop;

				document.removeEventListener('click', Global.select.back);
				setTimeout(() => {
					document.addEventListener('click', Global.select.back);
				},0);

				setOption(that, n);
				optExpanded(that, n);
			}
			const optConfirm = (e) => {
				const el_confirm = e.currentTarget;
				const el_wrap = el_confirm.closest('.ui-select-wrap');
				const id_inp = el_wrap.dataset.id;
				const id = id_inp.split('_')[0];
				const el_select = document.querySelector('#'+ id);
				const el_uiSelect = el_select.closest('.ui-select');
				const el_body = document.querySelector('body');
				const el_btn = el_uiSelect.querySelector('.ui-select-btn');
				const callback = Global.select.data[id].callback;
				const orgTop = el_uiSelect.dataset.orgtop;

				Global.select.act({ 
					id: el_btn.dataset.id, 
					current: el_select.selectedIndex
				});

				el_body.classList.remove('dim-select');
				el_btn.dataset.expanded = false;
				el_btn.setAttribute('aria-expanded', false)
				el_btn.focus();
				el_wrap.classList.add('off');
				
				const aniend = () => {
					el_uiSelect.classList.remove('on');
					el_wrap.classList.remove('off');
					el_wrap.classList.remove('on');
					el_wrap.classList.remove('top');
					el_wrap.classList.remove('bottom');
					el_wrap.setAttribute('aria-hidden', true);
					el_wrap.removeEventListener('animationend', aniend);
				}
				el_wrap.addEventListener('animationend', aniend);
				!!callback && Global.callback[callback]({
					id: el_btn.dataset.id, 
					current: el_select.selectedIndex
				});
			}
			const eventFn = () => {
				const el_dims = document.querySelectorAll('.dim-select');
				const el_confirms = document.querySelectorAll('.ui-select-confirm');
				const el_cancels = document.querySelectorAll('.ui-select-cancel');
				const el_btns = document.querySelectorAll('.ui-select-btn');
				const el_labels = document.querySelectorAll('.ui-select-label');
				const el_selects = document.querySelectorAll('.ui-select select');

				// for (let that of el_dims) {
				// 	that.addEventListener('click', selectClick);
				// }
				for (let that of el_confirms) {
					that.addEventListener('click', optConfirm);
				}
				for (let that of el_cancels) {
					that.addEventListener('click', Global.select.hide);
				}
				for (let that of el_btns) {
					that.addEventListener('click', selectClick);
				}
				for (let that of el_labels) {
					that.addEventListener('click', labelClick);
				}
				for (let that of el_selects) {
					that.addEventListener('change', Global.select.selectChange);
				}
			}
			//option set
			setOption = (uiSelect, v) => {
				let _select = (uiSelect !== undefined) ? uiSelect.closest('.ui-select') : uiSelect;

				if (uiSelect !== undefined) {
					_select = _select.querySelector('select');
				}

				const _options = _select.querySelectorAll('option');
				const _optionID = _select.id + '_opt';
				const _optLen = _options.length;

				let _current = current;
				let _selected = false;
				let _disabled = false;
				let _hidden = false;
				let _hiddenCls;
				let _optionIdName;

				if (v !== undefined) {
					_current = v;
				}
 
				if (!!_optLen) {
					_select.disabled = false;
					for (let i = 0; i < _optLen; i++) {
						const that = _options[i];

						_hidden = that.hidden;

						if (_current !== null) {
							if (_current === i) {
								_selected = true;
								that.selected = true;
							} else {
								_selected = false;
								that.selected = false;
							}
						} else {
							_selected = that.selected;
						}

						_disabled = that.disabled;
						_hiddenCls =  _hidden ? 'hidden' : '';

						if (_selected) {
							btnTxt = that.textContent;
							optionSelectedID = _optionID + '_' + i;
							selectN = i;
						}

						_selected && _hidden ? hiddenClass = 'opt-hidden' : '';
						_optionIdName = _optionID + '_' + i;

						if (Global.state.device.mobile) {
							_disabled ?
								_selected ?
									htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt disabled selected '+ _hiddenCls + '" value="' + that.value + '" disabled tabindex="-1">' :
									htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt disabled '+ _hiddenCls + '" value="' + that.value + '" disabled tabindex="-1">' :
								_selected ?
									htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt selected '+ _hiddenCls + '" value="' + that.value + '" tabindex="-1">' :
									htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt '+ _hiddenCls + '" value="' + that.value + '" tabindex="-1">';
						} else {
							_disabled ?
								_selected ?
									htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt disabled selected '+ _hiddenCls + '" value="' + that.value + '" disabled tabindex="-1">' :
									htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt disabled '+ _hiddenCls + '" value="' + that.value + '" disabled tabindex="-1">' :
								_selected ?
									htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt selected '+ _hiddenCls + '" value="' + that.value + '" tabindex="-1">' :
									htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt '+ _hiddenCls + '" value="' + that.value + '" tabindex="-1">';
						}

						htmlOption += '<span class="ui-select-txt">' + that.textContent + '</span>';
						htmlOption += '</button>';
					}
				} else {
					btnTxt = '';
					_select.disabled = true;
				}
				return htmlOption;
			}

			//select set
			const set = (el_uiSelect, el_select, selectID) => {
				(selectID === undefined) ? el_select.id = 'uiSelect_' + idN : '';
				listID = selectID + '_list';
 				selectTitle = el_select.title;
				hiddenClass = '';

				const isStyle = !!el_uiSelect.dataset.style ? el_uiSelect.dataset.style : '';

				//callback 나중에 작업필요
				//(!el_select.data('callback') || !!callback) && el_select.data('callback', callback);
				
				if (customscroll) {
					htmlOption += '<div class="ui-select-wrap ui-scrollbar" scroll-id="uiSelectScrollBar_'+ idN +'" data-id="'+ selectID +'_inp" data-style="'+ isStyle +'">';
					idN = idN + 1;
					sessionStorage.setItem('scrollbarID', idN);
				} else {
					htmlOption += '<div class="ui-select-wrap" style="min-width:' + el_uiSelect.offsetWidth + 'px" data-id="'+ selectID +'_inp">';
				}

				htmlOption += '<strong class="ui-select-title">'+ selectTitle +'</strong>';
				htmlOption += '<div class="ui-select-opts" role="listbox" id="' + listID + '" aria-hidden="false">';

				setOption(el_uiSelect, el_select.selectedIndex);
				
				htmlOption += '</div>';
				htmlOption += '<button type="button" class="ui-select-cancel"><span>취소</span></strong>';
				htmlOption += '<button type="button" class="ui-select-confirm"><span>확인</span></strong>';
				htmlOption += '</div>';

				htmlButton = '<button type="button" class="ui-select-btn '+ hiddenClass +'" id="' + selectID + '_inp" role="combobox" aria-autocomplete="list" aria-owns="' + listID + '" aria-haspopup="true" aria-expanded="false" aria-activedescendant="' + optionSelectedID + '" data-n="' + selectN + '" data-id="' + selectID + '" tabindex="-1"><span>' + btnTxt + '</span></button>';
				
				selectDisabled = el_select.disabled;
				el_uiSelect.insertAdjacentHTML('beforeend', htmlButton);
				el_select.classList.add('off');
				el_select.setAttribute('aria-hidden', true)
				// el_uiSelect.insertAdjacentHTML('beforeend', htmlOption);
				const body = document.querySelector('body');
				isInner ? el_uiSelect.insertAdjacentHTML('beforeend', htmlOption) : body.insertAdjacentHTML('beforeend', htmlOption);

				if (selectDisabled) {
					const _btn = el_uiSelect.querySelector('.ui-select-btn');

					_btn.disabled = true;
					_btn.classList.add('disabled')
				}  
				
				eventFn();
				htmlOption = '';
				htmlButton = '';
			}

			//select set
			for (let i = 0, len = el_uiSelects.length; i < len; i++) {
				const that = el_uiSelects[i];

				el_btn = that.querySelector('.ui-select-btn');
				el_dim = that.querySelector('.dim');
				el_select = that.querySelector('select');
				selectID = el_select.id;
				el_wrap = document.querySelector('.ui-select-wrap[data-id="'+ selectID +'_inp"]');
				
				!!el_btn && el_btn.remove();
				!!el_wrap && el_wrap.remove();
				!!el_dim && el_dim.remove();

				Global.select.data[selectID] = {
					callback: !!el_select.dataset.callback ? el_select.dataset.callback : false,
				}

				set(that, el_select, selectID);
			}

			//event
			eventFn();
		},
		back (e){
			e.preventDefault();
			
			let isTure = '';
			const path = e.composedPath();

			for (let i = 0, len = path.length; i < len; i++) {
				const that = path[i];
				isTure = isTure + that.classList;
			}

			if(isTure.indexOf('ui-select-wrap') < 0) {
				Global.select.hide();
				document.removeEventListener('click', Global.select.back);
			} 
		},
		scrollSelect (v, el){
			const id_inp = el.dataset.id;
			const id = id_inp.split('_')[0];
			const _opts = el.querySelectorAll('.ui-select-opt');
			const el_select = document.querySelector('#' + id);
			const el_uiSelect = el_select.closest('.ui-select');
			const el_btn = el_uiSelect.querySelector('.ui-select-btn');
			const opt_h = _opts[0].offsetHeight;

			el.scrollTo({
				top: opt_h * v,
				behavior: 'smooth'
			});

			for (let i = 0, len = _opts.length; i < len; i++) {
				_opts[i].classList.remove('selected');

				if (v === i) {
					_opts[i].classList.add('selected');
					el_uiSelect.dataset.current = i;
				} 
			}
		},
		wrapTouch (e){
			const that = e.currentTarget;
			const wrap = that.querySelector('.ui-select-opts');
			const opts = wrap.querySelectorAll('.ui-select-opt');

			let timerScroll = null;
			let touchMoving = false;
			const wrapT = that.getBoundingClientRect().top;
			let getScrollTop = Math.abs(wrap.getBoundingClientRect().top - wrapT);
			let currentN = 0;
			let opt_h = opts[0].offsetHeight;

			clearTimeout(timerScroll);
			
			let actEnd;
			const actMove = () => {
				touchMoving = true;
				getScrollTop = Math.abs(wrap.getBoundingClientRect().top - wrapT);

				that.addEventListener('touchcancel', actEnd);
				that.addEventListener('touchend', actEnd);
			}
			actEnd = () => {
				const that = this;
				const scrollCompare = () => {
					timerScroll = setTimeout(() => {
						if (getScrollTop !== Math.abs(wrap.getBoundingClientRect().top - wrapT)) {
							getScrollTop = Math.abs(wrap.getBoundingClientRect().top - wrapT);
							scrollCompare();
						} else {
							currentN = Math.floor((Math.floor(getScrollTop) + (opt_h / 2)) / opt_h);
							Global.select.scrollSelect(currentN,  that);
						}
					},100);
				} 
				touchMoving && scrollCompare();
				that.removeEventListener('touchmove', actMove);
			}

			that.addEventListener('touchmove', actMove);
		},
		optClick (e) {
			const that = e.currentTarget;
			const _wrap = that.closest('.ui-select-wrap');
			const id_inp = _wrap.dataset.id;
			const id = id_inp.split('_')[0];
			const el_select = document.querySelector('#' + id);
			const _uiSelect = el_select.closest('.ui-select');
			const _btn = _uiSelect.querySelector('.ui-select-btn');
			const idx = Global.parts.getIndex(that);
			const isMobile = Global.state.device.mobile;
			const callback = Global.select.data[id].callback;

			if (!isMobile) {
				Global.select.act({ 
					id: _btn.dataset.id, 
					current: idx 
				});
				_btn.focus();
				Global.select.hide();

				!!el_select.getAttribute('onchange') && el_select.onchange();
			} else {
				Global.select.scrollSelect(idx, _wrap);
			}

			!!callback && Global.callback[callback]({
				id: _btn.dataset.id, 
				current: idx 
			});
		},
		selectOver () {
			const body = document.querySelector('body');

			body.dataset.selectopen = false;
		},
		selectChange (e) {
			const that = e.target;
			const id = that.id;
			const uiSelect = that.closest('.ui-select');
			const callback = Global.select.data[id].callback;

			uiSelect.dataset.fn;

			Global.select.act({
				id: id,
				current: that.options.selectedIndex,
				original:true
			});
			!!callback && Global.callback[callback]({
				id: id, 
				current: that.options.selectedIndex 
			});
		},
		hide (){
			const el_body = document.querySelector('body');
			const el_selects = document.querySelectorAll('.ui-select');
			const el_selectWraps = document.querySelectorAll('.ui-select-wrap[aria-hidden="false"]');
			const el_btns = document.querySelectorAll('.ui-select-btn[aria-expanded="true"]');
			let el_select;
			let el_wrap;
			let orgTop;

			el_body.classList.remove('dim-select');

			for (let i = 0, len = el_btns.length; i < len; i++) {
				const that = el_btns[i];
				const _id = that.id;

				el_select = that.closest('.ui-select');
				el_wrap = document.querySelector('.ui-select-wrap[data-id="'+ _id +'"]');
				orgTop = el_select.dataset.orgtop;

				that.dataset.expanded = false;
				that.setAttribute('aria-expanded', false);
				that.focus();
				el_select.classList.remove('on');
				el_wrap.classList.remove('on');
				el_wrap.classList.remove('top');
				el_wrap.classList.remove('bottom');
				el_wrap.setAttribute('aria-hidden', true);

				document.querySelector('html, body').scrollTo({
					top: orgTop,
					behavior: 'smooth'
				});
			}

			document.removeEventListener('click', Global.select.back);
		},
		act (opt){
			const id = opt.id;
			const el_select = document.querySelector('#' + id);
			const el_opts = el_select.querySelectorAll('option');
			const el_uiSelect = el_select.closest('.ui-select');
			const el_btn = el_uiSelect.querySelector('.ui-select-btn');
			const el_text = el_btn.querySelector('span');
			const el_selectWrap = document.querySelector('.ui-select-wrap[data-id="'+ id +'_inp"]');
			const el_btnopts = el_selectWrap.querySelectorAll('.ui-select-opt');
			const org = opt.original === undefined ? false : opt.original;

			let current = opt.current;

			if (el_uiSelect.dataset.current !== undefined) {
				current = el_uiSelect.dataset.current;
				el_select.selectedIndex = el_uiSelect.dataset.current;
			} 

			if (!org) {
				el_opts[current].selected = true;
			} 
			
			const optCurrent = el_opts[current];

			(optCurrent.hidden === true) ? 
				el_btn.classList.remove('opt-hidden'):
				el_btn.classList.add('opt-hidden');

			el_text.textContent = optCurrent.textContent;

			for (let that of el_btnopts) {
				that.classList.remove('selected');
			}

			el_btnopts[current].classList.add('selected');
			Global.state.device.mobile && el_btnopts[current].focus();
		}
	}
	
	/**
	 * DROP DOWN
	 * in use: Global.ajax, Global.focus
	 */
	Global.dropdown = {
		data : {},
		options: {
			src: false,
			area: document.querySelector('body'),
			offset: true,
			callback:false,
			closeback:false,
			ps: 'BS',
		},
		init(option){
			const el_btns = document.querySelectorAll('.ui-drop');
			const opt = Object.assign({}, Global.dropdown.options, option);
			
			if (!!opt && !!opt.id) {
				Global.dropdown.data[opt.id] = {
					area: opt.area,
					src: opt.src,
					offset: opt.offset,
					callback: opt.callback,
					closeback: opt.closeback,
					ps: opt.ps,
				}
			} 

			for (let btn of el_btns) {
				Global.dropdown.data[btn.id] = {
					src: !!btn.dataset.src ? btn.dataset.src : opt.src,
					area: !!btn.dataset.area ? btn.dataset.area : opt.area,
					offset: !!btn.dataset.offset ? btn.dataset.offset : opt.offset,
					callback: !!btn.dataset.callback ? btn.dataset.callback : opt.callback,
					closeback: !!btn.dataset.closeback ? btn.dataset.closeback : opt.closeback,
					ps: !!btn.dataset.ps ? btn.dataset.ps : opt.ps,
				}

				btn.removeEventListener('click', Global.dropdown.act);
				btn.addEventListener('click', Global.dropdown.act);
			}
		},
		act (e) {
			e.preventDefault();
			const that = e.currentTarget;
			const id = that.id;
			const opt = Global.dropdown.data[id];

			that.dataset.sct = document.documentElement.scrollTop;
			Global.dropdown.toggle({ 
				id: id,
				src: opt.src,
				area: opt.area,
				offset: opt.offset,
				callback: opt.callback,
				closeback: opt.closeback,
				ps: opt.ps,
			});
		},
		back (e) {
			e.preventDefault();
			
			let isTure = '';
			const path = e.composedPath();

			for (let i = 0, len = path.length; i < len; i++) {
				const that = path[i];
				isTure = isTure + that.classList;
			}

			if(isTure.indexOf('ui-drop-pnl') < 0) {
				Global.dropdown.hide();
				document.removeEventListener('click', Global.dropdown.back);
			} 
		},
		toggle (option) {
			const id = option.id;
			const el_btn = document.querySelector('#' + id);
			let el_pnl = document.querySelector('.ui-drop-pnl[data-id="'+ id +'"]');

			const opt = Object.assign({}, Global.dropdown.data[id], option);
			const ps = opt.ps;
			const src = opt.src ;
			const area = opt.area;
			const offset = opt.offset;
			const callback = opt.callback;
			const closeback = opt.closeback;
			const state = !!opt.state ? opt.state : 'toggle';
			let isExpanded = el_btn.getAttribute('aria-expanded');

			el_btn.dataset.src = src;
			el_btn.dataset.area = area;
			el_btn.dataset.offset = offset;
			el_btn.dataset.callback = !!callback && callback;
			el_btn.dataset.closeback = !!closeback && closeback;
			el_btn.dataset.ps = ps;
			Global.dropdown.data[id] = {
				src: src,
				area: area,
				offset: offset,
				callback: callback,
				closeback: closeback,
				ps: ps,
			}

			if (isExpanded === null) {
				isExpanded = 'false';
				el_btn.setAttribute('aria-expanded', false);
			} else {
				isExpanded = el_btn.getAttribute('aria-expanded');
			} 

			if (state === 'open') {
				isExpanded = 'false';
			} else if (state === 'close') {
				isExpanded = 'true';
			}

			//set
			const set = () => {
				el_pnl = document.querySelector('.ui-drop-pnl[data-id="'+ id +'"]');
				el_pnl.setAttribute('aria-hidden', true);
				el_pnl.setAttribute('aria-labelledby', id);
				el_pnl.dataset.ps = ps;

				!!callback && Global.callback[callback]();
				show();
			}
			
			const show = () => {
				const elBody = document.querySelector('body');

				!el_btn.closest('.ui-drop-pnl') && Global.dropdown.hide();

				Global.focus.loop({
					selector: document.querySelector('.ui-drop-pnl[data-id="'+ id +'"]'),
					callback: hide
				});

				el_btn.setAttribute('aria-expanded', true);	
				el_pnl.setAttribute('aria-hidden', false)
				el_pnl.classList.add('on');
				el_pnl.style.marginTop = 0;

				const sT = Math.floor(document.documentElement.scrollTop);
				const btn_w = Math.ceil(el_btn.offsetWidth);
				const btn_h = Math.ceil(el_btn.offsetHeight);
				const btn_t = Math.ceil(el_btn.getBoundingClientRect().top);
				const btn_l = Math.ceil(el_btn.getBoundingClientRect().left);
				const pnl_w = Math.ceil(el_pnl.offsetWidth);
				const pnl_h = Math.ceil(el_pnl.offsetHeight);

				switch (ps) {
					case 'BS': 
						el_pnl.style.top = btn_t + sT + btn_h + 'px';
						el_pnl.style.left = btn_l + 'px';
						break;
					case 'BC': 
						el_pnl.style.top = btn_t + sT + btn_h + 'px';
						el_pnl.style.left = btn_l - ((pnl_w - btn_w) / 2) + 'px';
						break;
					case 'BE': 
						el_pnl.style.top = btn_t + sT + btn_h + 'px';
						el_pnl.style.left = btn_l - (pnl_w - btn_w) + 'px';
						break;

					case 'TS': 
						el_pnl.style.top = btn_t + sT - pnl_h + 'px';
						el_pnl.style.left = btn_l + 'px';
						break;
					case 'TC': 
						el_pnl.style.top = btn_t + sT - pnl_h + 'px';
						el_pnl.style.left = btn_l - ((pnl_w - btn_w) / 2) + 'px';
						break;
					case 'TE': 
						el_pnl.style.top = btn_t + sT - pnl_h + 'px';
						el_pnl.style.left =  btn_l - (pnl_w - btn_w) + 'px';
						break;

					case 'RS': 
						el_pnl.style.top = btn_t + sT + 'px';
						el_pnl.style.left = btn_l + btn_w + 'px';
						break;
					case 'RC': 
						el_pnl.style.top = btn_t + sT - ((pnl_h - btn_h) / 2) + 'px';
						el_pnl.style.left = btn_l + btn_w + 'px';
						break;
					case 'RE': 
						el_pnl.style.top = btn_t + sT - (pnl_h - btn_h) + 'px';
						el_pnl.style.left = btn_l + btn_w + 'px';
						break;

					case 'LS': 
						el_pnl.style.top = btn_t + sT + 'px';
						el_pnl.style.left = btn_l - pnl_w + 'px';
						break;
					case 'LC': 
						el_pnl.style.top = btn_t + sT - ((pnl_h - btn_h) / 2) + 'px';
						el_pnl.style.left = btn_l - pnl_w + 'px';
						break;
					case 'LE': 
						el_pnl.style.top = btn_t + sT - (pnl_h - btn_h) + 'px';
						el_pnl.style.left = btn_l - pnl_w + 'px';
						break; 

					case 'CC':
						el_pnl.style.top = btn_t + sT + btn_h + 'px';
						el_pnl.style.left = btn_l - ((pnl_w - btn_w) / 2) + 'px';
						el_pnl.style.marginTop = (pnl_h / 2 ) * -1 + 'px';
						break;

					default:
						el_pnl.style.top = btn_t + sT + btn_h + 'px';
						el_pnl.style.left = btn_l + 'px';
				}
				
				elBody.classList.add('dropdownOpened');
				el_pnl.focus();

				//close event
				const el_close = el_pnl.querySelector('.ui-drop-close');
				el_close.addEventListener('click', Global.dropdown.close);

				//back event
				document.removeEventListener('click', Global.dropdown.back);
				setTimeout(() => {
					document.addEventListener('click', Global.dropdown.back);
				},0);
			}
			const hide = () => {
				const in_pnl = el_btn.closest('.ui-drop-pnl');
				const elBody = document.querySelector('body');

				(!in_pnl) && elBody.classList.remove('dropdownOpened');
				el_btn.setAttribute('aria-expanded', false)
				el_btn.focus();
				el_pnl.setAttribute('aria-hidden', true)
				el_pnl.setAttribute('tabindex', -1)
				el_pnl.classList.remove('on');

				!!closeback && Global.callback[closeback]();
			}

			if (isExpanded === 'false') {
				if (!!el_pnl) {
					show();
				} else {
					Global.ajax.init({
						area: area,
						url: src,
						add: true,
						callback: set
					});
				}
			} else {
				hide();
			}
		}, 
		close(e) {
			const that = e.currentTarget;
			const wrap = that.closest('.ui-drop-pnl');
			const box = wrap.querySelector('.ui-drop-box');
			const drops = box.querySelectorAll('.ui-drop');
			const id = wrap.dataset.id;

			for(let drop of drops) {
				const _id = drop.id;
				const _btn = document.querySelector('#'+ _id);
				const _pnl = document.querySelector('.ui-drop-pnl[data-id="'+ _id +'"]');

				_btn.setAttribute('aria-expanded', false);

				if (!!_pnl) {
					_pnl.setAttribute('hidden', true);
					_pnl.setAttribute('tabindex', -1);
					_pnl.classList.remove('on');
				}
			}

			that.removeEventListener('click', Global.dropdown.close);
			Global.dropdown.toggle({ id: id });
			document.querySelector('#' + id).focus();
		},
		hide () {
			const elBody = document.querySelector('body')
			const elDrops = document.querySelectorAll('.ui-drop');
			const elDropPnls = document.querySelectorAll('.ui-drop-pnl[aria-hidden="false"]');

			elBody.classList.remove('dropdownOpened');

			for (let elDrop of elDrops) {
				elDrop.setAttribute('aria-expanded', false);
			}
			for (let elDropPnl of elDropPnls) {
				elDropPnl.setAttribute('hidden', true);
				elDropPnl.setAttribute('tabindex', -1);
				elDropPnl.classList.remove('on');
			}

			document.removeEventListener('click', Global.dropdown.back);
		}
	}	

	/**
	 * MODAL POPUP
	 * in use: Global.state, Global.ajax, Global.focus, Global.scroll, (Global.scrollBar)
	 */
	Global.modal = {
		/**
		 * options
		 * type: normal | system
		 * ps: center | top | bottom
		 * full: false | true | mobile | desktop
		 * remove: false | true
		 * scroll: inner | outer
		 */
		options: {
			type: 'normal',
			ps: 'center',
			whole: false,
			src: false,
			remove: false,
			width: false,
			height: false,
			callback: false,
			closeCallback: false,
			endfocus: false,
			drag: false,
			gap: 20,
			scroll: 'inner',
			dim: true,
			sMessage: '',
			sBtnConfirmTxt: null,
			sBtnCancelTxt: null,
			sClass: 'type-system',
			sZindex: false,
			sConfirmCallback: false,
			sCancelCallback: false
		},
		optionsClose: {
			remove: false,
			callback: false,
			endfocus: false
		},
		show(option) {
			const opt = Object.assign({}, Global.modal.options, option);
			const el_body = document.querySelector('body');
			const type = opt.type;
			const src = opt.src;
			const whole = opt.whole;
			const ps = opt.ps;
			const dim = opt.dim;
			const drag = opt.drag;
			const width = Number(opt.width);
			let height = Number(opt.height);
			const callback = opt.callback;
			const callbackClose = opt.callbackClose;
			const _scroll = opt.scroll;
			let gap = opt.gap;
			let id = opt.id;
			let remove = opt.remove;
			let endfocus = opt.endfocus === false ? document.activeElement : opt.endfocus;
			const scr_t = document.documentElement.scrollTop;
			let timer;
			//system
			const sMessage = opt.sMessage;
			const sBtnConfirmTxt = opt.sBtnConfirmTxt;
			const sBtnCancelTxt = opt.sBtnCancelTxt;
			const sZindex = opt.sZindex;
			const sClass = opt.sClass;
			const sConfirmCallback = opt.sConfirmCallback;
			const sCancelCallback = opt.sCancelCallback;
			const focusID = id + Math.random().toString(36).substr(2, 16);
			const isTouch = (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement)
			!document.querySelector('.area-dialog') && el_body.insertAdjacentHTML('beforeend', `<div class="area-dialog"></div>`);
			const el_area_modal = document.querySelector('.area-dialog');
			const act = () => {
				const elModal = document.querySelector('#' + id);
				const elModals = document.querySelectorAll('.ui-dialog');
				if (!elModal) return false;
				for (let i = 0, len = elModals.length; i < len; i++) {
					const that = elModals[i];
					that.classList.remove('current');
					if (window.innerWidth !== document.documentElement.clientWidth) {
						el_body.classList.add('scroll-no');
					}
				}
				if (dim) {
					(!elModal.querySelector('.ui-dialog-dim')) && elModal.insertAdjacentHTML('beforeend', '<div class="ui-dialog-dim"></div>');
				}
				const elModalWrap = elModal.querySelector('.ui-dialog-wrap');
				const elModalBody = elModalWrap.querySelector('.ui-dialog-body');
				const elModalHeader = elModalWrap.querySelector('.ui-dialog-header');
				const elModalFooter = elModalWrap.querySelector('.ui-dialog-footer');
				const elModalTit = elModal.querySelector('.ui-dialog-tit');
				const elModalDim = elModal.querySelector('.ui-dialog-dim');
				const elModalCancel = elModal.querySelector('.ui-dialog-cancel');
				const elModalConfirm = elModal.querySelector('.ui-dialog-confirm');
				const elModalClose = elModal.querySelector('.ui-dialog-close');
				const elModalOpen = document.querySelectorAll('.ui-dialog.open');
				const openLen = !!elModalOpen ? elModalOpen.length : 0;
				document.querySelector('html').classList.add('is-dialog');
				elModal.classList.remove('close');
				elModal.classList.remove('type-whole');
				elModal.classList.remove('ps-center');
				elModal.classList.remove('ps-top');
				elModal.classList.remove('ps-bottom');
				elModal.classList.remove('type-whole');
				elModal.classList.remove('type-whole-mobile');
				elModal.classList.remove('type-whole-desktop');
				setTimeout(() => {
					elModal.classList.add('n' + openLen);
					elModal.classList.add('current');
					elModal.classList.add('ready');
				}, 0)
				elModal.dataset.remove = remove;
				elModal.dataset.n = openLen;
				elModal.dataset.scrolltop = scr_t;
				elModal.setAttribute('aria-labelledby', id + '_label');
				elModal.setAttribute('aria-describedby', id + '_desc');
				elModal.setAttribute('role', 'dialog');
				elModal.dataset.drag = drag ? true : false;
				(!!elModalTit) ? elModalTit.id = id + '_label' : '';
				elModalBody.style.overflowY = 'auto';
				elModalBody.id = id + '_desc';
				elModal.dataset.focusid = focusID;
				//[set] position
				switch (ps) {
					case 'center':
						elModal.classList.add('ps-center');
						elModal.dataset.ps = 'center';
						break;
					case 'top':
						elModal.classList.add('ps-top');
						elModal.dataset.ps = 'top';
						break;
					case 'right':
						elModal.classList.add('ps-right');
						elModal.dataset.ps = 'right';
						break;
					case 'left':
						elModal.classList.add('ps-left');
						elModal.dataset.ps = 'left';
						break;
					case 'bottom':
						elModal.classList.add('ps-bottom');
						elModal.dataset.ps = 'bottom';
						break;
					default:
						elModal.classList.add('ps-center');
						elModal.dataset.ps = 'center';
						break;
				}
				//[set] whole type / width & height
				switch (whole) {
					case true:
						elModal.classList.add('type-whole');
						gap = 0;
						break;
					case 'mobile':
						elModal.classList.add('type-whole-mobile');
						gap = !!Global.state.device.mobile ? 0 : gap;
						break;
					case 'desktop':
						elModal.classList.add('type-whole-desktop');
						break;
				}
				(!!width) ? elModalWrap.style.width = width / 10 + 'rem' : '';
				elModal.setAttribute('data-scroll', (_scroll === 'inner') ? 'inner' : 'outer');
				clearTimeout(timer);
				timer = setTimeout(() => {
					elModal.setAttribute('tabindex', 0);
					Global.focus.loop({ selector: elModal });
					elModal.classList.add('open');
					(!!sZindex) ? elModal.style.zIndex = sZindex : '';
					(window.innerHeight < elModalWrap.offsetHeight) ?
						elModal.classList.add('is-over') :
						elModal.classList.remove('is-over');
				},0);
				//dim event
				// elModalDim && elModalDim.addEventListener('click', Global.modal.dimAct);
				//drag event
				let isDragState = false;
				const dragStart = (e) => {
					const el_this = e.currentTarget;
					const y = isTouch ? e.targetTouches[0].clientY : e.clientY;
					const x = isTouch ? e.targetTouches[0].clientX : e.clientX;
					const rect = elModalWrap.getBoundingClientRect();
					const h = rect.height;
					let isMove = false;
					let y_m;
					let x_m;
					const dragMove = (e) => {
    					y_m = isTouch ? e.targetTouches[0].clientY : e.clientY;
    					x_m = isTouch ? e.targetTouches[0].clientX : e.clientX;
						if (isDragState) {
							if (Math.abs(y - y_m) > 10 && Math.abs(x - x_m) < Math.abs(y - y_m) && (y - y_m) < 0) {
								elModalWrap.setAttribute(
									'style',
									`max-height: ${(h + (y - y_m)) / 10}rem !important; height: ${(h + (y - y_m)) / 10}rem !important;`
								);
								isMove = true;
							} else {
								isMove = false;
							}
						} else {
							if (Math.abs(y - y_m) > 10 && Math.abs(x - x_m) < Math.abs(y - y_m) && (y - y_m) > 0) {
								elModalWrap.setAttribute(
									'style',
									`max-height: ${(h + (y - y_m)) / 10}rem !important; height: ${(h + (y - y_m)) / 10}rem !important;`
								);
								isMove = true;
							} else {
								isMove = false;
							}
						}
					}
					const dragEnd = () => {
						document.removeEventListener('touchmove', dragMove);
						document.removeEventListener('touchend', dragEnd);
						//확장에서 축소를 위한 드래그체크
						const reDrag = (e) => {
    						const _y = isTouch ? e.targetTouches[0].clientY : e.clientY;
							const _x = isTouch ? e.targetTouches[0].clientX : e.clientX;
							const _t = elModalBody.scrollTop;
							let _y_m;
							let _x_m;
							const reDragMove = (e) => {
								_y_m = isTouch ? e.targetTouches[0].clientY : e.clientY;
								_x_m = isTouch ? e.targetTouches[0].clientX : e.clientX;
							}
							const reDragEnd = () => {
								document.removeEventListener('touchmove', reDragMove);
								document.removeEventListener('touchend', reDragEnd);

								if (_t < 1 && (_y - _y_m) < 0 && Math.abs(_x - _x_m) < Math.abs(_y - _y_m)) {
									elModalWrap.removeEventListener('touchstart', reDrag);
									elModalWrap.addEventListener('touchstart', dragStart);
								} else {
									elModalWrap.addEventListener('touchstart', reDrag);
								}
							}
							document.addEventListener('touchmove', reDragMove, { passive: false });
							document.addEventListener('touchend', reDragEnd);
						}
						const restoration = () => {
							elModal.dataset.state = '';
							elModalWrap.setAttribute(
								'style',
								`max-height: 32rem !important; overflow-y: hidden !important;`
							);
							elModalWrap.addEventListener('touchstart', dragStart);
							isDragState = false;
						}
						const reDragClose = (e) => {
							restoration();
							elModalWrap.removeEventListener('touchstart', reDrag);
						}
						//성공 확장
						if (y - 100 > y_m && isMove) {
							elModal.dataset.state = 'drag-full';
							elModalWrap.classList.add('motion');
							const dragCloseBtn = elModal.querySelector('[data-dialog-drag="close"]');
							isDragState = true;
							dragCloseBtn && dragCloseBtn.addEventListener('click', reDragClose);
							elModalWrap.setAttribute(
								'style', 'max-height:100dvh !important; overflow-y: hidden !important; height: 100dvh !important;'
							);
							elModalWrap.addEventListener('transitionend', () => {
								elModalWrap.classList.remove('motion');
								const _list = elModalBody.querySelector('.search-result-list');
								const hasScroll = _list.scrollHeight > _list.clientHeight;

								if (hasScroll) {
									elModalWrap.removeEventListener('touchstart', dragStart);
									elModalWrap.addEventListener('touchstart', reDrag);
								}
							});
						} 
						//성공 원복
						else if(y_m - y > 100) {
							restoration();
						} 
						//취소 풀원복
						else if (isDragState) {
							elModalWrap.setAttribute(
								'style', 'max-height:100dvh !important; overflow-y: hidden !important; height: 100dvh !important;'
							);
						} 
						//취소 원복
						else {
							restoration();
						}
					}
					document.addEventListener('touchmove', dragMove, { passive: false });
					document.addEventListener('touchend', dragEnd);
				}
				if (drag) {
					elModalWrap.addEventListener('touchstart', dragStart);
				}
				//close button event
				const closeAct = (e) => {
					const elThis = e.currentTarget;
					const elThisModal = elThis.closest('.ui-dialog');
					!!elModalClose && elModalClose.removeEventListener('click', closeAct);
					Global.modal.hide({
						id: elThisModal.id,
						remove: remove,
						callbackClose: callbackClose
					});
				}

				const lastClose = elModal.querySelector('.ui-dialog-last');
				if (!!elModalClose) {
					elModalClose.addEventListener('click', closeAct);
				}
				if (!!lastClose) {
					lastClose.addEventListener('click', closeAct);
				}

				//systyem modal confirm & cancel callback
				elModalConfirm && elModalConfirm.addEventListener('click', sConfirmCallback);
				elModalCancel && elModalCancel.addEventListener('click', sCancelCallback);

				//transition end event
				// const modalTrEnd = () => {
				// 	if (!!whole) {
				// 		elModal.classList.add('fix-header');
				// 		elModalBody.style.paddingTop = (headerH + 10) / 10 + 'rem';
				// 	}
				// }
				// elModalWrap.addEventListener('transitionend', modalTrEnd);

				//resize event
				let timerResize;
				const winResize = () => {
					clearTimeout(timerResize);
					timerResize = setTimeout(() => {
						Global.modal.reset();
					}, 200);
				}
				window.addEventListener('resize', winResize);

				setTimeout(() => {
					!!callback && callback(id);
				}, 100);
			}

			//system modal 
			const makeSystemModal = () => {
				let htmlSystem = '';
				htmlSystem += '<div class="ui-dialog type-system ' + sClass + '" id="' + id + '" role="alertdialog" aria-dialog="true" aria-live="polite">';
				htmlSystem += '<div class="ui-dialog-wrap">';
				htmlSystem += '<div class="ui-dialog-body">';
				htmlSystem += sMessage;
				htmlSystem += '</div>';
				htmlSystem += '<div class="ui-dialog-footer">';
				htmlSystem += '<div class="modal-footer-btn-group">';

				if (sBtnCancelTxt) {
					htmlSystem += '<button type="button" class="btn-base ui-dialog-cancel" data-color="tertiary" data-size="48"><span class="btn-text">' + sBtnCancelTxt + '</span></button>';
				}
				if (sBtnConfirmTxt) {
					htmlSystem += '<button type="button" class="btn-base ui-dialog-confirm" data-color="secondary" data-size="48"><span class="btn-text">' + sBtnConfirmTxt + '</span></button>';
				}

				htmlSystem += '</div>';
				htmlSystem += '</div>';
				htmlSystem += '</div>';
				htmlSystem += '</div>';

				el_area_modal.insertAdjacentHTML('beforeend', htmlSystem);

				htmlSystem = '';
				act();
			}

			//setting
			if (type === 'normal') {
				//modal
				if (!!src && !document.querySelector('#' + opt.id)) {
					Global.ajax.init({
						area: el_area_modal,
						url: src,
						add: true,
						callback: () => {
							act();
						}
					});
				} else {
					act();
				}

				endfocus.dataset.focus = focusID;

			} else {
				//system modal
				endfocus = null;
				remove = true;
				id = id;
				makeSystemModal();
				Global.state.isSystemModal = true;
			}
		},
		dimAct() {
			const elOpens = document.querySelectorAll('.ui-dialog.open');
			let openN = [];

			for (let i = 0, len = elOpens.length; i < len; i++) {
				const that = elOpens[i];
				that.dataset.n && openN.push(that.dataset.n);
			}

			const elCurrent = document.querySelector('.ui-dialog.open[data-n="' + Math.max.apply(null, openN) + '"]');
			const currentID = elCurrent.id;

			//system modal 제외
			if (currentID !== 'uiSystemModal') {
				Global.modal.hide({
					id: currentID,
					remove: elCurrent.dataset.remove
				});
			}
		},
		reset() {
			const elModals = document.querySelectorAll('.ui-dialog.open.ps-center');

			for (let i = 0, len = elModals.length; i < len; i++) {
				const that = elModals[i];
				const elModalHead = that.querySelector('.ui-dialog-header');
				const elModalBody = that.querySelector('.ui-dialog-body');
				const elModalFoot = that.querySelector('.ui-dialog-footer');
				const h_win = window.innerHeight;
				const h_head = !!elModalHead ? elModalHead.outerHeight : 0;
				const h_foot = !!elModalFoot ? elModalFoot.outerHeight : 0;
				const h = h_win - (h_head + h_foot);

				if (Global.state.browser.size !== 'desktop') {
					elModalBody.style.minHeight = h / 10 + 'rem';
					elModalBody.style.maxHeight = h / 10 + 'rem';
				} else {
					elModalBody.style.minHeight = '';
					elModalBody.style.maxHeight = '';
				}
			}
		},
		hide(option) {
			const opt = Object.assign({}, Global.modal.optionsClose, option);
			const id = opt.id;
			const type = opt.type;
			const remove = opt.remove;
			const callback = opt.callback;
			const elModal = document.querySelector('#' + id);
			const el_body = document.querySelector('body');
			const elHtml = document.querySelector('html');
			const elModals = document.querySelectorAll('.ui-dialog');

			elModal.classList.add('close');
			elModal.classList.remove('open')
			elModal.classList.remove('fix-header');

			const elOpen = document.querySelectorAll('.ui-dialog.open');
			const len = (elOpen.length > 0) ? elOpen.length : false;

			let timer;
			let endfocus = opt.endfocus;
			let elModalPrev = false;
			const focusID = elModal.dataset.focusid;


			for (let i = 0, len = elModals.length; i < len; i++) {
				const that = elModals[i];
				that.classList.remove('current');
			}

			if (!!len) {
				elModalPrev = document.querySelector('.ui-dialog.open.n' + (len - 1));
				!!elModalPrev && elModalPrev.classList.add('current');
			}

			//시스템팝업이 아닌 경우
			if (type !== 'system') {
				endfocus = endfocus === false ?
					document.querySelector('[data-focus="' + focusID + '"]') :
					opt.endfocus;

				//단일
				if (!len) {
					elHtml.classList.remove('is-dialog');
				}
			}

			Global.scroll.move({
				top: Number(elModal.dataset.scrolltop)
			});

			const closeEnd = () => {
				const elWrap = elModal.querySelector('.ui-dialog-wrap');
				const elOpen = document.querySelectorAll('.ui-dialog.open');
				const len = !!elOpen ? elOpen.length : false;

				elWrap.removeAttribute('style');
				el_body.removeAttribute('style');
				elModal.dataset.n = null;

				if (!len) {
					elHtml.classList.remove('scroll-no');
					el_body.classList.remove('scroll-no');
				}

				(remove === 'true') ? elModal.remove() : elModal.classList.remove('ready');
				!!callback && callback(id);
				!!endfocus && endfocus.focus();

				elModal.removeEventListener('animationend', closeEnd);
			}

			elModal.addEventListener('animationend', closeEnd);

			// callbackClose && callbackClose();

			// clearTimeout(timer);
			// timer = setTimeout(function(){
			// 	const elWrap = elModal.querySelector('.ui-dialog-wrap');
			// 	const elOpen = document.querySelectorAll('.ui-dialog.open');
			// 	const len = !!elOpen ? elOpen.length : false;

			// 	elWrap.removeAttribute('style');
			// 	el_body.removeAttribute('style');
			// 	elModal.dataset.n = null;

			// 	if (!len) {
			// 		elHtml.classList.remove('scroll-no');
			// 		el_body.classList.remove('scroll-no');
			// 	}

			// 	(remove === 'true') ? elModal.remove() : elModal.classList.remove('ready');
			// 	!!callback && callback(id);
			// 	!!endfocus && endfocus.focus();

			// 	const sid = elModal.querySelector('.ui-dialog-body').dataset.scrollId;
			// 	!!sid && Global.scrollBar.destroy(sid);
			// },210);
		},
		hideSystem(opt) {
			Global.state.isSystemModal = false;
			Global.modal.hide({
				id: opt.id,
				type: 'system',
				remove: 'true'
			});
		}

	}
	
	/**
	 * TOAST POPUP
	 */
	Global.toast = {
		timer : null,
		/**
		 * options 
		 * delay: short[2s] | long[3.5s]
		 * status: assertive[중요도 높은 경우] | polite[중요도가 낮은 경우] | off[default]
		 */
		options : {
			delay: 'short',
			classname : '',
			conts: '',
			status: 'off' 
		},
		show (option) {
			const opt = Object.assign({}, this.options, option);
			const delay = opt.delay;
			const classname = opt.classname;
			const conts = opt.conts;
			const status = opt.status;
			const el_body = document.querySelector('body');
			let toast = '<div class="ui-toast toast '+ classname +'" aria-live="'+ status +'">'+ conts +'</div>';
			let time = (delay === 'short') ? 2000 : 3500;

			if (delay === 'short') {
				time = 2000;
			} else if(delay === 'long') {
				time = 3500;
			} else {
				time = delay;
			}

			const act = (e) => {
				const that = e.currentTarget;

				that.removeEventListener('transitionend', act);
				that.classList.add('on');
				Global.toast.timer = setTimeout(Global.toast.hide, time);
			}
			
			if (!!document.querySelector('.ui-toast-ready')) {
				clearTimeout(Global.toast.timer);
				el_body.classList.remove('ui-toast-show');
				el_body.classList.remove('ui-toast-ready');
				document.querySelector('.ui-toast').removeEventListener('transitionend', act);
				document.querySelector('.ui-toast').remove();
			} 

			el_body.insertAdjacentHTML('beforeend', toast);
			toast = null;
			
			const el_toast = document.querySelector('.ui-toast');
			
			el_body.classList.add('ui-toast-ready');

			
			setTimeout(() => {
				el_body.classList.add('ui-toast-show');
				el_toast.addEventListener('transitionend', act);
			},0);

			
		},
		hide () {
			const el_body = document.querySelector('body');
			const el_toast = document.querySelector('.ui-toast');
			const act = (e) => {
				const that = e.currentTarget;

				that.removeEventListener('transitionend', act);
				that.remove();
				el_body.classList.remove('ui-toast-ready');
			}
			if (!!el_toast) {
				clearTimeout(Global.toast.timer);
				el_body.classList.remove('ui-toast-show');
				el_toast.removeEventListener('transitionend', act);
				el_toast.addEventListener('transitionend', act);
			}
		}
	}

	/**
	 * TOOLTIP POPUP
	 * in use: Global.ajax, Global.loop
	 */
	Global.tooltip = {
		current: null,
		timerShow: null,
		timerHide: null,
		show (e){
			e.preventDefault();

			const elBody = document.querySelector('body');
			const el = e.currentTarget;
			const elId = el.getAttribute('aria-describedby');
			const elSrc = el.dataset.src;
			const view = el.dataset.view;
			const elTit = !!el.getAttribute('aria-label') ? el.getAttribute('aria-label') : el.textContent;
			const evType = e.type;
			let elTooltip = document.querySelector('#' + elId);

			const el_events = document.querySelectorAll('a, button');

			//툴팁 모바일에서 클릭, 하단 노출 건 확인필요
			const act = () => {
				elTooltip = document.querySelector('#' + elId);

				const tooltips = document.querySelectorAll('.ui-tooltip');
				const elArrow = elTooltip.querySelector('.ui-tooltip-arrow');
				const classToggle = evType !== 'click' ? 'add' : 'remove';

				if (evType === 'click') {
					Global.tooltip.current = elId;
					for (let that of el_events) {
						that.addEventListener('click', Global.tooltip.allHide);
					}
					for (let that of tooltips) {
						if (that.id !== elId) {
							// that.removeAttribute('style');
							document.querySelector('.ui-tooltip-btn[aria-describedby="'+that.id+'"]').dataset.view = 'unfix';
							that.classList.remove('fix');
							that.setAttribute('aria-hidden', true);
						} else {
							that.classList.add('fix');
							el.dataset.view = 'fix';
						}
					}
				} else {
					//hover
					for (let that of tooltips) {
						if (that.id !== elId) {
							that.classList.remove('hover');
						}
					}
				}

 				elTooltip.classList[classToggle]('hover');

				const elT = el.getBoundingClientRect().top;
				const elL = el.getBoundingClientRect().left;
				const elW = el.offsetWidth;
				const elH = el.offsetHeight;
				const wW = window.innerWidth;
				const wH = window.innerHeight;
				const dT = document.documentElement.scrollTop;
				const dL = document.documentElement.scrollLeft;
				const tW = Math.floor(elTooltip.offsetWidth);
				const left = (tW / 2 > (elL - dL) + (elW / 2)) ? 10 : elL - (tW / 2) + (elW / 2);
				wW < Math.floor(left) + tW ? elTooltip.style.right = '10px' : '';
				elTooltip.style.left = Math.floor(left) + 'px';

				const tH = Math.floor(elTooltip.offsetHeight);
				const top = (elT - dT > wH / 2) ? elT + dT - tH - 8 : elT + elH + dT + 8;
				elTooltip.style.top = Math.floor(top) + 'px';

				const arrow = (elT - dT > wH / 2) ? 'top' : 'bottom';
				elArrow.style.left = Math.floor(elL - left + (elW / 2)) + 'px';

				elTooltip.dataset.ps = arrow;
				elTooltip.setAttribute('aria-hidden', false);

				setTimeout(() => {
					if (evType === 'click') {
						Global.focus.loop({ selector: elTooltip });
						elTooltip.focus();
						elTooltip.querySelector('.ui-tooltip-close').addEventListener('click', Global.tooltip.hide);
					}
					Global.tooltip.current = null;
					
				}, 100);

				el.addEventListener('mouseleave', Global.tooltip.hide);
				Global.state.device.mobile && el.removeEventListener('mouseleave', Global.tooltip.hide);
			}

			//툴팁이 없다면 생성하기
			if (!!elSrc && !elTooltip) {	
				elBody.insertAdjacentHTML('beforeend', '<div class="ui-tooltip" id="'+ elId +'" role="tooltip" aria-hidden="true"><h3 class="ui-tooltip-tit">'+ elTit +'</h3><div class="ui-tooltip-arrow"></div></div>');

				Global.ajax.init({
					area: document.querySelector('#' + elId),
					url: elSrc,
					add: true,
					callback: () => {
						const _tooltip = document.querySelector('#' + elId);
						_tooltip.insertAdjacentHTML('beforeend', '<button type="button" class="ui-tooltip-close" data-id="'+ elId +'" aria-label="'+ elTit +' 닫기"></button>');
						
						act();
					}
				});
			} else {
				//열린툴팁 제외
				if (view !== 'fix') {
					const isTit = elTooltip.querySelector('.ui-tooltip-tit');
					const isClose = elTooltip.querySelector('.ui-tooltip-close');
					
					if (!isTit) {
						elTooltip.insertAdjacentHTML('beforeend', '<h3 class="ui-tooltip-tit">'+ elTit +'</h3>');
					}
					if (!isClose) {
						elTooltip.insertAdjacentHTML('afterbegin', '<button type="button" class="ui-tooltip-close" data-id="'+ elId +'" aria-label="'+ elTit +' 닫기"></button>');
					}
					act();
				}
			}
		},
		allHide () {
			const tooltips = document.querySelectorAll('.ui-tooltip');
			const tooltipBtns = document.querySelectorAll('.ui-tooltip-btn');
			const el_events = document.querySelectorAll('a, button');

			for (let that of tooltipBtns) {
				if (that.getAttribute('aria-describedby') !== Global.tooltip.current) {
					that.dataset.view = 'unfix';
				}
			}
			for (let that of tooltips) {
				if (that.id !== Global.tooltip.current) {
					that.classList.remove('hover');
					that.classList.remove('fix');
					that.setAttribute('aria-hidden', true);
				}
			}
			if (!Global.tooltip.current) {
				for (let that of el_events) {
					that.removeEventListener('click', Global.tooltip.allHide);
				}
			}
		},
		hide (e){
			e.preventDefault();
			
			const type = e.type;
			let el = e.currentTarget;
			let elId = el.getAttribute('aria-describedby');
			let isFocus = true;
			
			if (type === 'click' && isFocus) {
				elId = el.dataset.id;
			} 

			const elTooltip = document.querySelector('#' + elId);
			const elBtn = document.querySelector('.ui-tooltip-btn[aria-describedby="'+ elId +'"]');
			
			if (el.dataset.view !== 'fix') {
				elTooltip.classList.remove('hover');
				elTooltip.setAttribute('aria-hidden', true);
				// elTooltip.remove();
			} 
			if (type === 'click') {
				el.removeEventListener('click', Global.tooltip.hide);
				isFocus && elBtn.focus();
				elBtn.dataset.view = 'unfix';
			} 

			el.removeEventListener('blur', Global.tooltip.hide);
			el.removeEventListener('mouseleave', Global.tooltip.hide);
		},
		init () {
			const el_btn = document.querySelectorAll('.ui-tooltip-btn');

			for (let i = 0, len = el_btn.length; i < len; i++) {
				const that = el_btn[i];

				that.addEventListener('mouseover', Global.tooltip.show);
				that.addEventListener('click', Global.tooltip.show);
				Global.state.device.mobile && that.removeEventListener('mouseover', Global.tooltip.show);
			}
		}
	}
	/**
	 * FLOATING CONTENT
	 */
	Global.floating = {
		init () {
			const el_body = document.body;
			const el_items = document.querySelectorAll('.ui-floating');

			el_body.dataset.fixheight = 0;

			//setting
			for (let i = 0, len = el_items.length; i < len; i++) {
				const that = el_items[i];
				const fix = that.dataset.fix;
				const ps = that.dataset.ps;
				const el_wrap = that.querySelector('.ui-floating-wrap');
				const mg = Number(that.dataset.mg === undefined || that.dataset.mg === null ? 0 : that.dataset.mg);
				const elH = el_wrap.offsetHeight;
				const elT = that.getBoundingClientRect().top;
				const wH = window.innerHeight;

				that.style.height = elH + 'px';

				if (fix === 'true') {
					//고정으로 시작
					that.dataset.state = 'fix';
					if (ps === 'top') {
						if (elT >= 0 + mg && fix === 'true') {
							el_wrap.style.marginTop = mg + 'px';
						} else {
							that.dataset.state = 'normal';
						}
					} else {
						if ((elT - wH) + elH + mg >= 0 && fix === 'true') {
							el_wrap.style.transform = 'translateY(-' + mg + 'px)';
						} else {
							that.dataset.state = 'normal';
						}
					}
				} else {
					that.dataset.state = 'normal';
				}
			}

			window.removeEventListener('scroll', this.scrollAct);
			window.addEventListener('scroll', this.scrollAct);
		},
		scrollAct () {
			const elBody = document.body;
			const el_items = document.querySelectorAll('.ui-floating');
			
			for (let i = 0, len = el_items.length; i < len; i++) {
				const that = el_items[i];
				const fix = that.dataset.fix;
				const ps = that.dataset.ps;
				const state = that.dataset.state;
				const el_wrap = that.querySelector('.ui-floating-wrap');
				const mg = Number(that.dataset.mg === undefined || that.dataset.mg === null ? 0 : that.dataset.mg);
				const elH = el_wrap.offsetHeight;
				const elT = that.getBoundingClientRect().top;
				const wH = window.innerHeight;

				if (state === 'fix') {
					if (ps === 'top') {
						//현재 상단고정상태
						if (elT <= 0 + mg && fix === 'true') {
							that.dataset.state = 'normal';
							el_wrap.style.marginTop = 0;
						}
						if (elT >= 0 + mg && fix === 'false') {
							that.dataset.state = 'normal';
							el_wrap.style.marginTop = 0;
						}
					} else {
						//현재 하단고정상태
						if ((elT - wH) + elH + mg <= 0 && fix === 'true') {
							that.dataset.state = 'normal';
							el_wrap.style.transform = 'translateY(0)';
						}
						if ((elT - wH) + elH + mg >= 0 && fix === 'false') {
							that.dataset.state = 'normal';
							el_wrap.style.transform = 'translateY(0)';
						}
					}
				} else {
					if (ps === 'top') {
						//현재 상단고정상태
						if (elT >= 0 + mg && fix === 'true') {
							that.dataset.state = 'fix';
							el_wrap.style.marginTop = mg + 'px';
						}
						if (elT <= 0 + mg && fix === 'false') {
							that.dataset.state = 'fix';
							el_wrap.style.marginTop = mg + 'px';
						}
						
					} else {
						//현재 하단고정상태
						if ((elT - wH) + elH + mg >= 0 && fix === 'true') {
							that.dataset.state = 'fix';
							el_wrap.style.transform = 'translateY(-' + mg + 'px)';
						}
						if ((elT - wH) + elH + mg <= 0 && fix === 'false') {
							that.dataset.state = 'fix';
							el_wrap.style.transform = 'translateY(-' + mg + 'px)';
						}
					}
				}
			}
		},
		range () {
			const el_ranges = document.querySelectorAll('.ui-floating-range');
			const act = () => {
				for (let i = 0, len = el_ranges.length; i < len; i++) {
					const that = el_ranges[i];
					const el_item = that.querySelector('.ui-floating-range-item');
					const mg = Number(that.dataset.mg === undefined || that.dataset.mg === null ? 0 : that.dataset.mg);
					const itemH = el_item.offsetHeight;
					const wrapT = that.getBoundingClientRect().top;
					const wrapH = that.offsetHeight;
					const wT = window.pageYOffset;
					let top = mg;

					if (wT > (wrapT + wT - mg)) {
						if (wrapH - itemH >= wT - (wrapT + wT - mg)) {
							top = mg > (wT - (wrapT + wT - mg)).toFixed(0) ? mg : (wT - (wrapT + wT - mg)).toFixed(0);
							el_item.style.transform = 'translate(0, '+ top +'px)';
						}
					} else {
						top = mg;
						el_item.style.transform = 'translate(0, '+ top +'px)';
					}
				}
			}
			window.removeEventListener('scroll', act);
			window.addEventListener('scroll', act);
		}
	}

	/**
	 * TAB
	 * in use: Global.state, Global.para, Global.scroll, Global.ajax
	 */
	Global.tab = {
		data: {},
		options: {
			current: 0,
			dynamic: false,
			callback: false,
			align : 'center' // ' || 'center'
		},
		init (option) {
			const opt = Object.assign({}, this.options, option);
			const id = opt.id;
			const dynamic = opt.dynamic;
			const callback = opt.callback;
			const align = opt.align;
			const el_tab = document.querySelector('.ui-tab[data-id="' + id + '"]');

			let current = isNaN(opt.current) ? 0 : opt.current;

			const el_btnwrap = el_tab.querySelector('.ui-tab-btns');
			const el_wrap = el_btnwrap.querySelector('.wrap-group');
			const el_btns = el_btnwrap.querySelectorAll('.ui-tab-btn');
			const el_pnlwrap = el_tab.querySelector('.ui-tab-pnls');
			const el_pnls = el_pnlwrap.querySelectorAll('.ui-tab-pnl');
			const keys = Global.state.keys;
			const para = Global.para.get('tab');

			let paras;
			let paraname;

			//set up
			if (!!para) {
				if (para.split('+').length > 1) {
					//2 or more : tab=exeAcco1*2+exeAcco2*3
					paras = para.split('+');

					for (let j = 0; j < paras.length; j++ ) {
						paraname = paras[j].split('*');
						opt.id === paraname[0] ? current = Number(paraname[1]) : '';
					}
				} else {
					//only one : tab=1
					if (para.split('*').length > 1) {
						paraname = para.split('*');
						opt.id === paraname[0] ? current = Number(paraname[1]) : '';
					} else {
						current = Number(para);
					}
				}
			}

			//setting
			el_btnwrap.setAttribute('role','tablist');
			Global.tab.data[id] = {
				id: id,
				current: 0,
				dynamic: dynamic,
				callback: callback,
				align : align
			};

			for (let i = 0, len = el_btns.length; i < len; i++) {
				const el_btn = el_btns[i];

				el_btn.setAttribute('role','tab');
				el_btn.setAttribute('aria-selected','false');

				if (!el_btn.dataset.tab) {
					el_btn.dataset.tab = i;
				}

				el_btn.dataset.len = len;

				const n = Number(el_btn.dataset.tab);
				const isCurrent = Number(current) === n;
				const cls = isCurrent ? 'add' : 'remove';
				
				if (!el_btn.id) {
					el_btn.id = id + '_btn_' + n;
				} 

				const el_pnl = el_pnlwrap.querySelector('.ui-tab-pnl[data-tab="'+ n +'"]');

				if (!dynamic) {
					el_pnl.setAttribute('role','tabpanel');
					// el_pnl.setAttribute('tabindex','0');

					if (!el_pnl.dataset.tab) {
						el_pnl.dataset.tab = i;
					}
					if (!el_pnl.id) {
						el_pnl.id = id + '_pnl_' + n;
					} 
				} else {
					el_pnls[0].setAttribute('role','tabpanel');
					// el_pnls[0].setAttribute('tabindex','0');
					el_pnls[0].dataset.tab = current;
					el_pnls[0].id = id + '_pnl';
				}
  
				const btnId = el_btn.id;
				const pnlId = !dynamic ? el_pnl.id : el_pnls[0].id;

				el_btn.setAttribute('aria-controls', pnlId);
				el_btn.classList[cls]('selected');
				el_btn.setAttribute('aria-selected', !!isCurrent ? true : false);

				if (!dynamic) {
					el_pnl.setAttribute('aria-labelledby', btnId);

					if ((Number(current) === Number(el_pnl.dataset.tab))) {
						el_pnl.setAttribute('aria-hidden', false);
						el_pnl.classList.add('selected');
					} else {
						el_pnl.setAttribute('aria-hidden', true);
						el_pnl.classList.remove('selected');
					}
				} else {
					el_pnls[0].setAttribute('aria-labelledby', btnId);
					el_pnls[0].setAttribute('aria-hidden', false);
					el_pnls[0].classList[cls]('selected');
				}

				i === 0 && el_btn.setAttribute('tab-first', true);
				i === len - 1 && el_btn.setAttribute('tab-last', true);

				const btnCallbak = el_btn.dataset.callback;

				Global.tab.data[id][btnId] = {
					callback: btnCallbak,
				}

				if (isCurrent) {
					Global.scroll.move({ 
						selector: el_btnwrap, 
						left: el_btn.getBoundingClientRect().left + el_btnwrap.scrollLeft, 
						add : 0,
						align: align 
					});
					!!Global.tab.data[id][btnId].callback && Global.callback[Global.tab.data[id][btnId].callback]({
						id: id,
						btnId: btnId,
						pnlId: pnlId,
					});
				}

				el_btn.removeEventListener('click', Global.tab.evtClick);
				el_btn.removeEventListener('keydown',  Global.tab.evtKeys);
				el_btn.addEventListener('click',  Global.tab.evtClick);
				el_btn.addEventListener('keydown',  Global.tab.evtKeys);
			}

			callback && callback(opt);
		},
		evtClick (e) {
			const that = e.currentTarget;
			const id = that.closest('.ui-tab').dataset.id;

			Global.tab.toggle({ 
				id: Global.tab.data[id].id, 
				current: Number(e.currentTarget.dataset.tab), 
				align: Global.tab.data[id].align,
				dynamic: Global.tab.data[id].dynamic,
				callback: Global.tab.data[id].callback
			}); 
		},
		evtKeys (e) {
			const that = e.currentTarget;
			const id = that.closest('.ui-tab').dataset.id;
			const n = Number(that.dataset.tab);
			const m = Number(that.dataset.len);
			const keyEvent = (v) => {
				Global.tab.toggle({ 
					id: Global.tab.data[id].id, 
					current: v, 
					align: Global.tab.data[id].align,
					dynamic: Global.tab.data[id].dynamic,
					callback: Global.tab.data[id].callback 
				});
			}
			const upLeftKey = (e) => {
				e.preventDefault();
				keyEvent(!that.getAttribute('tab-first') ? n - 1 : m - 1);
			}
			const downRightKey = (e) => {
				e.preventDefault();
				keyEvent(!that.getAttribute('tab-last') ? n + 1 : 0);
			}
			const endKey = (e) => {
				e.preventDefault();
				keyEvent(m - 1);
			}
			const homeKey = (e) => {
				e.preventDefault();
				keyEvent(0);
			}

			switch(e.keyCode){
				case Global.state.keys.up: 
				case Global.state.keys.left: upLeftKey(e);
					break;

				case Global.state.keys.down: 
				case Global.state.keys.right: downRightKey(e);
					break;

				case Global.state.keys.end: endKey(e);
					break;

				case Global.state.keys.home: homeKey(e);
					break;
			}
		},
		toggle (option) {
			const opt = Object.assign({}, this.options, option);
			const id = opt.id;
			const callback = opt.callback;
			const el_tab = document.querySelector('.ui-tab[data-id="' + id + '"]');
			const el_btnwrap = el_tab.querySelector('.ui-tab-btns');
			const el_btn = el_btnwrap.querySelectorAll('.ui-tab-btn');
			const el_pnlwrap = el_tab.querySelector('.ui-tab-pnls');
			const el_pnls = el_pnlwrap.querySelectorAll('.ui-tab-pnl');
			const current = isNaN(opt.current) ? 0 : opt.current;
			const dynamic = opt.dynamic;
			const align = opt.align;
			const el_current = el_btnwrap.querySelector('.ui-tab-btn[data-tab="'+ current +'"]');
			const el_pnlcurrent = el_pnlwrap.querySelector('.ui-tab-pnl[data-tab="'+ current +'"]');
			const btnId = el_current.id;
			const pnlId = !!el_pnlcurrent ? el_pnlcurrent.id : id + '_pnl';
			let el_scroll = el_btnwrap.querySelector('.ui-scrollbar-item');

			for (let i = 0, len = el_btn.length; i < len; i++) {
				const that = el_btn[i];
				that.classList.remove('selected');
				that.setAttribute('aria-selected', false);
			}
			
			el_current.setAttribute('aria-selected', true);
			el_current.classList.add('selected')
			el_current.focus();

			if (!el_scroll) {
				el_scroll = el_btnwrap;
			}

			Global.scroll.move({ 
				selector: el_btnwrap, 
				left: el_current.getBoundingClientRect().left + el_scroll.scrollLeft, 
				add : 0,
				align: align 
			});

			if (!dynamic) {
				for (let i = 0, len = el_pnls.length; i < len; i++) {
					const that = el_pnls[i];
					that.setAttribute('aria-hidden', true);
					that.classList.remove('selected');
				}
				
				el_pnlcurrent.classList.add('selected');
				el_pnlcurrent.setAttribute('aria-hidden', false);
			} else {
				el_pnls[0].setAttribute('aria-hidden', false);
				el_pnls[0].setAttribute('aria-labelledby', btnId);
			}

			const btncallback = Global.tab.data[id][btnId].callback;

			!!btncallback && Global.callback[btncallback]({
				id: id,
				btnId: btnId,
				pnlId: pnlId,
			});

			callback && callback(opt);
		}
	}

	/**
	 * PARALLAX SCROLL
	 * in use: Global.callback
	 */
	Global.parallax = {
		optionsParllax: {
			selector : null,
			area : null
		},
		init(option) {
			const opt = Object.assign({}, this.optionsParllax, option);
			//const opt = {...this.optionsParllax, ...option};
			const el_area = (opt.area === undefined || opt.area === null) ? window : opt.area;
			//Nullish coalescing operator
			//const el_area = opt.area ?? window;
			const el_parallax = (opt.selector === undefined || opt.selector === null) ? document.querySelector('.ui-parallax') : opt.selector;
			//const el_parallax = opt.selector ?? document.querySelector('.ui-parallax');

			//:scope >
			const el_wraps = el_parallax.querySelectorAll('.ui-parallax-wrap');
			const act = () => {
				const isWin = el_area === window;
				const areaH = isWin ? window.innerHeight : el_area.offsetHeight;

				for (let i = 0, len = el_wraps.length; i < len; i++) {
					const that = el_wraps[i];
					const callbackname = that.dataset.act;
					const h = Math.floor(that.offsetHeight);

					let start = Math.floor(that.getBoundingClientRect().top) - areaH;
					let _n = 0;
					let _per_s = 0;
					let _per_e = 0;

					if (start < 0 )  {
						_n = Math.abs(start);
						_per_s = Math.round(_n / areaH * 100);
						_per_s = _per_s >= 100 ? 100 : _per_s;
					} else {
						_n = 0;
						_per_s = 0;
					}

					if (start + areaH < 0 )  {
						_n = Math.abs(start + areaH);
						_per_e = Math.round(_n / h  * 100);
						_per_e = _per_e >= 100 ? 100 : _per_e;
					} else {
						_n = 0;
						_per_e = 0;
					}

					that.setAttribute('data-parallax-s', _per_s);
					that.setAttribute('data-parallax-e', _per_e);

					if (!!Global.callback[callbackname]) {
						Global.callback[callbackname]({
							el: that, 
							px: _n,
							per_s: _per_s,
							per_e: _per_e
						});
					}
				} 
			}
			
			act();
			el_area.addEventListener('scroll', act);
		}
	}




	/**
	 * CODING LIST
	 * in use: Global.ajax
	 */
	Global.project = {
		list(opt){
			// fetch(opt.url)
			// .then((response) => response.json())
			// .then((data) => callback(data));
			// function callback(v) {
			const callback = (v) => {
				const dataExecel = JSON.parse(v); 
				let today = new Date();

				const getFormatDate = (date) => {
					const year = date.getFullYear();
					let month = (1 + date.getMonth());
					let day = date.getDate();

					month = month >= 10 ? month : '0' + month;
					day = day >= 10 ? day : '0' + day;

					return  year + '-' + month + '-' + day;
				}
				const changeFormatDate = (date) => {
					const year = date.substring(0,4);
					let month = date.substring(4,6); 
					let day = date.substring(6,8);
					month = month >= 10 ? month : '0' + month;
					day = day >= 10 ? day : '0' + day; 

					return year + '-' + month + '-' + day; 
				}
				const dateDiff = (...arg) => {
					const _date1 = arg[0];
					const _date2 = arg[1];

					let diffDate_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
					let diffDate_2 = _date2 instanceof Date ? _date2 : new Date(_date2);

					diffDate_1 = new Date(diffDate_1.getFullYear(), diffDate_1.getMonth()+1, diffDate_1.getDate());
					diffDate_2 = new Date(diffDate_2.getFullYear(), diffDate_2.getMonth()+1, diffDate_2.getDate());

					const gt1 = diffDate_1.getTime();
					const gt2 = diffDate_2.getTime();

					return gt2 - gt1 < 0 ? '' : '-' + Math.ceil(Math.abs(gt2 - gt1) / (1000 * 3600 * 24));
				}

				today = getFormatDate(today); 

				let state, date, wdate, mod, pub, pln, des, dev, id, name, type, memo, overl;
				let d1, d2, d3, d4, d5, d6, d7, d8, d9, d10;
				let r1, r2, r3, r4;
				let d1_, d2_, d3_, d4_, d5_, d6_, d7_, d8_, d9_, d10_;
				let	endsum = 0, 
					delsum = 0, 
					watsum = 0, 
					num = -1,
					ctg_state = [],
					ctg_pub = [],
					ctg_dev = [],
					ctg_date = [],
					ctg_wdate = [],
					ctg_menu = [],
					cls2 = '',
					cls = '',
					root = '',
					table = '';

				const dataExecelList = dataExecel.list;
				const len = dataExecelList.length

				for (let i = 0; i < len; i++) {
					const dataCurrent = dataExecelList[i];

					state = dataCurrent.state || '';
					date = dataCurrent.date || '';
					wdate = dataCurrent.wdate || '';
					mod = dataCurrent.mod || '';
					pub = dataCurrent.pub || '';
					pln = dataCurrent.pln || '';
					des = dataCurrent.des || '';
					dev = dataCurrent.dev || '';
					type = dataCurrent.type || '';
					id = dataCurrent.id || '';
					name = dataCurrent.name || '';
					memo = dataCurrent.memo || '';

					d1 = dataCurrent.d1 || '';
					d2 = dataCurrent.d2 || '';
					d3 = dataCurrent.d3 || '';
					d4 = dataCurrent.d4 || '';
					d5 = dataCurrent.d5 || '';
					d6 = dataCurrent.d6 || '';
					d7 = dataCurrent.d7 || '';
					d8 = dataCurrent.d8 || '';
					d9 = dataCurrent.d9 || '';
					d10 = dataCurrent.d10 || '';

					r1 = dataCurrent.r1 || '';
					r2 = dataCurrent.r2 || '';
					r3 = dataCurrent.r3 || '';
					r4 = dataCurrent.r4 || '';
					overl = dataCurrent.overlap || '';
					root = dataCurrent.root || '';

					let list_n = (i - 1 < 0) ? 0 : i;

					(d1 !== '') ? d1_ = dataExecelList[list_n].d1 : d1 = d1_;

					if (dataCurrent.d1 === '') {
						(d2 !== '') ? d2_ = dataExecelList[list_n].d2 : d2 = d2_;

						if (dataCurrent.d2 === '') {
							(d3 !== '') ? d3_ = dataExecelList[list_n].d3 : d3 = d3_;

							if (dataCurrent.d3 === '') {
								(d4 !== '') ? d4_ = dataExecelList[list_n].d4 : d4 = d4_;

								if (dataCurrent.d4 === '') {
									(d5 !== '') ? d5_ = dataExecelList[list_n].d5 : d5 = d5_;

									if (dataCurrent.d5 === '') {
										(d6 !== '') ? d6_ = dataExecelList[list_n].d6 : d6 = d6_;

										if (dataCurrent.d6 === '') {
											(d7 !== '') ? d7_ = dataExecelList[list_n].d7 : d7 = d7_;

											if (dataCurrent.d7 === '') {
												(d8 !== '') ? d8_ = dataExecelList[list_n].d8 : d8 = d8_;

												if (dataCurrent.d8 === '') {
													(d9 !== '') ? d9_ = dataExecelList[list_n].d9 : d9 = d9_;

													if (dataCurrent.d9 === '') {
														(d10 !== '') ? d10_ = dataExecelList[list_n].d10 : d10 = d10_;
													} else {
														(!!dataExecelList[list_n].d10) ? d10_ = dataExecelList[list_n].d10 : d10_ = '';
													}

												} else {
													(!!dataExecelList[list_n].d9) ? d9_ = dataExecelList[list_n].d9 : d9_ = '';
												}
											} else {
												(!!dataExecelList[list_n].d8) ? d8_ = dataExecelList[list_n].d8 : d8_ = '';
											}
										} else {
											(!!dataExecelList[list_n].d7) ? d7_ = dataExecelList[list_n].d7 : d7_ = '';
										}
									} else {
										(!!dataExecelList[list_n].d6) ? d6_ = dataExecelList[list_n].d6 : d6_ = '';
									}
								} else {
									(!!dataExecelList[list_n].d5) ? d5_ = dataExecelList[list_n].d5 : d5_ = '';
								}
							} else {
								(!!dataExecelList[list_n].d4) ? d4_ = dataExecelList[list_n].d4 : d4_ = '';
							}
						} else {
							(!!dataExecelList[list_n].d3) ? d3_ = dataExecelList[list_n].d3 : d3_ = '';
						}
					} else {
						(!!dataExecelList[list_n].d2) ? d2_ = dataExecelList[list_n].d2 : d2_ = '';
					}
					
					!!dataCurrent.d1 ? d1 = dataCurrent.d1 : '';
					!!dataCurrent.d2 ? d2 = dataCurrent.d2 : '';
					!!dataCurrent.d3 ? d3 = dataCurrent.d3 : '';
					!!dataCurrent.d4 ? d4 = dataCurrent.d4 : '';
					!!dataCurrent.d5 ? d5 = dataCurrent.d5 : '';
					!!dataCurrent.d6 ? d6 = dataCurrent.d6 : '';
					!!dataCurrent.d7 ? d7 = dataCurrent.d7 : '';
					!!dataCurrent.d8 ? d8 = dataCurrent.d8 : '';
					!!dataCurrent.d9 ? d9 = dataCurrent.d9 : '';
					!!dataCurrent.d10 ? d10 = dataCurrent.d10 : '';

					endsum = (state === "완료") ? endsum + 1 : endsum;
					// tstsum = (state === "검수") ? tstsum + 1 : tstsum;
					delsum = (state === "제외") ? delsum + 1 : delsum;
					watsum = (state === "대기") ? watsum + 1 : watsum;

					const x = (i === 0) ? 0 : i - 1;
					let depthChange = false;

					const depthClass = (v) => {
						if (dataCurrent['d' + v] !== dataExecelList[x]['d' + v]) {
							dataCurrent['c' + v] = ' c' + v
							depthChange = true;
						} else {
							dataCurrent['c' + v] = depthChange ? ' c' + v : '';
						}
					}

					for (let j = 0; j < 10; j++) {
						depthClass(j + 1);
					}

					cls2 = 
						state === '완료' ? 'end' : 
						state === '제외' ? 'del' : 
						state === '약관' ? 'trm' : '';

					cls = cls2 + dataCurrent.c1 + dataCurrent.c2 + dataCurrent.c3 + dataCurrent.c4 + dataCurrent.c5 + dataCurrent.c6 + dataCurrent.c7 + dataCurrent.c8 + dataCurrent.c9 + dataCurrent.c10;

					ctg_state.push(dataCurrent.state);
					ctg_pub.push(dataCurrent.pub);
					ctg_dev.push(dataCurrent.dev);
					state !== '제외' ? ctg_date.push(dataCurrent.date) : '';
					ctg_wdate.push(dataCurrent.wdate);
					ctg_menu.push(dataCurrent.d2);

					if (i === 0) {
						table += '<div class="tbl-base">';
						table += '<table>';
						table += '<caption>코딩리스트</caption>';
						table += '<thead>';
						table += '<th scope="col">' + state + '</th>';
						table += '<th scope="col">' + date + '</th>';
						table += '<th scope="col">' + wdate + '</th>';
						table += '<th scope="col">' + mod + '</th>';
						table += '<th scope="col">' + pub + '<button type="button" class="btn-base small icon-only no-line" data-material="last_page" id="nameToggle"></button></th>';
						table += '<th scope="col" class="name-tg">' + pln + '</th>';
						table += '<th scope="col" class="name-tg">' + des + '</th>';
						table += '<th scope="col" class="name-tg">' + dev + '</th>';
						table += '<th scope="col">' + type + '</th>';
						table += '<th scope="col">' + name + '</th>';
						table += '<th scope="col">' + d1 + '</th>';
						table += '<th scope="col">' + d2 + '</th>';
						table += '<th scope="col">' + d3 + '</th>';
						table += '<th scope="col">' + d4 + '</th>';
						table += '<th scope="col">' + d5 + '</th>';
						table += '<th scope="col">' + d6 + '</th>';
						table += '<th scope="col">' + d7 + '</th>';
						table += '<th scope="col">' + d8 + '</th>';
						table += '<th scope="col">' + d9 + '</th>';
						table += '<th scope="col">' + d10 + '</th>';
						table += '<th scope="col">' + memo + '</th>';
						table += '</thead>';
						table += '</tbody>';
					} else  {
						num = num + 1;

						if (!(date === '미정' || date === '일정' || date === undefined) && state !== '완료') {
							let dateStart = date;

							dateStart = changeFormatDate(dateStart)
							const care = dateDiff(dateStart, new Date());
							
							if (care < 3 && care >= 0) {
								cls = cls + ' sch_care';//일정경고
							} else if (care < 0) {
								cls = cls + ' sch_warn';//일정위험
							}
						}

						if (!(wdate === '미정' || wdate === '작업일' || date === undefined) && state === '완료') {
							let dateStart = wdate;
							
							dateStart = changeFormatDate(dateStart)
							const todayModify = dateDiff(dateStart, new Date());
							
							if (Number(todayModify) === 0) {
								cls = cls + ' today-mod';
							} 
						}

						table += '<tr class="'+ cls +'" data-id="'+id+'" data-pub="'+ pub +'" data-state="'+ state +'">';
						table += '<td class="state" ><span>' + state + '</span></td>';
						table += '<td class="date"><span>' + date.substring(4,10) + '</span></td>';
						table += '<td class="date"><span>' + wdate.substring(4,10) + '</span></td>';
						table += '<td class="mod"><span>' + mod + '</span></td>';
						table += '<td class="name" ><span>' + pub + '</span></td>';
						table += '<td class="name name-tg"><span>' + pln + '</span></td>';
						table += '<td class="name name-tg"><span>' + des + '</span></td>';
						table += '<td class="name name-tg"><span>' + dev + '</span></td>';
						table += '<td class="type-'+ type +'"><span>' + type + '</span></td>';
						table += name !== '' ?
							'<td class="id ico_pg"><span><a class="ui-coding-link" href="' + (root + name) + '.html" target="coding">' + name + '</a> ('+ id +')</span></td>' :
							'<td class="id "><span></span></td>';	
						table += '<td class="d d1"><span>' + d1 + '</span></td>';
						table += '<td class="d d2"><span>' + d2 + '</span></td>';
						table += '<td class="d d3"><span>' + d3 + '</span></td>';
						table += '<td class="d d4"><span>' + d4 + '</span></td>';
						table += '<td class="d d5"><span>' + d5 + '</span></td>';
						table += '<td class="d d6"><span>' + d6 + '</span></td>';
						table += '<td class="d d7"><span>' + d7 + '</span></td>';
						table += '<td class="d d8"><span>' + d8 + '</span></td>';
						table += '<td class="d d9"><span>' + d9 + '</span></td>';
						table += '<td class="d d10"><span>' + d10 + '</span></td>';
						table += '<td class="memo"><span>' + memo + '</span></td>';
						table += '</tr>';
						(i === len - 1) ? table += '</tbody>' : '';
						(i === len - 1) ? table += '</table>' : '';
					}
					table += '</div>';
					root = '';
				}

				const codinglist = document.querySelector('#' + opt.id);

				codinglist.innerHTML = table;
				table = '';

				//head
				let info = '<div class="ui-codinglist-header">';
				info += '<div class="ui-codinglist-state"><dl><dt>'+ today +'</dt><dd>'
				info += '<ul class="ui-codinglist-info">';
				info += '<li><b class="target">전체</b> 진행율 : <span class="n_all">0</span> / <span class="total">0</span> (<span class="per0">0</span>%)</li>';
				info += '</ul></dd></dl><span class="bar"><span></div>';
				info += '<div class="box-srch mt-x1">';
				info += '<div class="srch-area">';
				info += '<div class="ui-select mr-x1" style="width:290px"><select title="상태" id="arstate">';

				const arstate = Array.from(new Set(ctg_state));
				for (let i = 0; i < arstate.length; i++) {
					if (i === 0) {
						info += '<option value="전체">All State</option>';
					} else {
						info += '<option value="'+ arstate[i] +'">'+ arstate[i] +'</option>';
					}
				}

				info += '</select></div>';
				info += '<div class="ui-select mr-x1" style="width:290px"><select title="작업담당자" id="pubWorker">';

				const pubworker = Array.from(new Set(ctg_pub));
				for (let i = 0; i < pubworker.length; i++) {
					if (i === 0) {
						info += '<option value="전체">All Worker</option>';
					} else {
						info += '<option value="'+ pubworker[i] +'">'+ pubworker[i] +'</option>';
					}
				}

				info += '</select></div>';
				info += '<input type="search" id="projectListSrchCode" class="inp-base ui-inpcancel mr-x1" value="" placeholder="검색어를 입력해주세요.">';
				info += '<button type="button" id="projectListSrchBtn" class="btn-base"><span>검색</span></button>';
				info += '</div>';
				info += '</div>';
				codinglist.insertAdjacentHTML('afterbegin', info);
				
				const links = document.querySelectorAll('.ui-coding-link');
				for (let i = 0; i < links.length; i++) {
					links[i].addEventListener('click', (e) => {
						const that = e.currentTarget;
						const parentWrap = that.closest('tr');
						
						sessionStorage.setItem('codinglist', parentWrap.dataset.id);

						const sId = sessionStorage.getItem('codinglist');
						if (!!document.querySelector('.ui-codinglist tr.on')) {
							document.querySelector('.ui-codinglist tr.on').classList.remove('on');
						}
						document.querySelector('[data-id="'+ sId +'"]').classList.add('on');
					});
				}

				document.querySelector('#pubWorker').addEventListener('change', (e) => {
					const that = e.currentTarget;

					if (that.value === '전체') {
						document.querySelector('.ui-codinglist').removeAttribute('data-pub');
						perSet(len, endsum, delsum);
					} else {
						document.querySelector('.ui-codinglist').dataset.pub = that.value;
						

					}

					const pubs = document.querySelectorAll('tr[data-pub="'+ that.value+'"]');
					const pubs_end = document.querySelectorAll('tr[data-pub="'+ that.value+'"][data-state="완료"]');
					const pubs_del = document.querySelectorAll('tr[data-pub="'+ that.value+'"][data-state="제외"]');
					const trs = document.querySelectorAll('tr');
					trs.forEach(function(tr){
						tr.classList.remove('worker-view');
					});
					pubs.forEach(function(pub){
						pub.classList.add('worker-view');
					});

					document.querySelector('.ui-codinglist-info .target').textContent = that.value;

					if (that.value === '전체') {
						perSet(len, endsum, delsum);
					} else {
						const target_len = pubs.length;
						const target_endsum = pubs_end.length;
						const target_delsum = pubs_del.length;
						
						perSet(target_len, target_endsum, target_delsum);
					}
				});

				document.querySelector('#arstate').addEventListener('change', (e) => {
					const that = e.currentTarget;

					if (that.value === '전체') {
						document.querySelector('.ui-codinglist').removeAttribute('data-state');
					} else {
						document.querySelector('.ui-codinglist').dataset.state = that.value;
					}

					const pubs = document.querySelectorAll('tr[data-state="'+ that.value+'"]');
					const trs = document.querySelectorAll('tr');

					trs.forEach((tr) => {
						tr.classList.remove('state-view');
					});
					pubs.forEach((pub) => {
						pub.classList.add('state-view');
					});
				});

				document.querySelector('#nameToggle').addEventListener('click', () => {
					document.querySelector('.ui-codinglist').classList.toggle('name-toggle-view');
				});

				const el_info = document.querySelector('.ui-codinglist-info');
				const el_total = el_info.querySelector('.total');
				const el_all = el_info.querySelector('.n_all');
				const el_per0 = el_info.querySelector('.per0');
				const el_bar = document.querySelector('.ui-codinglist-state .bar');
				const srchCode = document.querySelector('#projectListSrchCode');
				const srchBtn = document.querySelector('#projectListSrchBtn');

				const perSet = (len, endsum, delsum) => {
					const _len = len; 
					const _endsum = endsum; 
					const _delsum = delsum;
					
					el_total.textContent = (_len - _delsum - 1);
					el_all.textContent = _endsum;
					el_per0.textContent = (_endsum / (_len - _delsum - 1) * 100).toFixed(0);
					el_bar.style.width = (_endsum / (_len - _delsum - 1) * 100).toFixed(0) + '%';
				}
				const srchAct = () => {
					const k = srchCode.value;
					const el = document.querySelector('.ui-codinglist tbody');
					const el_td = el.querySelectorAll('td');
					const el_tr = el.querySelectorAll('tr');

					for (let i = 0, len = el_tr.length; i < len; i++) {
						const that = el_tr[i];
						that.classList.add('srch-hidden');
					}

					for (let i = 0, len = el_td.length; i < len; i++) {
						const that = el_td[i];
						const text = that.textContent;
						const el_tr2 = that.closest('tr');

						if (text.indexOf(k) >= 0) {							
							el_tr2.classList.remove('srch-hidden');
						} 
					}
				}

				perSet(len, endsum, delsum);

				if (srchCode.value !== '') {

					var temp = $('.ui-codinglist tbody tr td *:contains('+ $('#projectListSrchCode').val() +')');

					$('.ui-codinglist tbody tr').hide();
					$(temp).closest('tr').show();
				}

				srchBtn.addEventListener('click', srchAct);
				srchCode.addEventListener('keyup', () => {
					if (window.event.keyCode === 13) {
						srchAct();
					}
				});
			}

			Global.ajax.init({
				area: document.querySelector('#' + opt.id),
				url: opt.url, 
				page: false, 
				callback: callback 
			});
		}
	}

	/* 작업필요 */
	Global.draggable = {
		init: function(opt) {
			var $wrap = $('#' + opt.id);
			var $item = $wrap.find('.ui-draggable-item');
			var $area = $wrap.find('.ui-draggable-area');
			var scale = 1;
			var $svg = $wrap.find('svg');
			
			//기본값 세팅
			$(window).off('resize.aaa').on('resize.aaa', function(){
				set();
			});
			set();
			function set(){
				scale =1;
				$item.each(function(i){
					var $this = $(this);
					
					$this.addClass('original');
					$this.attr('orgt', $this.offset().top / scale - ($wrap.offset().top / scale));
					$this.attr('orgl', $this.offset().left / scale - ($wrap.offset().left / scale));
					
					if (!$this.attr('onlymove')) {
						$this.after($this.clone().removeClass('original').addClass('clone').prop('disabled', true));
					}
					if (!!$this.attr('line')) {
						var nm = $this.attr('name');
						var strokWidth = 4 / scale;
						var lineX = Number($this.attr('orgl')) + ($this.outerWidth() / 2 / scale ) - strokWidth / 2;
						var lineY = Number($this.attr('orgt')) + ($this.outerHeight() / 2 / scale ) - strokWidth / 2;

						$this.attr('linex', lineX);
						$this.attr('liney', lineY);
						$svg.find('line[name="'+ nm +'"]')
							.attr('x1', lineX)
							.attr('y1', lineY)
							.attr('x2', lineX)
							.attr('y2', lineY)
							.attr('stroke-width', strokWidth);
					}
				});

				$wrap.attr('ts',$wrap.offset().top / scale);
				$wrap.attr('te',$wrap.offset().top / scale + $wrap.outerHeight() / scale);
				$wrap.attr('ls',$wrap.offset().left / scale);
				$wrap.attr('le',$wrap.offset().left / scale + $wrap.outerWidth() / scale);

				$area.each(function(i){
					scale = 1;
					var $this = $(this);

					$this.attr('ts',$this.offset().top / scale);
					$this.attr('te',$this.offset().top / scale + $this.outerHeight() / scale);
					$this.attr('ls',$this.offset().left / scale);
					$this.attr('le',$this.offset().left / scale + $this.outerWidth() / scale);
				});

				$item.off('mousedown.drag').on('mousedown.drag', function (e) {
					scale = 1;
					//dragStart(e, this);
					var $this = $(this);
					var $wrap_ = $this.closest('.ui-draggable');
					var itemName = $this.attr('name');
					var $area = $wrap_.find('.ui-draggable-area[name="'+ itemName +'"]');
					var wrapW = $wrap_.outerWidth();
					var wrapH = $wrap_.outerHeight();
					var itemW = $this.outerWidth();
					var itemH = $this.outerHeight();
					var moving = false;
					var onlymove = !!$this.attr('onlymove');
					var line = !!$this.attr('line');
					var x, y;
					
					var scopeW = wrapW - itemW,
						scopeH = wrapH - itemH;

					var arrTs = [],
						arrTe = [],
						arrLs = [],
						arrLe = [];	

					var off_tw = $wrap.offset().top / scale,
						off_lw = $wrap.offset().left / scale,
						off_t = $this.position().top / scale,
						off_l = $this.position().left / scale;

					for (var i = 0, len = $area.length; i < len; i++) {
						arrTs.push($area.eq(i).position().top);
						arrTe.push($area.eq(i).position().top + $area.eq(i).outerHeight() * scale);
						arrLs.push($area.eq(i).position().left);
						arrLe.push($area.eq(i).position().left + $area.eq(i).outerWidth() * scale);
					}

					$this.css({
						top: off_t + 'px',
						left: off_l + 'px'
					});

					$(document).off('mousemove.drag').on('mousemove.drag', function (e) {
						moving = true;

						if (e.touches !== undefined) {
							y = e.touches[0].pageY / scale;
							x = e.touches[0].pageX / scale;
						} else {
							if (e.pageY !== undefined) {
								y = e.pageY / scale;
								x = e.pageX / scale;
							}
							if (e.pageY === undefined) {
								y = e.clientY / scale;
								x = e.clientX / scale;
							}
						}
						
						var $body = $('body');
						var nowT = y - (itemH / 2) - off_tw;
						var nowL = x - (itemW / 2) - off_lw;
						
						if (0 > nowT) {
							nowT = 0;
						} 
						if (scopeH < nowT) {
							nowT = scopeH;
						} 
						if (0 > nowL) {
							nowL = 0;
						} 
						if (scopeW < nowL) {
							nowL = scopeW;
						} 
						if (onlymove) {
							for(var i = 0; i < arrTs.length; i++) {
								var isInVer = (nowT * scale > arrTs[i] - (itemH * scale / 2) && nowT * scale < arrTe[i] - (itemH * scale / 2));
								var isInHor = (nowL * scale > arrLs[i] - (itemW * scale / 2) && nowL * scale < arrLe[i] - (itemW * scale / 2));

								if (isInVer && isInHor) {
									if (Number($body.attr('dragps')) !== i) {
										$body.attr('dragps', i);
									}
									break;
								} else {
									if (0 <= nowT && scopeH >= nowT && 0 <= nowL && scopeW >= nowL) {
										$body.removeAttr('dragps');
									}
								} 
							}
						}

						if (line) {
							var lineName = $this.attr('name');
							var lineX = Number(nowL) + Number($this.outerWidth() / 2);
							var lineY = Number(nowT) + Number($this.outerHeight() / 2);

							$svg.find('line[name="'+ lineName +'"]')
								.attr('x2', lineX)
								.attr('y2', lineY);

							(0 > nowT) && $svg.find('line[name="'+ lineName +'"]').attr('y2', 0);
							(scopeH < nowT) && $svg.find('line[name="'+ lineName +'"]').attr('y2', scopeH);
							(0 > nowL) && $svg.find('line[name="'+ lineName +'"]').attr('x2', 0);
							(scopeW < nowL) && $svg.find('line[name="'+ lineName +'"]').attr('x2', scopeW);
						}
						
						$this.css({
							top: nowT + 'px',
							left: nowL + 'px'
						});
					}).off('mouseup.drag').on('mouseup.drag', function (e) {
						if (moving && !onlymove) {
							var nowT = $this.position().top + (itemH / 2);
							var nowL = $this.position().left + (itemW / 2);

							for(var i = 0; i < arrTs.length; i++) {
								var isIn = (nowT > arrTs[i] && nowT < arrTe[i]) && (nowL > arrLs[i] && nowL < arrLe[i]);
								var $area_ = $area.eq(i);

								if (isIn && !$area_.attr('full')) {
									if(!$area_.attr('full')) {
										if (!!$area_.attr('limit')) {
											$area_.attr('full', true);
											$area_.addClass('ok');
										} else {
											$area.eq(0).addClass('ok');
										}
										
										$this.addClass('ok');
										$this.prop('disabled', true);
									} 
								} 
							}

							if (!$this.hasClass('ok')) {
								if (line) {
									var lineName = $this.attr('name');
									$svg.find('line[name="'+ lineName +'"]')
										.attr('x2', $this.attr('linex'))
										.attr('y2', $this.attr('liney'));
								}

								$this.stop().animate({
									top: $this.attr('orgt') + 'px',
									left: $this.attr('orgl') + 'px'
								});
							}
						}
						$(document).off('mousemove.drag');
						$(document).off('mouseup.drag');
					});
				});
			}
		},
		reset: function(opt) {
			var $wrap = opt !== undefined ? $('#' + opt.id) :$('.ui-draggable');
			var $item = $wrap.find('.ui-draggable-item');
			var $area = $wrap.find('.ui-draggable-area');
			var $svg = $wrap.find('svg');

			$('body').removeAttr('draggable');
			$area.removeClass('ok').removeAttr('full');
			$item.each(function(){
				var $this = $(this);

				$this.prop('disabled', false).removeClass('ok');
				$this.stop().animate({
					top: $this.attr('orgt') + 'px',
					left: $this.attr('orgl') + 'px'
				});

				if (!!$this.attr('line')) {
					var nm = $this.attr('name');
					
					$svg.find('line[name="'+ nm +'"]')
						.attr('x2', $this.attr('linex'))
						.attr('y2', $this.attr('liney'));
				}
			});
		}
	}

	
	Global.scrollEvent = {
		y: 0,
		direction: 'down',
		scrollScope: {},
		isScope: false,
		init(opt) {
				let last_know_scroll_position = 0;
				let ticking = false;

				this.isScope = !!opt && !!opt.scope;
				this.scrollScope = this.isScope ? opt.scope : window;

				const options = {
					root: null, 
					rootMargin: '0px', 
					threshold: [0, 0.5, 1]
				}
				let nowY = null;
				const io = new IntersectionObserver((entries, observer) => {
					entries.forEach(entry => {
						const bcr = entry.boundingClientRect;
						const bcrTop = entry.boundingClientRect.top;
						const scrTop = document.documentElement.scrollTop;
						const target = entry.target;
						const ratio = entry.intersectionRatio;
						const state = entry.isIntersecting;
						const isUp = nowY === null ? false : nowY < bcrTop ? true : false;
						const isOverflow = bcr.height >= entry.rootBounds.height ? true : false;
						const isHalfGone = ((scrTop - bcrTop) < (bcrTop + scrTop));

						nowY = bcrTop;

console.log(ratio.toFixed(2));

						if (isOverflow) {
							if (!isUp) {
								if (isHalfGone && ratio >= 0.5 && ratio < 1) {
									target.classList.add('ui-s2');
									target.dataset.state = 's2';
								}
								else if (isHalfGone && ratio > 0 && ratio < 0.5) {
									target.classList.add('ui-s1');
									target.dataset.state = 's1';
								} 
								else if (!isHalfGone && ratio <= 0) {
									target.classList.add('ui-s4');
									target.dataset.state = 's4';
								}
								else if (!isHalfGone && ratio < 0.5) {
									target.classList.add('ui-s3');
									target.dataset.state = 's3';
								}
								
							} 
							else {
								if (ratio <= 0 && isHalfGone) {
									target.classList.remove('ui-s1');
									target.dataset.state = 's0';
								} 
								else if (ratio <= 0.5 && isHalfGone) {
									target.classList.remove('ui-s2');
									target.dataset.state = 's1';
								} 
								else if (ratio < 1 && ratio > 0.5 && !isHalfGone) {
									target.classList.remove('ui-s3');
									target.dataset.state = 's2';
								} 
								else if (ratio < 0.5 && ratio >= 0 && !isHalfGone) {
									target.classList.remove('ui-s4');
									target.dataset.state = 's3';
								}
								
							}
						} else {
							if (!isUp) {
								if (isHalfGone && ratio >= 0.5 && ratio < 1) {
									target.classList.add('ui-s2');
									target.dataset.state = 's2';
								}
								else if (isHalfGone && ratio > 0 && ratio < 0.5) {
									target.classList.add('ui-s1');
									target.dataset.state = 's1';
								} 
								else if (!isHalfGone && ratio <= 0) {
									target.classList.add('ui-s6');
									target.dataset.state = 's6';
								}
								else if (!isHalfGone && ratio < 0.5) {
									target.classList.add('ui-s5');
									target.dataset.state = 's5';
								}
								else if (!isHalfGone && ratio <= 1) {
									target.classList.add('ui-s4');
									target.dataset.state = 's4';
								}
								else if (isHalfGone && ratio >= 1) {
									target.classList.add('ui-s3');
									target.dataset.state = 's3';
								}
							} 
							else {
								if (ratio <= 0 && isHalfGone) {
									target.classList.remove('ui-s1');
									target.dataset.state = 's0';
								} 
								else if (ratio <= 0.5 && isHalfGone) {
									target.classList.remove('ui-s2');
									target.dataset.state = 's1';
								} 
								else if (ratio < 0.7 && ratio > 0.5 && !isHalfGone) {
									target.classList.remove('ui-s5');
									target.dataset.state = 's4';
								} 
								else if (ratio < 0.2 && ratio >= 0 && !isHalfGone) {
									target.classList.remove('ui-s6');
									target.dataset.state = 's5';
								}
								else if (ratio >= 1 && isHalfGone) {
									target.classList.remove('ui-s4');
									target.dataset.state = 's3';
								}
								else if (ratio <= 1 && isHalfGone) {
									target.classList.remove('ui-s3');
									target.dataset.state = 's2';
								}
							}
						}
						
					});
				}, options);

				const items = document.querySelectorAll('[data-parallax]');

				for (let item of items) {
					io.observe(item);
				}
		},
		check() {
				const items = document.querySelectorAll('[data-parallax]');

				for (let item of items) {
						const item_t = item.getBoundingClientRect().top;
						const item_h = item.offsetHeight;
						const win_h = window.innerHeight;
						const scroll_t = this.isScope ? this.scrollScope.scrollTop : document.documentElement.scrollTop;

						((item_t + scroll_t - win_h) < scroll_t) ? item.classList.add('parallax-s-0') : item.classList.remove('parallax-s-0');
 
console.log('parallax-s-1', (item_t + scroll_t), scroll_t);

						((item_t + scroll_t) < scroll_t) ? item.classList.add('parallax-s-1') : item.classList.remove('parallax-s-1');

						((item_t + scroll_t - win_h + item_h) < scroll_t) ? item.classList.add('parallax-e-0') : item.classList.remove('parallax-e-0');

						((item_t + scroll_t + item_h) < scroll_t) ? item.classList.add('parallax-e-1') : item.classList.remove('parallax-e-1');
						
						
						((item_t + scroll_t - (win_h / 2)) < scroll_t) ? item.classList.add('parallax-m-0') : item.classList.remove('parallax-m-0');

						((item_t + scroll_t + (item_h / 2)) < scroll_t) ? item.classList.add('parallax-m-1') : item.classList.remove('parallax-m-1');
				}
		}
	}
})();


// class ScrollBar {
	// 	//객체의 기본 상태를 설정해주는 생성자 메서드 constructor()는 new에 의해 자동으로 호출되므로, 특별한 절차 없이 객체를 초기화
	// 	constructor(idName) {
	// 		this.id = idName;
	// 		this.callback = function(){
	// 			console.log(idName + '커스텀 스크롤 준비완료');
	// 		};
	// 		this.infiniteCallback = false;
	// 	}

	// 	//메서드 사이엔 쉼표가 없습니다.
	// 	init(option) {
	// 		const opt = {...this, ...option};
	// 		//const opt = Object.assign({}, this, option);
	// 		const id = opt.id;
	// 		const callback = opt.callback;
	// 		const infiniteCallback = opt.infiniteCallback;
	// 		const el_scrollbar = document.querySelector('[data-scroll-id="' + id +'"]');

	// 		let timer;
	// 		let prevHeightPercent = 0;
	// 		let scrollDirection = 'keep';

	// 		//+reset
	// 		if (el_scrollbar.dataset.ready === 'yes') {
	// 			return false;
	// 		}

	// 		el_scrollbar.classList.remove('ready');
	// 		el_scrollbar.dataset.ready = 'no';
	// 		el_scrollbar.dataset.direction = scrollDirection;
			
	// 		const wrapW = el_scrollbar.offsetWidth;
	// 		const wrapH = el_scrollbar.offsetHeight;

	// 		Global.parts.wrapTag('<div class="ui-scrollbar-item"><div class="ui-scrollbar-wrap">', el_scrollbar ,'</div></div>');

	// 		//++make
	// 		const el_item = el_scrollbar.querySelector('.ui-scrollbar-item');
	// 		const el_itemWrap = el_item.querySelector('.ui-scrollbar-wrap');
	// 		const _display = window.getComputedStyle(el_scrollbar).display;
	// 		const _padding = window.getComputedStyle(el_scrollbar).padding;

	// 		el_itemWrap.style.display = _display;
	// 		el_itemWrap.style.padding = _padding;

	// 		if (_display === 'inline-block') {
	// 			el_itemWrap.style.display = 'block';
	// 		}

	// 		el_itemWrap.style.width = '100%';
	// 		el_item.style.width = '100%';

	// 		el_scrollbar.style.overflow = 'hidden';

	// 		const itemW = el_item.scrollWidth;
	// 		const itemH = el_item.scrollHeight;

	// 		el_scrollbar.dataset.itemH = itemH;
	// 		el_scrollbar.dataset.itemW = itemW;
	// 		el_scrollbar.dataset.wrapH = wrapH;
	// 		el_scrollbar.dataset.wrapW = wrapW;
			
	// 		if (el_scrollbar.dataset.ready === 'no') {
	// 			el_scrollbar.dataset.ready = 'yes';
	// 			el_scrollbar.classList.add('ready');
	// 			el_item.setAttribute('tabindex', 0);
	// 			el_scrollbar.style.height = wrapH + 'px';

	// 			const html_barwrap = document.createElement('div');
	// 			const html_barwrapX = document.createElement('div');
	// 			const html_button = document.createElement('button');
	// 			const html_buttonX = document.createElement('button');

	// 			html_barwrap.classList.add('ui-scrollbar-barwrap');
	// 			html_barwrap.classList.add('type-y');
	// 			html_barwrapX.classList.add('ui-scrollbar-barwrap');
	// 			html_barwrapX.classList.add('type-x');
	// 			html_button.classList.add('ui-scrollbar-bar');
	// 			html_button.setAttribute('type', 'button');
	// 			html_button.setAttribute('aria-hidden', true);
	// 			html_button.setAttribute('aria-label', 'vertical scroll button');
	// 			html_button.setAttribute('tabindex', '-1');
	// 			html_button.dataset.scrollxy = 'y';
	// 			html_buttonX.classList.add('ui-scrollbar-bar');
	// 			html_buttonX.setAttribute('type', 'button');
	// 			html_buttonX.setAttribute('aria-hidden', true);
	// 			html_buttonX.setAttribute('aria-label', 'vertical scroll button');
	// 			html_buttonX.setAttribute('tabindex', '-1');
	// 			html_buttonX.dataset.scrollxy = 'x';
				
	// 			html_barwrap.append(html_button);
	// 			html_barwrapX.append(html_buttonX);
	// 			el_scrollbar.prepend(html_barwrap);
	// 			el_scrollbar.prepend(html_barwrapX);

	// 			(wrapH < itemH) ? 
	// 				el_scrollbar.classList.add('view-y') : 
	// 				el_scrollbar.classList.remove('view-y');

	// 			(wrapW < itemW) ? 
	// 				el_scrollbar.classList.add('view-x') : 
	// 				el_scrollbar.classList.remove('view-x');

	// 			const barH = Math.floor(wrapH / (itemH / 100));
	// 			const barW = Math.floor(wrapW / (itemW / 100));
	// 			const el_barY = el_scrollbar.querySelector('.ui-scrollbar-barwrap.type-y .ui-scrollbar-bar');
	// 			const el_barX = el_scrollbar.querySelector('.ui-scrollbar-barwrap.type-x .ui-scrollbar-bar');
				
	// 			el_barY.style.height = barH + '%';
	// 			el_barX.style.height = barW + '%';
	// 			el_barY.dataset.height = barH;
	// 			el_barX.dataset.height = barW;

	// 			el_scrollbar.classList.add('view-scrollbar');
	// 			!!callback && callback(); 

	// 			scrollEvent(false, el_item);
	// 			scrollbarUpdate(el_scrollbar, wrapH, wrapW, itemH, itemW);
	// 			eventFn(el_scrollbar);
	// 		}

	// 		function scrollbarUpdate(el_scrollbar, wrapH, wrapW, itemH, itemW){
	// 			const _el_scrollbar = el_scrollbar;
	// 			const el_item = _el_scrollbar.querySelector('.ui-scrollbar-item');
				
	// 			if (!el_item) {
	// 				return false;
	// 			}

	// 			const nWrapH = _el_scrollbar.offsetHeight;
	// 			const nWrapW = _el_scrollbar.offsetWidth;
	// 			const nItemH = el_item.scrollHeight;
	// 			const nItemW = el_item.scrollWidth;
	// 			const changeH = (itemH !== nItemH || wrapH !== nWrapH);
	// 			const changeW = (itemW !== nItemW || wrapW !== nWrapW);

	// 			//resizing
	// 			if (changeH || changeW) {
	// 				const barH = Math.floor(nWrapH / (nItemH / 100));
	// 				const barW = Math.floor(nWrapW / (nItemW / 100));
	// 				const el_barY = _el_scrollbar.querySelector('.ui-scrollbar-barwrap.type-y .ui-scrollbar-bar');
	// 				const el_barX = _el_scrollbar.querySelector('.ui-scrollbar-barwrap.type-x .ui-scrollbar-bar');

	// 				if (changeH) {
	// 					el_barY.style.height = barH + '%';
	// 					el_barY.dataset.height = barH;
	// 				} 
	// 				if (changeW) {
	// 					el_barX.style.width = barW + '%';
	// 					el_barX.dataset.width = barW;
	// 				}
					
	// 				(nWrapH < nItemH) ? _el_scrollbar.classList.add('view-y') : _el_scrollbar.classList.remove('view-y');
	// 				(nWrapW < nItemW) ? _el_scrollbar.classList.add('view-x') : _el_scrollbar.classList.remove('view-x');

	// 				el_scrollbar.dataset.itemH = nItemH;
	// 				el_scrollbar.dataset.itemW = nItemW;
	// 				el_scrollbar.dataset.wrapH = nWrapH;
	// 				el_scrollbar.dataset.wrapW = nWrapW;
	// 			}

	// 			setTimeout(function(){
	// 				scrollbarUpdate(el_scrollbar, nWrapH, nWrapW, nItemH, nItemW);
	// 			}, 300);
	// 		}

	// 		function eventFn(v){
	// 			const _el_scrollbar = el_scrollbar;
	// 			const el_item = _el_scrollbar.querySelector('.ui-scrollbar-item');
	// 			const el_bar = _el_scrollbar.querySelectorAll('.ui-scrollbar-bar');

	// 			el_item.addEventListener('scroll', scrollEvent);

	// 			for (let bar of el_bar) {
	// 				bar.addEventListener('mousedown', dragMoveAct);
	// 			}
	// 		}	
			
	// 		function scrollEvent(event, el_item){
	// 			const _el_item = !!event ? event.target : el_item;
	// 			const el_scrollbar = _el_item.closest('.ui-scrollbar');
	// 			const itemH = Number(el_scrollbar.dataset.itemH);
	// 			const itemW = Number(el_scrollbar.dataset.itemW);
	// 			const wrapH = Number(el_scrollbar.dataset.wrapH);
	// 			const wrapW = Number(el_scrollbar.dataset.wrapW);

	// 			//el_scrollbar.dataset 값이 없을 경우 4개의 값중 하나라도 없으면 중단
	// 			if (wrapW === undefined) {
	// 				return false;
	// 			}

	// 			const el_barY = el_scrollbar.querySelector('.type-y .ui-scrollbar-bar');
	// 			const el_barX = el_scrollbar.querySelector('.type-x .ui-scrollbar-bar');
	// 			const scrT = _el_item.scrollTop;
	// 			const scrL = _el_item.scrollLeft;
	// 			const barH = Number(el_barY.dataset.height);
	// 			const barW = Number(el_barX.dataset.width);
	// 			const hPer = Math.round(scrT / (itemH - wrapH) * 100);
	// 			const wPer = Math.round(scrL / (itemW - wrapW) * 100);
	// 			const _hPer = (barH / 100) * hPer;
	// 			const _wPer = (barW / 100) * wPer;
				
	// 			el_barY.style.top = hPer - _hPer + '%';
	// 			el_barX.style.left = wPer - _wPer + '%';
				
	// 			if (prevHeightPercent < scrT) {
	// 				scrollDirection = 'down';
	// 			} else if (prevHeightPercent > scrT) {
	// 				scrollDirection = 'up';
	// 			} else {
	// 				scrollDirection = 'keep';
	// 			}

	// 			el_scrollbar.dataset.direction = scrollDirection;
	// 			prevHeightPercent = scrT;

	// 			if (hPer === 100 && scrollDirection === 'down') {
	// 				clearTimeout(timer);
	// 				timer = setTimeout(() => {
	// 					!!infiniteCallback && infiniteCallback();
	// 				},200);
	// 			}
	// 		}
			
	// 		function dragMoveAct(event) {
	// 			const body = document.querySelector('body');
	// 			const el_bar = event.target;
	// 			const el_scrollbar = el_bar.closest('.ui-scrollbar');
	// 			const el_barWrap = el_bar.closest('.ui-scrollbar-barwrap');
	// 			const el_item = el_scrollbar.querySelector('.ui-scrollbar-item');
	// 			const itemH = Number(el_scrollbar.dataset.itemH);
	// 			const itemW = Number(el_scrollbar.dataset.itemW);
	// 			const el_barWrapRect = el_barWrap.getBoundingClientRect();
	// 			const off_t = el_barWrapRect.top + document.documentElement.scrollTop;
	// 			const off_l = el_barWrapRect.left + document.documentElement.scrollLeft;
	// 			const w_h = el_barWrapRect.height;
	// 			const w_w = el_barWrapRect.width;
	// 			const barH = el_bar.getAttribute('data-height');
	// 			const barW = el_bar.getAttribute('data-width');
	// 			const isXY = el_bar.getAttribute('data-scrollxy');

	// 			body.classList.add('scrollbar-move');

	// 			document.addEventListener('mousemove', mousemoveAct);
	// 			document.addEventListener('mouseup', mouseupAct);

	// 			function mousemoveAct(event){
	// 				let y_m; 
	// 				let x_m;
					
	// 				if (event.touches === undefined) {
	// 					if (event.pageY !== undefined) {
	// 						y_m = event.pageY;
	// 					} else if (event.pageY === undefined) {
	// 						y_m = event.clientY;
	// 					}

	// 					if (event.pageX !== undefined) {
	// 						x_m = event.pageX;
	// 					} else if (event.pageX === undefined) {
	// 						x_m = event.clientX;
	// 					}
	// 				}

	// 				let yR = y_m - off_t;
	// 				let xR = x_m - off_l;

	// 				yR = yR < 0 ? 0 : yR;
	// 				yR = yR > w_h ? w_h : yR;
	// 				xR = xR < 0 ? 0 : xR;
	// 				xR = xR > w_w ? w_w : xR;

	// 				const yRPer = yR / w_h * 100;
	// 				const xRPer = xR / w_w * 100;
	// 				const nPerY = (yRPer - (barH / 100 * yRPer)).toFixed(2);
	// 				const nPerX = (xRPer - (barW / 100 * xRPer)).toFixed(2);

	// 				if (isXY === 'y') {
	// 					el_bar.style.top = nPerY + '%';
	// 					el_item.scrollTop = itemH * nPerY / 100;
	// 				} else {
	// 					el_bar.style.left = nPerX + '%';
	// 					el_item.scrollLeft = itemW * nPerX / 100;
	// 				}
	// 			}
	// 			function mouseupAct(){
	// 				body.classList.remove('scrollbar-move');
	// 				document.removeEventListener('mousemove', mousemoveAct);
	// 				document.removeEventListener('mouseup', mouseupAct);
	// 			}
	// 		}
	// 	}

	// 	destroy() {
	// 		const el_scrollbar = document.querySelector('[data-scroll-id="' + this.id +'"]');
	// 		const el_barwrap = el_scrollbar.querySelectorAll('.ui-scrollbar-barwrap');
	// 		const el_item = el_scrollbar.querySelector('.ui-scrollbar-item');
	// 		const el_wrap = el_item.querySelector('.ui-scrollbar-wrap');
	// 		const wrapHtml = el_wrap.innerHTML;

	// 		el_scrollbar.dataset.ready = 'no';
	// 		el_scrollbar.classList.remove('ready');
	// 		el_scrollbar.classList.remove('view-y');
	// 		el_scrollbar.classList.remove('view-x');
	// 		el_scrollbar.classList.remove('view-scrollbar');
	// 		el_scrollbar.style.overflow = 'auto';
	// 		//el_scrollbar.removeAttribute('style');
	// 		el_barwrap.forEach((userItem) => {
	// 			el_scrollbar.removeChild(userItem);
	// 		});
	// 		el_scrollbar.removeChild(el_item);
	// 		el_scrollbar.innerHTML = wrapHtml;
	// 	}

	// 	reset(opt) {
	// 		console.log(this);
	// 		Global.uiScrollBar[this.id].destroy();
	// 		Global.uiScrollBar[this.id].init({
	// 			infiniteCallback: opt.infiniteCallback
	// 		});

	// 	}
	// }
	// //uiScrollBar 실행함수 생성
	// Global.scrollBar = (opt) => {
	// 	let scrollBar = document.querySelectorAll('.ui-scrollbar');

	// 	if (opt !== undefined && opt.selector !== undefined){ 
	// 		scrollBar = opt.selector;
	// 	}
		
	// 	if (sessionStorage.getItem('scrollbarID') === null) {
	// 		sessionStorage.setItem('scrollbarID', 0);
	// 	}

	// 	if (scrollBar.length === undefined) {
	// 		let scrollId = scrollBar.getAttribute('data-scroll-id');
	
	// 		if (!scrollId) {
	// 			let idN = JSON.parse(sessionStorage.getItem('scrollbarID'));
					
	// 			idN = idN + 1;
	// 			sessionStorage.setItem('scrollbarID', idN);
	// 			scrollId = 'item' + idN;
	// 			scrollBar.dataset.scrollId = scrollId;
	// 		} 

	// 		Global.scrollBar[scrollId] = new ScrollBar(scrollId);

	// 		setTimeout(function(){
	// 			Global.scrollBar[scrollId].init();
	// 		},0);
	// 	} else {
	// 		for (let that of scrollBar) {
	// 			let scrollId = that.getAttribute('data-scroll-id');

	// 			if (that.dataset.ready !== 'yes') {
	// 				if (!scrollId) {
	// 					let idN = JSON.parse(sessionStorage.getItem('scrollbarID'));
							
	// 					idN = idN + 1;
	// 					sessionStorage.setItem('scrollbarID', idN);
	// 					scrollId = 'item' + idN;
	// 					that.dataset.scrollId = scrollId;
	// 				} 
		
	// 				Global.scrollBar[scrollId] = new ScrollBar(scrollId);
		
	// 				setTimeout(function(){
	// 					Global.scrollBar[scrollId].init();
	// 				},0);
	// 			}
	// 		}
	// 	}
	// }

