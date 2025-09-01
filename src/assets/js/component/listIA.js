export default class listIA {
	constructor(opt) {
		this.file = opt.url;
		this.id = opt.id;
		this.main = document.querySelector('.IA');
		this.codingListContainer = document.querySelector('#' + this.id);
		this.projectListSrchCode = null;
		this.projectListSrchBtn = null;
		this.allWorkItems = [];
	}

	/**
	 * 현재 문서의 모든 iframe에 iframe.css 스타일시트를 추가합니다.
	 * iframe 로드 완료를 보장하여 에러를 방지합니다.
	 */
	addIframeStylesheet(iframeElement) { // 인자로 iframe 요소를 받도록 수정
		if (!iframeElement) {
			console.warn('iframe 요소가 지정되지 않았습니다.');
			return;
		}

		// iframe이 로드될 때까지 기다립니다.
		iframeElement.addEventListener('load', () => {
			try {
				// contentWindow.document.head가 존재하는지 다시 확인
				if (iframeElement.contentWindow && iframeElement.contentWindow.document && iframeElement.contentWindow.document.head) {
					let _link = document.createElement('link');
					_link.rel = 'stylesheet';
					_link.href = '../../assets/css/iframe.css';
					// 중복 추가 방지를 위해 이미 추가되었는지 확인
					if (!iframeElement.contentWindow.document.head.querySelector(`link[href="${_link.href}"]`)) {
						iframeElement.contentWindow.document.head.appendChild(_link);
						console.log('iframe.css 스타일시트가 성공적으로 추가되었습니다.');
					}
				} else {
					console.warn('iframe 문서 또는 head를 찾을 수 없습니다.');
				}
			} catch (e) {
				console.error('iframe 스타일시트 추가 중 오류 발생:', e);
			}
		}, { once: true }); // load 이벤트는 한 번만 실행되도록 설정
	}

	/**
	 * 지정된 JSON 파일에서 작업 목록 데이터를 가져옵니다.
	 * @returns {Promise<Array>} 항목 목록으로 확인되는 Promise.
	 */
	async loadWorkItems() {
		try {
			const response = await fetch(this.file);
			const json = await response.json();
			return json.list;
		} catch (error) {
			console.error('작업 항목을 불러오는 중 오류 발생:', error);
			return [];
		}
	}

	/**
	 * Date 객체를 'YYYY-MM-DD' 형식으로 포맷합니다.
	 * @param {string|Date} dateString - 포맷할 날짜 문자열 (YYYYMMDD) 또는 Date 객체.
	 * @returns {string} 포맷된 날짜 문자열 (YYYY-MM-DD).
	 */
	getFormattedDate(dateString) {
		if (dateString instanceof Date) {
			const year = dateString.getFullYear();
			const month = String(dateString.getMonth() + 1).padStart(2, '0');
			const day = String(dateString.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		} else if (typeof dateString === 'string' && dateString.length === 8) {
			const year = dateString.substring(0, 4);
			const month = dateString.substring(4, 6);
			const day = dateString.substring(6, 8);
			return `${year}-${month}-${day}`;
		}
		return '';
	}

	/**
	 * 두 날짜 간의 일수 차이를 계산합니다.
	 * date2가 date1보다 뒤면 '-N' 형식의 문자열을 반환하고, 아니면 빈 문자열을 반환합니다.
	 * @param {string} date1 - 첫 번째 날짜 (YYYY-MM-DD 또는 YYYYMMDD 형식).
	 * @param {Date} date2 - 두 번째 날짜 (Date 객체).
	 * @returns {string} 포맷된 날짜 차이.
	 */
	getDateDiff(date1, date2) {
		const _date1 = new Date(this.getFormattedDate(date1));
		const _date2 = date2;

		_date1.setHours(0, 0, 0, 0);
		_date2.setHours(0, 0, 0, 0);

		const diffTime = _date2.getTime() - _date1.getTime();
		const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

		return diffDays < 0 ? '' : `-${diffDays}`;
	}

	/**
	 * 'd' 속성의 변경에 따라 항목의 깊이 클래스를 결정합니다.
	 * @param {Object} currentItem - 현재 데이터 항목.
	 * @param {Object} prevItem - 이전 데이터 항목.
	 */
	applyDepthClasses(currentItem, prevItem) {
		let depthChange = false;
		for (let j = 1; j <= 10; j++) {
			const prop = `d${j}`;
			const classProp = `c${j}`;

			if (currentItem[prop] !== '' && currentItem[prop] !== prevItem[prop]) {
				currentItem[classProp] = ` c${j}`;
				depthChange = true;
			} else {
				currentItem[classProp] = depthChange ? ` c${j}` : '';
			}
		}
	}

	updateTaskState(task) {
		// 오늘 날짜를 'YY.MM.DD' 형식으로 가져옵니다.
		const today = new Date();
		const year = today.getFullYear().toString().substring(2);
		const month = (today.getMonth() + 1).toString().padStart(2, '0');
		const day = today.getDate().toString().padStart(2, '0');
		const todayFormatted = `${year}.${month}.${day}`;

		// JSON 데이터의 종료일과 오늘 날짜를 비교합니다.
		if (task.e_dt < todayFormatted && task.state !== '완료') {
			return true;
		}
	}

	/**
	 * 작업 목록 항목에 대한 HTML을 생성합니다.
	 * @param {Array} dataExecelList - 작업 항목 목록.
	 * @returns {string} 목록에 대한 HTML 문자열.
	 */
	generateWorkListHTML(dataExecelList) {
		let tableHTML = ``;
		const today = new Date();

		for (let i = 0; i < dataExecelList.length; i++) {
			const dataCurrent = { ...dataExecelList[i] };
			const dataPrevious = (i === 0) ? {} : dataExecelList[i - 1];
			const isDelay = this.updateTaskState(dataCurrent)

			let stateClass = '';
			let lastDepth = '';

			switch (dataCurrent.state) {
				case '완료': stateClass = 'end'; break;
				case '제외': stateClass = 'del'; break;
				default: stateClass = 'wait'; break;
			}

			if (isDelay) {
				stateClass = 'delay';
				dataCurrent.state = '지연';
			}

			if (dataPrevious.d1) {
				if (dataCurrent.d1 !== dataPrevious.d1 && dataCurrent.d1 !== '') stateClass = stateClass + ' d1';
				if (dataCurrent.d2 !== dataPrevious.d2 && dataCurrent.d2 !== '') stateClass = stateClass + ' d2';
				if (dataCurrent.d3 !== dataPrevious.d3 && dataCurrent.d3 !== '') stateClass = stateClass + ' d3';
				if (dataCurrent.d4 !== dataPrevious.d4 && dataCurrent.d4 !== '') stateClass = stateClass + ' d4';
				if (dataCurrent.d5 !== dataPrevious.d5 && dataCurrent.d5 !== '') stateClass = stateClass + ' d5';
				if (dataCurrent.d6 !== dataPrevious.d6 && dataCurrent.d6 !== '') stateClass = stateClass + ' d6';
				if (dataCurrent.d7 !== dataPrevious.d7 && dataCurrent.d7 !== '') stateClass = stateClass + ' d7';
				if (dataCurrent.d8 !== dataPrevious.d8 && dataCurrent.d8 !== '') stateClass = stateClass + ' d8';
				if (dataCurrent.d9 !== dataPrevious.d9 && dataCurrent.d9 !== '') stateClass = stateClass + ' d9';
				if (dataCurrent.d10 !== dataPrevious.d10 && dataCurrent.d10 !== '') stateClass = stateClass + ' d10';
			}

			if (dataCurrent.d2 === '') { lastDepth = 'd1'; }
			else if (dataCurrent.d3 === '') { lastDepth = 'd2'; }
			else if (dataCurrent.d4 === '') { lastDepth = 'd3'; }
			else if (dataCurrent.d5 === '') { lastDepth = 'd4'; }
			else if (dataCurrent.d6 === '') { lastDepth = 'd5'; }
			else if (dataCurrent.d7 === '') { lastDepth = 'd6'; }
			else if (dataCurrent.d8 === '') { lastDepth = 'd7'; }
			else if (dataCurrent.d9 === '') { lastDepth = 'd8'; }
			else if (dataCurrent.d10 === '') { lastDepth = 'd9'; }
			else { lastDepth = 'd10'; }

			if (i > 0 && dataCurrent.c1) {
				tableHTML += `</tbody><tbody>`;
			}

			if (i === 0) {
				tableHTML = `
						<div class="tbl-base">
							<table>
								<caption>코딩리스트</caption>
								<thead>
									<tr>
										<th scope="col">${dataCurrent.state}</th>
										<th scope="col">${dataCurrent.s_dt}</th>
										<th scope="col">${dataCurrent.e_dt}</th>
										<th scope="col">${dataCurrent.assignee}</th>
										<th scope="col">${dataCurrent.type}</th>
										<th scope="col">${dataCurrent.name}</th>
										<th scope="col">${dataCurrent.d1}</th>
										<th scope="col">${dataCurrent.d2}</th>
										<th scope="col">${dataCurrent.d3}</th>
										<th scope="col">${dataCurrent.d4}</th>
										<th scope="col">${dataCurrent.d5}</th>
										<th scope="col">${dataCurrent.d6}</th>
										<th scope="col">${dataCurrent.d7}</th>
										<th scope="col">${dataCurrent.d8}</th>
										<th scope="col">${dataCurrent.d9}</th>
										<th scope="col">${dataCurrent.d10}</th>
										<th scope="col">${dataCurrent.notes}</th>
									</tr>
								</thead>
								<tbody>`;
			} else {
				tableHTML += `
							<tr class="${stateClass}"
							data-id="${dataCurrent.name || ''}"
							data-state="${dataCurrent.state || ''}"
							data-current="${lastDepth}"
							>

								<td>${dataCurrent.state}</td>
								<td>${dataCurrent.s_dt}</td>
								<td>${dataCurrent.e_dt}</td>
								<td>${dataCurrent.assignee}</td>

								<td class="type-${dataCurrent.type}"><span>${dataCurrent.type}</span></td>
								<td class="id ico_pg">
										${dataCurrent.name ? `<a class="ui-coding-link" href="${(dataCurrent.root || '')}" target="coding">${dataCurrent.name}</a>` : ''}
								</td>
								
								<td class="d d1 ${dataCurrent.d1.trim().length ? 'is' : ''}"><span>${dataCurrent.d1.trim().length ? dataCurrent.d1 : ''}</span></td>
								<td class="d d2 ${dataCurrent.d2.trim().length ? 'is' : ''}"><span>${dataCurrent.d2.trim().length ? dataCurrent.d2 : ''}</span></td>
								<td class="d d3 ${dataCurrent.d3.trim().length ? 'is' : ''}"><span>${dataCurrent.d3.trim().length ? dataCurrent.d3 : ''}</span></td>
								<td class="d d4 ${dataCurrent.d4.trim().length ? 'is' : ''}"><span>${dataCurrent.d4.trim().length ? dataCurrent.d4 : ''}</span></td>
								<td class="d d5 ${dataCurrent.d5.trim().length ? 'is' : ''}"><span>${dataCurrent.d5.trim().length ? dataCurrent.d5 : ''}</span></td>
								<td class="d d6 ${dataCurrent.d6.trim().length ? 'is' : ''}"><span>${dataCurrent.d6.trim().length ? dataCurrent.d6 : ''}</span></td>
								<td class="d d7 ${dataCurrent.d7.trim().length ? 'is' : ''}"><span>${dataCurrent.d7.trim().length ? dataCurrent.d7 : ''}</span></td>
								<td class="d d8 ${dataCurrent.d8.trim().length ? 'is' : ''}"><span>${dataCurrent.d8.trim().length ? dataCurrent.d8 : ''}</span></td>
								<td class="d d9 ${dataCurrent.d9.trim().length ? 'is' : ''}"><span>${dataCurrent.d9.trim().length ? dataCurrent.d9 : ''}</span></td>
								<td class="d d10 ${dataCurrent.d10.trim().length ? 'is' : ''}"><span>${dataCurrent.d10.trim().length ? dataCurrent.d10 : ''}</span></td>
								<td class="notes"><span>${dataCurrent.notes}</span></td>
							</tr>`;
			}
		}
		tableHTML += `</tbody></table></div>`;
		return tableHTML;
	}

	/**
	 * 검색 기능을 초기화합니다.
	 */
	initSearch() {
		this.projectListSrchCode = document.querySelector('#projectListSrchCode');
		this.projectListSrchBtn = document.querySelector('#projectListSrchBtn');

		const performSearch = () => {
			const searchTerm = this.projectListSrchCode.value.trim();
			const searchTerms = searchTerm.split(',').map(term => term.trim().toLowerCase()).filter(term => term !== '');

			this.allWorkItems.forEach(item => {
				const textContent = item.textContent.toLowerCase();
				let shouldShow = true;

				if (searchTerms.length > 0) {
					shouldShow = searchTerms.every(term => textContent.includes(term));
				}
				item.style.display = shouldShow ? '' : 'none';
			});
		};

		this.projectListSrchBtn.addEventListener('click', performSearch);
		this.projectListSrchCode.addEventListener('keyup', (event) => {
			if (event.key === 'Enter') {
				performSearch();
			}
		});

		const savedSearchTerm = sessionStorage.getItem('projectListSearchTerm');
		if (savedSearchTerm) {
			this.projectListSrchCode.value = savedSearchTerm;
			performSearch();
		}

		this.projectListSrchCode.addEventListener('input', () => {
			sessionStorage.setItem('projectListSearchTerm', this.projectListSrchCode.value.trim());
		});
	}

	/**
	 * 코딩 링크에 대한 이벤트 리스너를 설정합니다.
	 */
	setupCodingLinkListeners() {
		const links = this.codingListContainer.querySelectorAll('.ui-coding-link');
		const iframeElement = document.querySelector('.IA--view iframe'); // iframe 요소 한 번만 찾기

		links.forEach(link => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const targetHref = e.currentTarget.href;
				const parentRow = e.currentTarget.closest('tr');
				const pageId = parentRow.dataset.id;

				sessionStorage.setItem('codinglist', pageId);

				const iframeLink = document.querySelector('.IA--view a');

				if (iframeLink) {
					iframeLink.href = targetHref;
					iframeLink.textContent = '새창';
				}

				if (iframeElement) { // iframeElement가 null이 아닌지 확인
					iframeElement.src = targetHref;
					// this.addIframeStylesheet(iframeElement); // iframe 요소 전달
				} else {
					console.warn('.IA--view iframe 요소를 찾을 수 없습니다.');
				}

				const activeRow = this.codingListContainer.querySelector('.IA--list tr.on');
				if (activeRow) {
					activeRow.classList.remove('on');
				}
				parentRow.classList.add('on');
			});
		});

		const savedPageId = sessionStorage.getItem('codinglist');
		if (savedPageId) {
			const savedLink = this.codingListContainer.querySelector(`[data-id="${savedPageId}"] .ui-coding-link`);
			if (savedLink) {
				savedLink.click();
			}
		}
	}

	/**
	 * WorkListPreview를 초기화합니다.
	 */
	async init() {
		const items = await this.loadWorkItems();
		if (items.length === 0) {
			console.warn('JSON 파일에서 불러온 항목이 없습니다.');
			return;
		}

		const listHTML = this.generateWorkListHTML(items);
		this.codingListContainer.innerHTML = listHTML;

		const headerInfo = `
            <div class="IA--list-header">
                <div class="box-srch mt-x1">
                    <div class="srch-area">
                        <input type="search" id="projectListSrchCode" class="inp-base ui-inpcancel mr-x1" value="" placeholder="검색어를 입력해주세요. (예: 용어1, 용어2)">
                        <button type="button" id="projectListSrchBtn" class="btn-base"><span>검색</span></button>
                    </div>
                </div>
            </div>`;
		this.codingListContainer.insertAdjacentHTML('afterbegin', headerInfo);

		this.allWorkItems = Array.from(this.codingListContainer.querySelectorAll('.tbl-base tbody tr'));

		this.initSearch();
		this.setupCodingLinkListeners();

		const selects = this.main.querySelectorAll('select');
		selects.forEach(sel => {
			sel.addEventListener('change', this.change.bind(this));
		});
	}

	/**
	 * select 요소의 변경 이벤트를 처리합니다.
	 * @param {Event} event - 변경 이벤트.
	 */
	change(event) {
		const select = event.currentTarget;
		const value = select.value;
		const id = select.dataset.id;
		const iframe = document.querySelector(`iframe[data-id="${id}"]`);
		if (iframe) {
			iframe.name = value;
		}
	}

	/**
	 * 모든 iframe과 링크의 소스를 특정 URL로 설정합니다.
	 * @param {string} url - 설정할 URL.
	 */
	set(url) {
		const iframes = document.querySelectorAll('iframe');
		const links = document.querySelectorAll('a[target]');
		links.forEach(link => (link.href = url));
		iframes.forEach(iframe => (iframe.src = url));
	}
}

