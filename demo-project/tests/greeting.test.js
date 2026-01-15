/**
 * greeting 模块测试
 */
import { greet } from '../src/utils/greeting.js';

describe('greet函数', () => {
  test('应该返回正确的问候语', () => {
    expect(greet('Claude')).toBe('👋 欢迎使用 Claude!');
  });

  test('应该处理空字符串', () => {
    expect(() => greet('')).toThrow('Name must be a non-empty string');
  });

  test('应该处理非字符串输入', () => {
    expect(() => greet(null)).toThrow('Name must be a non-empty string');
    expect(() => greet(123)).toThrow('Name must be a non-empty string');
  });
});
