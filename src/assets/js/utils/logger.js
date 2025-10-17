/**
 * Logger Utility
 * 개발/프로덕션 환경에 따른 로깅 관리
 * 
 * 사용법:
 * import { logger } from './utils/logger.js';
 * 
 * logger.debug('디버그 메시지', data);
 * logger.info('정보 메시지');
 * logger.warn('경고 메시지');
 * logger.error('에러 메시지', error);
 */

class Logger {
  constructor() {
    // 환경 설정 (localStorage 또는 URL 파라미터로 제어 가능)
    this.isDevelopment = this.#checkDevelopmentMode();
    this.logLevel = this.#getLogLevel();
    this.styles = {
      debug: 'color: #6c757d; font-weight: normal;',
      info: 'color: #0d6efd; font-weight: bold;',
      warn: 'color: #ffc107; font-weight: bold;',
      error: 'color: #dc3545; font-weight: bold;',
      success: 'color: #198754; font-weight: bold;'
    };
  }

  /**
   * 개발 모드 체크
   * - localStorage에 'dev-mode' 설정이 있으면 사용
   * - URL에 ?debug 파라미터가 있으면 개발 모드
   * - hostname이 localhost이면 개발 모드
   */
  #checkDevelopmentMode() {
    const devMode = localStorage.getItem('dev-mode');
    if (devMode !== null) {
      return devMode === 'true';
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('debug')) {
      return true;
    }

    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname.includes('local');
  }

  /**
   * 로그 레벨 가져오기
   * localStorage에서 설정 가능: 'debug', 'info', 'warn', 'error', 'none'
   */
  #getLogLevel() {
    const level = localStorage.getItem('log-level');
    return level || 'debug';
  }

  /**
   * 로그 출력 여부 결정
   */
  #shouldLog(level) {
    if (!this.isDevelopment && level !== 'error') {
      return false; // 프로덕션에서는 error만 출력
    }

    const levels = ['debug', 'info', 'warn', 'error', 'none'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);

    if (this.logLevel === 'none') {
      return false;
    }

    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * 포맷된 시간 가져오기
   */
  #getTimestamp() {
    const now = new Date();
    return now.toLocaleTimeString('ko-KR', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  }

  /**
   * 로그 메시지 포맷팅
   */
  #formatMessage(level, component, message) {
    const timestamp = this.#getTimestamp();
    const componentText = component ? `[${component}]` : '';
    return `[${timestamp}] ${componentText} ${message}`;
  }

  /**
   * Debug 레벨 로그
   * @param {string} message - 로그 메시지
   * @param {any} data - 추가 데이터
   * @param {string} component - 컴포넌트 이름
   */
  debug(message, data = null, component = '') {
    if (!this.#shouldLog('debug')) return;

    const formattedMessage = this.#formatMessage('DEBUG', component, message);
    if (data !== null) {
      console.log(`%c${formattedMessage}`, this.styles.debug, data);
    } else {
      console.log(`%c${formattedMessage}`, this.styles.debug);
    }
  }

  /**
   * Info 레벨 로그
   * @param {string} message - 로그 메시지
   * @param {any} data - 추가 데이터
   * @param {string} component - 컴포넌트 이름
   */
  info(message, data = null, component = '') {
    if (!this.#shouldLog('info')) return;

    const formattedMessage = this.#formatMessage('INFO', component, message);
    if (data !== null) {
      console.info(`%c${formattedMessage}`, this.styles.info, data);
    } else {
      console.info(`%c${formattedMessage}`, this.styles.info);
    }
  }

  /**
   * Warning 레벨 로그
   * @param {string} message - 경고 메시지
   * @param {any} data - 추가 데이터
   * @param {string} component - 컴포넌트 이름
   */
  warn(message, data = null, component = '') {
    if (!this.#shouldLog('warn')) return;

    const formattedMessage = this.#formatMessage('WARN', component, message);
    if (data !== null) {
      console.warn(`%c${formattedMessage}`, this.styles.warn, data);
    } else {
      console.warn(`%c${formattedMessage}`, this.styles.warn);
    }
  }

  /**
   * Error 레벨 로그
   * @param {string} message - 에러 메시지
   * @param {Error|any} error - 에러 객체 또는 추가 데이터
   * @param {string} component - 컴포넌트 이름
   */
  error(message, error = null, component = '') {
    if (!this.#shouldLog('error')) return;

    const formattedMessage = this.#formatMessage('ERROR', component, message);
    if (error !== null) {
      console.error(`%c${formattedMessage}`, this.styles.error, error);
      
      // 에러 스택이 있으면 출력
      if (error instanceof Error && error.stack) {
        console.error(error.stack);
      }
    } else {
      console.error(`%c${formattedMessage}`, this.styles.error);
    }
  }

  /**
   * Success 로그 (특별 케이스)
   * @param {string} message - 성공 메시지
   * @param {any} data - 추가 데이터
   * @param {string} component - 컴포넌트 이름
   */
  success(message, data = null, component = '') {
    if (!this.#shouldLog('info')) return;

    const formattedMessage = this.#formatMessage('SUCCESS', component, message);
    if (data !== null) {
      console.log(`%c${formattedMessage}`, this.styles.success, data);
    } else {
      console.log(`%c${formattedMessage}`, this.styles.success);
    }
  }

  /**
   * 그룹 로그 시작
   * @param {string} label - 그룹 레이블
   * @param {boolean} collapsed - 접혀있는 상태로 시작할지 여부
   */
  group(label, collapsed = false) {
    if (!this.isDevelopment) return;
    
    if (collapsed) {
      console.groupCollapsed(label);
    } else {
      console.group(label);
    }
  }

  /**
   * 그룹 로그 종료
   */
  groupEnd() {
    if (!this.isDevelopment) return;
    console.groupEnd();
  }

  /**
   * 테이블 형식 로그
   * @param {Array|Object} data - 테이블로 표시할 데이터
   * @param {string} label - 테이블 레이블
   */
  table(data, label = '') {
    if (!this.isDevelopment) return;
    
    if (label) {
      console.log(`%c${label}`, this.styles.info);
    }
    console.table(data);
  }

  /**
   * 개발 모드 토글
   */
  toggleDevMode() {
    this.isDevelopment = !this.isDevelopment;
    localStorage.setItem('dev-mode', this.isDevelopment.toString());
    console.log(`개발 모드: ${this.isDevelopment ? 'ON' : 'OFF'}`);
  }

  /**
   * 로그 레벨 설정
   * @param {string} level - 'debug', 'info', 'warn', 'error', 'none'
   */
  setLogLevel(level) {
    const validLevels = ['debug', 'info', 'warn', 'error', 'none'];
    if (validLevels.includes(level)) {
      this.logLevel = level;
      localStorage.setItem('log-level', level);
      console.log(`로그 레벨이 "${level}"로 설정되었습니다.`);
    } else {
      console.warn(`유효하지 않은 로그 레벨: ${level}. 사용 가능한 레벨: ${validLevels.join(', ')}`);
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const logger = new Logger();

// 전역에서 사용 가능하도록 설정 (선택사항)
if (typeof window !== 'undefined') {
  window.logger = logger;
}
