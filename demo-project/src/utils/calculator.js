/**
 * 计算器类
 * 演示面向对象的代码组织
 * @module utils/calculator
 */

/**
 * 计算器类
 */
export class Calculator {
  /**
   * 加法
   * @param {number} a - 第一个数
   * @param {number} b - 第二个数
   * @returns {number} 两数之和
   */
  add(a, b) {
    this._validateNumbers(a, b);
    return a + b;
  }

  /**
   * 减法
   * @param {number} a - 被减数
   * @param {number} b - 减数
   * @returns {number} 两数之差
   */
  subtract(a, b) {
    this._validateNumbers(a, b);
    return a - b;
  }

  /**
   * 乘法
   * @param {number} a - 第一个数
   * @param {number} b - 第二个数
   * @returns {number} 两数之积
   */
  multiply(a, b) {
    this._validateNumbers(a, b);
    return a * b;
  }

  /**
   * 除法
   * @param {number} a - 被除数
   * @param {number} b - 除数
   * @returns {number} 两数之商
   * @throws {Error} 当除数为0时抛出错误
   */
  divide(a, b) {
    this._validateNumbers(a, b);
    if (b === 0) {
      throw new Error('Division by zero is not allowed');
    }
    return a / b;
  }

  /**
   * 验证输入是否为数字
   * @private
   * @param {number} a - 第一个数
   * @param {number} b - 第二个数
   * @throws {Error} 当输入不是数字时抛出错误
   */
  _validateNumbers(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Both arguments must be numbers');
    }
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      throw new Error('Arguments must be finite numbers');
    }
  }
}
