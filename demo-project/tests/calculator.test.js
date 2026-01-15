/**
 * Calculator 类测试
 */
import { Calculator } from '../src/utils/calculator.js';

describe('Calculator类', () => {
  let calc;

  beforeEach(() => {
    calc = new Calculator();
  });

  describe('add方法', () => {
    test('应该正确计算两个正数之和', () => {
      expect(calc.add(2, 3)).toBe(5);
    });

    test('应该处理负数', () => {
      expect(calc.add(-2, 3)).toBe(1);
    });

    test('应该处理小数', () => {
      expect(calc.add(1.5, 2.5)).toBe(4);
    });
  });

  describe('subtract方法', () => {
    test('应该正确计算两个数之差', () => {
      expect(calc.subtract(5, 3)).toBe(2);
    });

    test('应该处理负数结果', () => {
      expect(calc.subtract(3, 5)).toBe(-2);
    });
  });

  describe('multiply方法', () => {
    test('应该正确计算两个数之积', () => {
      expect(calc.multiply(3, 4)).toBe(12);
    });

    test('应该处理0', () => {
      expect(calc.multiply(5, 0)).toBe(0);
    });
  });

  describe('divide方法', () => {
    test('应该正确计算两个数之商', () => {
      expect(calc.divide(10, 2)).toBe(5);
    });

    test('应该处理小数结果', () => {
      expect(calc.divide(1, 3)).toBeCloseTo(0.333, 2);
    });

    test('应该拒绝除以0', () => {
      expect(() => calc.divide(10, 0)).toThrow('Division by zero is not allowed');
    });
  });

  describe('输入验证', () => {
    test('应该拒绝非数字输入', () => {
      expect(() => calc.add('a', 1)).toThrow('Both arguments must be numbers');
      expect(() => calc.add(1, 'b')).toThrow('Both arguments must be numbers');
    });

    test('应该拒绝Infinity和NaN', () => {
      expect(() => calc.add(Infinity, 1)).toThrow('Arguments must be finite numbers');
      expect(() => calc.add(1, NaN)).toThrow('Arguments must be finite numbers');
    });
  });
});
