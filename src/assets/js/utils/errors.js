/**
 * Custom Error Classes for UIUXU
 * 프로젝트 전반에서 사용할 커스텀 에러 클래스들
 * 
 * 사용법:
 * import { UIError, ValidationError, NetworkError } from './utils/errors.js';
 * 
 * throw new ValidationError('유효하지 않은 옵션', { option: 'id', value: null });
 */

import { logger } from './logger.js';

/**
 * 기본 UI 에러 클래스
 * 모든 커스텀 에러의 부모 클래스
 */
export class UIError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = 'UIError';
    this.context = context; // 추가 컨텍스트 정보
    this.timestamp = new Date().toISOString();
    
    // 스택 트레이스 정리
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * 에러 정보를 객체로 반환
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }

  /**
   * 에러를 로그에 출력
   */
  log(componentName = '') {
    logger.error(this.message, this, componentName);
  }
}

/**
 * 유효성 검사 에러
 * 입력값, 옵션, 파라미터 검증 실패 시 사용
 * 
 * @example
 * if (!options.id) {
 *   throw new ValidationError('ID는 필수입니다', { 
 *     field: 'id', 
 *     received: options.id 
 *   });
 * }
 */
export class ValidationError extends UIError {
  constructor(message, context = {}) {
    super(message, context);
    this.name = 'ValidationError';
  }
}

/**
 * DOM 요소를 찾을 수 없을 때 발생하는 에러
 * 
 * @example
 * const element = document.querySelector(selector);
 * if (!element) {
 *   throw new ElementNotFoundError('요소를 찾을 수 없습니다', { 
 *     selector: selector 
 *   });
 * }
 */
export class ElementNotFoundError extends UIError {
  constructor(message, context = {}) {
    super(message, context);
    this.name = 'ElementNotFoundError';
  }
}

/**
 * 네트워크 요청 실패 에러
 * fetch, AJAX 등의 네트워크 오류 시 사용
 * 
 * @example
 * fetch(url)
 *   .then(response => {
 *     if (!response.ok) {
 *       throw new NetworkError('데이터 로드 실패', { 
 *         url: url, 
 *         status: response.status 
 *       });
 *     }
 *   });
 */
export class NetworkError extends UIError {
  constructor(message, context = {}) {
    super(message, context);
    this.name = 'NetworkError';
    this.statusCode = context.status || null;
    this.url = context.url || null;
  }
}

/**
 * 컴포넌트 초기화 실패 에러
 * 컴포넌트가 제대로 초기화되지 않았을 때 사용
 * 
 * @example
 * if (!this.initialized) {
 *   throw new InitializationError('컴포넌트 초기화 실패', { 
 *     component: 'Accordion',
 *     reason: 'Missing required elements'
 *   });
 * }
 */
export class InitializationError extends UIError {
  constructor(message, context = {}) {
    super(message, context);
    this.name = 'InitializationError';
  }
}

/**
 * 설정(Configuration) 에러
 * 잘못된 설정값이나 호환되지 않는 옵션 조합 시 사용
 * 
 * @example
 * if (options.singleOpen && options.multipleExpanded) {
 *   throw new ConfigurationError('singleOpen과 multipleExpanded는 함께 사용할 수 없습니다', {
 *     conflictingOptions: ['singleOpen', 'multipleExpanded']
 *   });
 * }
 */
export class ConfigurationError extends UIError {
  constructor(message, context = {}) {
    super(message, context);
    this.name = 'ConfigurationError';
  }
}

/**
 * 상태(State) 에러
 * 잘못된 상태나 예상치 못한 상태 전환 시 사용
 * 
 * @example
 * if (this.isAnimating) {
 *   throw new StateError('애니메이션 진행 중에는 실행할 수 없습니다', {
 *     currentState: 'animating',
 *     attemptedAction: 'toggle'
 *   });
 * }
 */
export class StateError extends UIError {
  constructor(message, context = {}) {
    super(message, context);
    this.name = 'StateError';
  }
}

/**
 * 타입 에러
 * 잘못된 데이터 타입 시 사용
 * 
 * @example
 * if (typeof callback !== 'function') {
 *   throw new TypeError('callback은 함수여야 합니다', {
 *     expected: 'function',
 *     received: typeof callback
 *   });
 * }
 */
export class TypeMismatchError extends UIError {
  constructor(message, context = {}) {
    super(message, context);
    this.name = 'TypeMismatchError';
  }
}

/**
 * 에러 핸들러 유틸리티
 * 에러를 일관되게 처리하는 헬퍼 함수들
 */
export const ErrorHandler = {
  /**
   * 에러를 처리하고 로그를 출력
   * @param {Error} error - 처리할 에러
   * @param {string} componentName - 컴포넌트 이름
   * @param {Object} options - 추가 옵션
   * @param {boolean} options.rethrow - 에러를 다시 던질지 여부 (기본: false)
   * @param {Function} options.fallback - 대체 동작 함수
   */
  handle(error, componentName = '', options = {}) {
    const { rethrow = false, fallback = null } = options;

    // UIError 계열이면 log 메서드 사용
    if (error instanceof UIError) {
      error.log(componentName);
    } else {
      // 일반 Error는 logger 직접 사용
      logger.error(error.message || '알 수 없는 에러', error, componentName);
    }

    // 대체 동작이 있으면 실행
    if (fallback && typeof fallback === 'function') {
      try {
        fallback(error);
      } catch (fallbackError) {
        logger.error('Fallback 실행 중 에러 발생', fallbackError, componentName);
      }
    }

    // 다시 던지기
    if (rethrow) {
      throw error;
    }
  },

  /**
   * Promise rejection을 처리
   * @param {string} componentName - 컴포넌트 이름
   * @param {Function} fallback - 실패 시 대체 동작
   * @returns {Function} catch에서 사용할 핸들러 함수
   */
  promiseHandler(componentName = '', fallback = null) {
    return (error) => {
      this.handle(error, componentName, { fallback });
    };
  },

  /**
   * 유효성 검사 헬퍼
   * @param {boolean} condition - 검사 조건
   * @param {string} message - 에러 메시지
   * @param {Object} context - 컨텍스트 정보
   * @throws {ValidationError}
   */
  validate(condition, message, context = {}) {
    if (!condition) {
      throw new ValidationError(message, context);
    }
  },

  /**
   * 필수 파라미터 검사
   * @param {Object} params - 검사할 파라미터 객체
   * @param {Array<string>} requiredKeys - 필수 키 배열
   * @param {string} componentName - 컴포넌트 이름
   * @throws {ValidationError}
   */
  requireParams(params, requiredKeys, componentName = '') {
    for (const key of requiredKeys) {
      if (params[key] === undefined || params[key] === null) {
        throw new ValidationError(
          `필수 파라미터 "${key}"가 없습니다`,
          { 
            component: componentName,
            missingKey: key,
            receivedParams: Object.keys(params)
          }
        );
      }
    }
  },

  /**
   * DOM 요소 존재 검사
   * @param {Element|null} element - 검사할 요소
   * @param {string} selector - 선택자
   * @param {string} componentName - 컴포넌트 이름
   * @throws {ElementNotFoundError}
   */
  requireElement(element, selector, componentName = '') {
    if (!element) {
      throw new ElementNotFoundError(
        `요소를 찾을 수 없습니다: ${selector}`,
        { 
          component: componentName,
          selector: selector
        }
      );
    }
  },

  /**
   * 타입 검사
   * @param {any} value - 검사할 값
   * @param {string} expectedType - 기대하는 타입 ('string', 'number', 'function', 'object', 'array')
   * @param {string} paramName - 파라미터 이름
   * @throws {TypeMismatchError}
   */
  requireType(value, expectedType, paramName = '') {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    
    if (actualType !== expectedType) {
      throw new TypeMismatchError(
        `"${paramName}"의 타입이 올바르지 않습니다`,
        {
          expected: expectedType,
          received: actualType,
          value: value
        }
      );
    }
  }
};

/**
 * 전역 에러 핸들러 설정
 * 애플리케이션 시작 시 한 번 호출
 */
export function setupGlobalErrorHandler() {
  // 처리되지 않은 에러
  window.addEventListener('error', (event) => {
    logger.error('처리되지 않은 에러', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    }, 'Global');
    
    // 기본 에러 다이얼로그 표시 방지 (선택사항)
    // event.preventDefault();
  });

  // 처리되지 않은 Promise rejection
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('처리되지 않은 Promise rejection', {
      reason: event.reason,
      promise: event.promise
    }, 'Global');
    
    // 콘솔 에러 방지 (선택사항)
    // event.preventDefault();
  });

  logger.info('전역 에러 핸들러 설정 완료', null, 'ErrorHandler');
}
