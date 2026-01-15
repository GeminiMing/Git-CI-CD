/**
 * 验证工具函数
 * @module utils/validator
 */

/**
 * 验证邮箱格式
 * @param {string} email - 要验证的邮箱地址
 * @returns {boolean} 是否为有效的邮箱格式
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // 基础的邮箱正则表达式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
