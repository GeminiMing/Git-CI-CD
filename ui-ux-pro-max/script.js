// Git工作流数据
const gitData = {
    main: [
        { hash: 'df56c2d', message: 'chore: 初始化项目', time: '3小时前', author: 'GeminiMing' },
        { hash: 'fa2aa3c', message: 'fix: 修复CI配置', time: '2小时前', author: 'GeminiMing' },
        { hash: 'ade3705', message: 'docs: 添加分享文档', time: '刚刚', author: 'GeminiMing', active: true }
    ],
    develop: [
        { hash: 'a1b2c3d', message: 'feat: 添加新功能', time: '1小时前', author: 'GeminiMing' }
    ],
    features: []
};

// CI/CD状态
let pipelineState = {
    running: false,
    currentStage: null,
    stages: [
        { id: 'lint', name: 'Lint & Format', icon: '🔍', steps: ['ESLint检查', 'Prettier格式化'] },
        { id: 'test', name: '测试', icon: '🧪', steps: ['单元测试 (Node 18)', '单元测试 (Node 20)', '覆盖率报告'] },
        { id: 'build', name: '构建', icon: '📦', steps: ['构建验证'] },
        { id: 'security', name: '安全扫描', icon: '🔒', steps: ['npm audit', 'Snyk扫描'] }
    ]
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderGitWorkflow();
    renderPipelineStages();
    updateStats();
});

// 渲染Git工作流
function renderGitWorkflow() {
    const mainCommits = document.getElementById('main-commits');
    mainCommits.innerHTML = gitData.main.map(commit => createCommitHTML(commit, 'main')).join('');

    const developCommits = document.getElementById('develop-commits');
    developCommits.innerHTML = gitData.develop.map(commit => createCommitHTML(commit, 'develop')).join('');
}

function createCommitHTML(commit, branch) {
    const isActive = commit.active || false;
    const borderColor = branch === 'main' ? 'border-green-500/50' : 'border-blue-500/50';
    const bgColor = isActive ? 'bg-green-500/10 border-green-500' : 'bg-dark-hover';
    
    return `
        <div class="commit-item group cursor-pointer ${bgColor} ${isActive ? borderColor : 'border-dark-border'} border rounded-lg p-3 hover:border-blue-500/70 transition-all duration-200" 
             data-hash="${commit.hash}" 
             onclick="showCommitDetails('${commit.hash}')">
            <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                            ${commit.author.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                            <code class="text-xs font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">${commit.hash.substring(0, 7)}</code>
                            <span class="text-sm font-medium text-white truncate">${commit.message}</span>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-slate-400">
                            <span>${commit.author}</span>
                            <span>•</span>
                            <span>${commit.time}</span>
                        </div>
                    </div>
                </div>
                ${isActive ? `
                    <div class="flex-shrink-0">
                        <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">
                            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                            </svg>
                            最新
                        </span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// 渲染Pipeline阶段
function renderPipelineStages() {
    const container = document.getElementById('pipeline-stages');
    container.innerHTML = pipelineState.stages.map(stage => `
        <div class="stage-container bg-dark-hover border border-dark-border rounded-xl p-4 transition-all duration-300" id="stage-${stage.id}">
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                        <span class="text-xl">${stage.icon}</span>
                    </div>
                    <div>
                        <h4 class="font-medium text-white">${stage.name}</h4>
                        <p class="text-xs text-slate-400">等待执行</p>
                    </div>
                </div>
                <div class="stage-status flex items-center gap-2" id="status-${stage.id}">
                    <div class="w-2 h-2 rounded-full bg-slate-500"></div>
                    <span class="text-xs text-slate-400">等待中</span>
                </div>
            </div>
            <div class="space-y-2" id="steps-${stage.id}">
                ${stage.steps.map(step => `
                    <div class="step-item flex items-center justify-between py-2 px-3 bg-dark-bg rounded-lg">
                        <span class="text-sm text-slate-300">${step}</span>
                        <span class="step-icon text-slate-500">⏳</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// 创建新提交
function createCommit() {
    if (pipelineState.running) {
        showNotification('CI流程正在运行中，请稍候...', 'warning');
        return;
    }

    const messages = [
        'feat: 添加新功能',
        'fix: 修复bug',
        'docs: 更新文档',
        'refactor: 重构代码',
        'test: 添加测试用例',
        'chore: 更新依赖'
    ];
    
    const message = messages[Math.floor(Math.random() * messages.length)];
    const hash = generateHash();
    
    const newCommit = {
        hash: hash,
        message: message,
        time: '刚刚',
        author: 'GeminiMing',
        active: true
    };

    // 移除之前的active状态
    gitData.main.forEach(c => c.active = false);
    
    // 添加新提交
    gitData.main.unshift(newCommit);
    
    renderGitWorkflow();
    
    // 在终端中显示git命令
    displayInTerminal('git add .', () => {
        setTimeout(() => {
            displayInTerminal(`git commit -m "${message}"`, () => {
                setTimeout(() => {
                    displayInTerminal('git push origin main', () => {
                        showCommitDetails(hash);
                    });
                }, 300);
            });
        }, 300);
    });
    
    // 视觉反馈
    const commitElement = document.querySelector(`[data-hash="${hash}"]`);
    if (commitElement) {
        commitElement.classList.add('animate-pulse');
        setTimeout(() => commitElement.classList.remove('animate-pulse'), 1000);
    }
    
    showNotification(`✅ 新提交已创建: ${message}`, 'success');
    
    // 自动触发CI
    setTimeout(() => {
        runPipeline();
    }, 2000);
}

// 创建分支
function createBranch() {
    const branchNames = [
        'feature/user-auth',
        'feature/payment',
        'fix/security-patch',
        'refactor/api-layer',
        'feat/dashboard'
    ];
    
    const name = branchNames[Math.floor(Math.random() * branchNames.length)];
    
    gitData.features.push({
        name: name,
        commits: [{ hash: generateHash(), message: 'feat: 新功能开发', author: 'GeminiMing' }]
    });
    
    showNotification(`🌿 分支已创建: ${name}`, 'info');
}

// 合并分支
function mergeBranch(branchName) {
    const branch = gitData.features.find(b => b.name === branchName);
    if (branch) {
        gitData.main.unshift({
            hash: generateHash(),
            message: `merge: ${branchName}`,
            time: '刚刚',
            author: 'GeminiMing',
            active: true
        });
        gitData.features = gitData.features.filter(b => b.name !== branchName);
        renderGitWorkflow();
        showNotification(`✅ 分支已合并: ${branchName}`, 'success');
    }
}

// 显示Git日志
function showGitLog() {
    const modal = document.getElementById('gitLogModal');
    const content = document.getElementById('gitLogContent');
    
    const allCommits = [...gitData.main, ...gitData.develop];
    content.innerHTML = allCommits.map(commit => `
        <div class="p-3 bg-dark-hover border border-dark-border rounded-lg hover:border-blue-500/50 transition-colors cursor-pointer">
            <div class="flex items-center gap-3 mb-2">
                <code class="text-xs font-mono text-blue-400">${commit.hash.substring(0, 7)}</code>
                <span class="text-sm font-medium text-white">${commit.message}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400">
                <span>${commit.author}</span>
                <span>•</span>
                <span>${commit.time}</span>
            </div>
        </div>
    `).join('');
    
    modal.classList.remove('hidden');
}

// 代码变更示例数据
const codeDiffs = {
    'df56c2d': {
        files: [
            { name: 'src/utils/calculator.js', type: 'added', lines: 45 },
            { name: 'tests/calculator.test.js', type: 'added', lines: 32 }
        ],
        diff: `diff --git a/src/utils/calculator.js b/src/utils/calculator.js
new file mode 100644
index 0000000..a1b2c3d
--- /dev/null
+++ b/src/utils/calculator.js
@@ -0,0 +1,45 @@
+/**
+ * 计算器类
+ */
+export class Calculator {
+  add(a, b) {
+    return a + b;
+  }
+  
+  subtract(a, b) {
+    return a - b;
+  }
+  
+  multiply(a, b) {
+    return a * b;
+  }
+  
+  divide(a, b) {
+    if (b === 0) {
+      throw new Error('Division by zero');
+    }
+    return a / b;
+  }
+}`
    },
    'fa2aa3c': {
        files: [
            { name: '.github/workflows/ci.yml', type: 'modified', lines: 15 }
        ],
        diff: `diff --git a/.github/workflows/ci.yml b/.github/workflows/ci.yml
index a1b2c3d..f4e5d6a
--- a/.github/workflows/ci.yml
+++ b/.github/workflows/ci.yml
@@ -24,7 +24,7 @@ jobs:
       - name: Install dependencies
-        run: npm ci
+        working-directory: ./demo-project
+        run: npm ci
       
       - name: Run ESLint`
    },
    'ade3705': {
        files: [
            { name: '分享步骤总结.md', type: 'added', lines: 318 }
        ],
        diff: `diff --git a/分享步骤总结.md b/分享步骤总结.md
new file mode 100644
index 0000000..c7d8e9f
--- /dev/null
+++ b/分享步骤总结.md
@@ -0,0 +1,318 @@
+# 基石（+1）：坚实的工程实践 - Git/CI/CD基础
+
+## 📋 分享准备清单
+...`
    }
};

// 生成代码diff（如果没有预定义的）
function generateCodeDiff(commit) {
    const messages = commit.message.toLowerCase();
    const files = [];
    let diff = '';
    
    if (messages.includes('feat')) {
        files.push({ name: 'src/features/new-feature.js', type: 'added', lines: 50 });
        diff = `diff --git a/src/features/new-feature.js b/src/features/new-feature.js
new file mode 100644
index 0000000..a1b2c3d
--- /dev/null
+++ b/src/features/new-feature.js
@@ -0,0 +1,50 @@
+/**
+ * 新功能实现
+ */
+export function newFeature() {
+  // 功能实现
+  return true;
+}`;
    } else if (messages.includes('fix')) {
        files.push({ name: 'src/utils/validator.js', type: 'modified', lines: 12 });
        diff = `diff --git a/src/utils/validator.js b/src/utils/validator.js
index a1b2c3d..f4e5d6a
--- a/src/utils/validator.js
+++ b/src/utils/validator.js
@@ -10,7 +10,7 @@ export function validateEmail(email) {
-    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
+    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
     return emailRegex.test(email);
   }
 }`;
    } else if (messages.includes('test')) {
        files.push({ name: 'tests/feature.test.js', type: 'added', lines: 25 });
        diff = `diff --git a/tests/feature.test.js b/tests/feature.test.js
new file mode 100644
index 0000000..a1b2c3d
--- /dev/null
+++ b/tests/feature.test.js
@@ -0,0 +1,25 @@
+describe('Feature Tests', () => {
+  test('should work correctly', () => {
+    expect(true).toBe(true);
+  });
+});`;
    }
    
    return { files, diff: diff || 'No changes' };
}

// 显示提交详情
function showCommitDetails(hash) {
    const commit = [...gitData.main, ...gitData.develop].find(c => c.hash === hash);
    if (!commit) return;
    
    // 获取代码diff
    const diffData = codeDiffs[hash] || generateCodeDiff(commit);
    
    // 显示在终端中
    displayInTerminal(`git show ${hash.substring(0, 7)}`, () => {
        const terminalContent = document.getElementById('terminal-content');
        const commitInfoPanel = document.getElementById('commit-info');
        const codeDiffPanel = document.getElementById('code-diff');
        const detailsPanel = document.getElementById('commit-details-panel');
        
        // 显示提交信息
        commitInfoPanel.innerHTML = `
            <div class="space-y-1.5">
                <div class="flex items-center gap-2">
                    <span class="text-slate-400">Commit:</span>
                    <code class="text-blue-400">${hash.substring(0, 7)}</code>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-slate-400">Author:</span>
                    <span class="text-white">${commit.author}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-slate-400">Date:</span>
                    <span class="text-white">${commit.time}</span>
                </div>
                <div class="flex items-start gap-2">
                    <span class="text-slate-400">Message:</span>
                    <span class="text-white">${commit.message}</span>
                </div>
                <div class="flex items-start gap-2 pt-2 border-t border-dark-border">
                    <span class="text-slate-400">Files:</span>
                    <div class="flex-1">
                        ${diffData.files.map(f => `
                            <div class="flex items-center gap-2 mb-1">
                                <span class="text-xs px-1.5 py-0.5 rounded ${f.type === 'added' ? 'bg-green-500/20 text-green-400' : f.type === 'modified' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}">
                                    ${f.type === 'added' ? '+' : f.type === 'modified' ? '~' : '-'}
                                </span>
                                <span class="text-white text-xs">${f.name}</span>
                                <span class="text-slate-500 text-xs">(${f.lines} lines)</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // 显示代码diff
        codeDiffPanel.innerHTML = formatDiff(diffData.diff);
        
        // 显示详情面板
        detailsPanel.classList.remove('hidden');
        detailsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

// 格式化diff代码
function formatDiff(diffText) {
    const lines = diffText.split('\n');
    return lines.map(line => {
        let className = 'text-slate-400';
        if (line.startsWith('+') && !line.startsWith('+++')) {
            className = 'text-green-400 bg-green-500/10';
        } else if (line.startsWith('-') && !line.startsWith('---')) {
            className = 'text-red-400 bg-red-500/10';
        } else if (line.startsWith('@@')) {
            className = 'text-blue-400';
        } else if (line.startsWith('diff') || line.startsWith('index') || line.startsWith('---') || line.startsWith('+++')) {
            className = 'text-purple-400';
        }
        return `<div class="${className} py-0.5">${escapeHtml(line)}</div>`;
    }).join('');
}

// HTML转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 在终端中显示命令和输出
function displayInTerminal(command, callback) {
    const terminalContent = document.getElementById('terminal-content');
    const prompt = document.getElementById('terminal-prompt');
    
    // 添加命令
    prompt.innerHTML = `
        <span class="text-green-400">$</span>
        <span class="text-slate-300 ml-2">${command}</span>
    `;
    
    // 模拟执行
    setTimeout(() => {
        if (callback) callback();
        
        // 添加新的提示符
        setTimeout(() => {
            prompt.innerHTML = `
                <span class="text-green-400">$</span>
                <span class="text-slate-300 ml-2 animate-pulse">_</span>
            `;
        }, 500);
    }, 300);
}

// 清除终端
function clearTerminal() {
    const terminalContent = document.getElementById('terminal-content');
    terminalContent.innerHTML = `
        <div class="terminal-prompt" id="terminal-prompt">
            <span class="text-green-400">$</span>
            <span class="text-slate-300 ml-2 animate-pulse">_</span>
        </div>
    `;
    hideCommitDetails();
}

// 隐藏提交详情
function hideCommitDetails() {
    document.getElementById('commit-details-panel').classList.add('hidden');
}

// 运行CI流程
async function runPipeline() {
    if (pipelineState.running) {
        showNotification('⏳ CI流程正在运行中...', 'warning');
        return;
    }

    pipelineState.running = true;
    const runBtn = document.getElementById('run-btn');
    runBtn.disabled = true;
    runBtn.classList.add('opacity-50', 'cursor-not-allowed');
    
    resetPipeline();
    
    const statusEl = document.getElementById('pipeline-status');
    statusEl.innerHTML = `
        <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span class="text-sm text-blue-400">运行中</span>
        </div>
    `;
    
    showNotification('🚀 CI流程已启动...', 'info');
    
    try {
        for (let i = 0; i < pipelineState.stages.length; i++) {
            const stage = pipelineState.stages[i];
            await runStage(stage);
        }
        
        // 显示最终成功结果
        const resultEl = document.getElementById('pipeline-result');
        resultEl.innerHTML = `
            <div class="text-center py-6">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                    <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <p class="text-lg font-semibold text-green-400 mb-1">CI流程执行成功</p>
                <p class="text-sm text-slate-400">所有检查已通过</p>
            </div>
        `;
        
        statusEl.innerHTML = `
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
                <span class="text-sm text-green-400">成功</span>
            </div>
        `;
        
        showNotification('✅ CI流程执行完成！', 'success');
    } catch (error) {
        const resultEl = document.getElementById('pipeline-result');
        resultEl.innerHTML = `
            <div class="text-center py-6">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
                    <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </div>
                <p class="text-lg font-semibold text-red-400 mb-1">CI流程执行失败</p>
                <p class="text-sm text-slate-400">请检查错误详情</p>
            </div>
        `;
        
        statusEl.innerHTML = `
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-red-500"></div>
                <span class="text-sm text-red-400">失败</span>
            </div>
        `;
        
        showNotification('❌ CI流程执行失败', 'error');
    } finally {
        pipelineState.running = false;
        runBtn.disabled = false;
        runBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

// 运行单个阶段
async function runStage(stage) {
    const stageEl = document.getElementById(`stage-${stage.id}`);
    const statusEl = document.getElementById(`status-${stage.id}`);
    const stepsEl = document.getElementById(`steps-${stage.id}`);
    
    // 设置为运行中
    stageEl.classList.add('border-blue-500/50', 'bg-blue-500/5');
    stageEl.classList.remove('border-dark-border');
    statusEl.innerHTML = `
        <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span class="text-xs text-blue-400">运行中</span>
        </div>
    `;
    
    // 更新步骤状态
    const stepItems = stepsEl.querySelectorAll('.step-item');
    stepItems.forEach((item, index) => {
        setTimeout(() => {
            const icon = item.querySelector('.step-icon');
            icon.textContent = '🔄';
            icon.classList.remove('text-slate-500');
            icon.classList.add('text-blue-400', 'animate-spin');
        }, index * 400);
    });
    
    // 模拟执行时间
    await sleep(2000 + Math.random() * 1000);
    
    // 90%成功率
    const success = Math.random() > 0.1;
    
    if (success) {
        stageEl.classList.remove('border-blue-500/50', 'bg-blue-500/5');
        stageEl.classList.add('border-green-500/50', 'bg-green-500/5');
        statusEl.innerHTML = `
            <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-xs text-green-400">成功</span>
            </div>
        `;
        
        stepItems.forEach((item, index) => {
            setTimeout(() => {
                const icon = item.querySelector('.step-icon');
                icon.innerHTML = '<svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
                icon.classList.remove('text-blue-400', 'animate-spin');
            }, index * 200);
        });
    } else {
        stageEl.classList.remove('border-blue-500/50', 'bg-blue-500/5');
        stageEl.classList.add('border-red-500/50', 'bg-red-500/5');
        statusEl.innerHTML = `
            <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                <span class="text-xs text-red-400">失败</span>
            </div>
        `;
        
        stepItems.forEach((item) => {
            const icon = item.querySelector('.step-icon');
            icon.innerHTML = '<svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
            icon.classList.remove('text-blue-400', 'animate-spin');
        });
        
        throw new Error(`Stage ${stage.id} failed`);
    }
    
    await sleep(500);
}

// 重置Pipeline
function resetPipeline() {
    pipelineState.running = false;
    
    const stages = document.querySelectorAll('.stage-container');
    stages.forEach(stage => {
        stage.classList.remove('border-blue-500/50', 'bg-blue-500/5', 'border-green-500/50', 'bg-green-500/5', 'border-red-500/50', 'bg-red-500/5');
        stage.classList.add('border-dark-border');
    });
    
    const statuses = document.querySelectorAll('.stage-status');
    statuses.forEach(status => {
        status.innerHTML = `
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-slate-500"></div>
                <span class="text-xs text-slate-400">等待中</span>
            </div>
        `;
    });
    
    const steps = document.querySelectorAll('.step-icon');
    steps.forEach(step => {
        step.textContent = '⏳';
        step.className = 'step-icon text-slate-500';
    });
    
    const resultEl = document.getElementById('pipeline-result');
    resultEl.innerHTML = `
        <div class="text-center py-4 text-slate-400">
            <svg class="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-sm">等待执行...</p>
        </div>
    `;
    
    const statusEl = document.getElementById('pipeline-status');
    statusEl.innerHTML = `
        <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-slate-500"></div>
            <span class="text-sm text-slate-400">等待中</span>
        </div>
    `;
}

// 查看CI详情
function viewDetails() {
    const modal = document.getElementById('ciDetailsModal');
    const content = document.getElementById('ciDetailsContent');
    
    const details = `
        <div class="space-y-4">
            <div class="p-4 bg-dark-hover border border-dark-border rounded-lg">
                <h4 class="font-medium text-white mb-3">运行信息</h4>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-slate-400">触发时间:</span>
                        <span class="text-white">${new Date().toLocaleString('zh-CN')}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400">触发方式:</span>
                        <span class="text-white">Push to main</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400">提交哈希:</span>
                        <code class="text-blue-400">${gitData.main[0].hash.substring(0, 7)}</code>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400">状态:</span>
                        <span class="text-green-400">成功</span>
                    </div>
                </div>
            </div>
            <div class="p-4 bg-dark-hover border border-dark-border rounded-lg">
                <h4 class="font-medium text-white mb-3">执行阶段</h4>
                <div class="space-y-2 text-sm">
                    <div class="flex items-center justify-between">
                        <span class="text-slate-300">Lint & Format</span>
                        <span class="text-green-400 flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            7s
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-slate-300">测试</span>
                        <span class="text-green-400 flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            15s
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-slate-300">构建</span>
                        <span class="text-green-400 flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            3s
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-slate-300">安全扫描</span>
                        <span class="text-green-400 flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            29s
                        </span>
                    </div>
                </div>
            </div>
            <div class="p-4 bg-dark-hover border border-dark-border rounded-lg">
                <h4 class="font-medium text-white mb-3">测试结果</h4>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-slate-400">测试套件:</span>
                        <span class="text-white">3 passed</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400">测试用例:</span>
                        <span class="text-white">18 passed</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400">覆盖率:</span>
                        <span class="text-green-400">100%</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    content.innerHTML = details;
    modal.classList.remove('hidden');
}

// 关闭模态框
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// 切换主题
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    showNotification('主题已切换', 'info');
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

// 工具函数
function generateHash() {
    return Math.random().toString(16).substring(2, 10) + 
           Math.random().toString(16).substring(2, 10);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateStats() {
    // Stats are static for now
}

function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-amber-500',
        info: 'bg-blue-500'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-xl text-white font-medium transform transition-all duration-300 translate-x-full ${colors[type]}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
