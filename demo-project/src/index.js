/**
 * 项目主入口文件
 * 展示基础的工程实践和代码组织
 */

import { greet } from './utils/greeting.js';
import { Calculator } from './utils/calculator.js';
import { validateEmail } from './utils/validator.js';

/**
 * 主函数
 * @param {string[]} args - 命令行参数
 */
function main(args) {
  console.log(greet('Claude CI/CD Demo'));
  console.log('');

  // 演示计算器功能
  const calc = new Calculator();
  console.log('计算器演示:');
  console.log(`  10 + 5 = ${calc.add(10, 5)}`);
  console.log(`  10 - 5 = ${calc.subtract(10, 5)}`);
  console.log(`  10 * 5 = ${calc.multiply(10, 5)}`);
  console.log(`  10 / 5 = ${calc.divide(10, 5)}`);
  console.log('');

  // 演示验证功能
  console.log('邮箱验证演示:');
  const emails = ['test@example.com', 'invalid-email', 'user@domain.co.uk'];
  emails.forEach(email => {
    const isValid = validateEmail(email);
    console.log(`  ${email}: ${isValid ? '✓ 有效' : '✗ 无效'}`);
  });

  return 0;
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(main(process.argv.slice(2)));
}

export { main };
