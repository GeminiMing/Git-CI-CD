/**
 * 问候工具函数
 * @module utils/greeting
 */

/**
 * 生成问候语
 * @param {string} name - 要问候的名字
 * @returns {string} 问候语
 */
export function greet(name) {
  if (!name || typeof name !== 'string') {
    throw new Error('Name must be a non-empty string');
  }
  return `👋 欢迎使用 ${name}!`;
}
