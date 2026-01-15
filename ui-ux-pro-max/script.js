// Git工作流数据
const gitData = {
    main: [
        { hash: 'df56c2d', message: 'chore: 初始化项目', time: '3小时前' },
        { hash: 'fa2aa3c', message: 'fix: 修复CI配置', time: '2小时前' },
        { hash: 'ade3705', message: 'docs: 添加分享文档', time: '刚刚', active: true }
    ],
    develop: [
        { hash: 'a1b2c3d', message: 'feat: 添加新功能', time: '1小时前' }
    ],
    features: [
        { name: 'feature/new-feature', commits: [
            { hash: 'x1y2z3w', message: 'feat: 添加新功能' }
        ]}
    ]
};

// CI/CD状态
let pipelineState = {
    running: false,
    currentStage: null,
    stages: ['lint', 'test', 'build', 'security']
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderGitWorkflow();
    updateStats();
});

// 渲染Git工作流
function renderGitWorkflow() {
    const mainCommits = document.getElementById('main-commits');
    mainCommits.innerHTML = gitData.main.map(commit => `
        <div class="commit ${commit.active ? 'active' : ''}" data-hash="${commit.hash}">
            <span class="commit-hash">${commit.hash.substring(0, 7)}</span>
            <span class="commit-message">${commit.message}</span>
            <span class="commit-time">${commit.time}</span>
        </div>
    `).join('');

    const developCommits = document.getElementById('develop-commits');
    developCommits.innerHTML = gitData.develop.map(commit => `
        <div class="commit" data-hash="${commit.hash}">
            <span class="commit-hash">${commit.hash.substring(0, 7)}</span>
            <span class="commit-message">${commit.message}</span>
            <span class="commit-time">${commit.time}</span>
        </div>
    `).join('');
}

// 创建新提交
function createCommit() {
    const messages = [
        'feat: 添加新功能',
        'fix: 修复bug',
        'docs: 更新文档',
        'refactor: 重构代码',
        'test: 添加测试用例'
    ];
    
    const message = messages[Math.floor(Math.random() * messages.length)];
    const hash = generateHash();
    
    const newCommit = {
        hash: hash,
        message: message,
        time: '刚刚',
        active: true
    };

    // 移除之前的active状态
    gitData.main.forEach(c => c.active = false);
    
    // 添加新提交
    gitData.main.unshift(newCommit);
    
    renderGitWorkflow();
    
    // 自动触发CI
    setTimeout(() => {
        runPipeline();
    }, 500);
    
    showNotification(`✨ 新提交: ${message}`, 'success');
}

// 创建分支
function createBranch() {
    const branchNames = [
        'feature/user-auth',
        'feature/payment',
        'fix/security-patch',
        'refactor/api-layer'
    ];
    
    const name = branchNames[Math.floor(Math.random() * branchNames.length)];
    
    const branchHTML = `
        <div class="branch feature-branch">
            <div class="branch-header">
                <span class="branch-name">${name}</span>
                <button class="btn-merge" onclick="mergeBranch('${name}')">合并</button>
            </div>
            <div class="commits">
                <div class="commit">
                    <span class="commit-hash">${generateHash().substring(0, 7)}</span>
                    <span class="commit-message">feat: 新功能开发</span>
                </div>
            </div>
        </div>
    `;
    
    const featureBranches = document.querySelector('.feature-branches');
    featureBranches.insertAdjacentHTML('beforeend', branchHTML);
    
    showNotification(`🌿 创建分支: ${name}`, 'info');
}

// 合并分支
function mergeBranch(branchName) {
    showNotification(`✅ 合并分支: ${branchName}`, 'success');
    
    // 找到并移除分支
    const branches = document.querySelectorAll('.feature-branch');
    branches.forEach(branch => {
        if (branch.querySelector('.branch-name').textContent === branchName) {
            branch.style.opacity = '0';
            branch.style.transform = 'translateX(-100px)';
            setTimeout(() => branch.remove(), 500);
        }
    });
}

// 显示Git日志
function showGitLog() {
    const modal = document.getElementById('gitLogModal');
    const content = document.getElementById('gitLogContent');
    
    const allCommits = [...gitData.main, ...gitData.develop];
    content.innerHTML = allCommits.map(commit => `
        <div class="git-log-entry">
            <strong>${commit.hash.substring(0, 7)}</strong> - ${commit.message}<br>
            <small>${commit.time}</small>
        </div>
    `).join('');
    
    modal.style.display = 'block';
}

// 运行CI流程
async function runPipeline() {
    if (pipelineState.running) {
        showNotification('⏳ CI流程正在运行中...', 'warning');
        return;
    }

    pipelineState.running = true;
    resetPipeline();
    
    const trigger = document.getElementById('trigger');
    trigger.style.transform = 'scale(1.1)';
    
    showNotification('🚀 开始运行CI流程...', 'info');
    
    // 运行各个阶段
    for (let i = 0; i < pipelineState.stages.length; i++) {
        const stageId = pipelineState.stages[i];
        await runStage(stageId);
    }
    
    // 显示最终结果
    const resultBox = document.getElementById('pipeline-result');
    resultBox.innerHTML = `
        <div class="result-box success">
            <span class="result-icon">✅</span>
            <span class="result-text">CI流程执行成功！</span>
        </div>
    `;
    
    pipelineState.running = false;
    trigger.style.transform = 'scale(1)';
    
    showNotification('✅ CI流程执行完成！', 'success');
}

// 运行单个阶段
async function runStage(stageId) {
    const stage = document.getElementById(`stage-${stageId}`);
    const status = document.getElementById(`status-${stageId}`);
    
    // 设置为运行中
    stage.classList.add('running');
    stage.classList.remove('success', 'failed');
    status.textContent = '运行中';
    status.className = 'stage-status running';
    
    // 更新步骤状态
    const steps = stage.querySelectorAll('.step-status');
    steps.forEach((step, index) => {
        setTimeout(() => {
            step.textContent = '⏳';
        }, index * 300);
    });
    
    // 模拟执行时间
    await sleep(2000);
    
    // 随机成功或失败（90%成功率）
    const success = Math.random() > 0.1;
    
    if (success) {
        stage.classList.remove('running');
        stage.classList.add('success');
        status.textContent = '成功';
        status.className = 'stage-status success';
        steps.forEach(step => {
            step.textContent = '✅';
        });
    } else {
        stage.classList.remove('running');
        stage.classList.add('failed');
        status.textContent = '失败';
        status.className = 'stage-status failed';
        steps.forEach(step => {
            step.textContent = '❌';
        });
        
        // 如果失败，停止后续阶段
        const resultBox = document.getElementById('pipeline-result');
        resultBox.innerHTML = `
            <div class="result-box failed">
                <span class="result-icon">❌</span>
                <span class="result-text">CI流程执行失败</span>
            </div>
        `;
        
        pipelineState.running = false;
        showNotification('❌ CI流程执行失败', 'error');
        throw new Error('Pipeline failed');
    }
    
    await sleep(500);
}

// 重置Pipeline
function resetPipeline() {
    pipelineState.running = false;
    
    const stages = document.querySelectorAll('.stage');
    stages.forEach(stage => {
        stage.classList.remove('running', 'success', 'failed');
    });
    
    const statuses = document.querySelectorAll('.stage-status');
    statuses.forEach(status => {
        status.textContent = '等待中';
        status.className = 'stage-status waiting';
    });
    
    const steps = document.querySelectorAll('.step-status');
    steps.forEach(step => {
        step.textContent = '⏳';
    });
    
    const resultBox = document.getElementById('pipeline-result');
    resultBox.innerHTML = `
        <div class="result-box waiting">
            <span class="result-icon">⏳</span>
            <span class="result-text">等待执行...</span>
        </div>
    `;
}

// 查看CI详情
function viewDetails() {
    const modal = document.getElementById('ciDetailsModal');
    const content = document.getElementById('ciDetailsContent');
    
    const details = `
        <div class="ci-detail-entry">
            <strong>触发时间:</strong> ${new Date().toLocaleString('zh-CN')}<br>
            <strong>触发方式:</strong> Push to main<br>
            <strong>提交哈希:</strong> ${gitData.main[0].hash}<br>
            <strong>状态:</strong> <span style="color: #10b981">成功</span>
        </div>
        <div class="ci-detail-entry">
            <strong>执行阶段:</strong><br>
            ✅ Lint & Format (7s)<br>
            ✅ 测试 (15s)<br>
            ✅ 构建 (3s)<br>
            ✅ 安全扫描 (29s)
        </div>
        <div class="ci-detail-entry">
            <strong>测试结果:</strong><br>
            - 测试套件: 3 passed<br>
            - 测试用例: 18 passed<br>
            - 覆盖率: 100%
        </div>
    `;
    
    content.innerHTML = details;
    modal.style.display = 'block';
}

// 更新统计信息
function updateStats() {
    document.getElementById('stat-files').textContent = '23';
    document.getElementById('stat-tests').textContent = '18';
    document.getElementById('stat-coverage').textContent = '100%';
    document.getElementById('stat-builds').textContent = '5';
}

// 关闭模态框
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
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

function showNotification(message, type = 'info') {
    // 简单的通知实现
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#06b6d4'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
