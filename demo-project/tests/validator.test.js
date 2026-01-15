/**
 * validator 模块测试
 */
import { validateEmail } from '../src/utils/validator.js';

describe('validateEmail函数', () => {
  test('应该验证有效的邮箱地址', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('user+tag@example.com')).toBe(true);
  });

  test('应该拒绝无效的邮箱地址', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('user@domain')).toBe(false);
  });

  test('应该处理边界情况', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail(undefined)).toBe(false);
    expect(validateEmail(123)).toBe(false);
  });
});
