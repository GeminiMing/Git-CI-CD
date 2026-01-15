#!/bin/bash
# 快速开始脚本 - 演示完整的工程实践流程

set -e  # 遇到错误立即退出

echo "🚀 开始演示CI/CD工程实践流程..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 步骤1: 安装依赖
echo -e "${BLUE}📦 步骤1: 安装项目依赖...${NC}"
if [ ! -d "node_modules" ]; then
  npm ci
else
  echo "  依赖已安装，跳过"
fi
echo ""

# 步骤2: 运行测试
echo -e "${BLUE}🧪 步骤2: 运行测试...${NC}"
npm test
echo ""

# 步骤3: 代码检查
echo -e "${BLUE}🔍 步骤3: 运行代码质量检查...${NC}"
echo "  运行ESLint..."
npm run lint || echo -e "${YELLOW}  ⚠️  Lint检查有问题，请手动修复${NC}"
echo ""

echo "  检查代码格式..."
npm run format:check || {
  echo -e "${YELLOW}  ⚠️  代码格式需要修复，正在自动修复...${NC}"
  npm run format
}
echo ""

# 步骤4: 构建验证
echo -e "${BLUE}📦 步骤4: 验证构建...${NC}"
npm run build
echo ""

# 步骤5: 显示测试覆盖率
echo -e "${BLUE}📊 步骤5: 生成测试覆盖率报告...${NC}"
npm run test:coverage
echo ""

# 完成
echo -e "${GREEN}✅ 所有检查完成！${NC}"
echo ""
echo "接下来你可以："
echo "  1. 查看测试覆盖率报告: open coverage/lcov-report/index.html"
echo "  2. 运行项目: npm start"
echo "  3. 查看Git状态: git status"
echo "  4. 查看完整流程演示: cat 演示流程.md"
