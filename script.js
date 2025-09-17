// 全局变量存储原始文件内容
let originalFileContent = '';

// DOM元素
const fileUpload = document.getElementById('file-upload');
const imgCountElement = document.getElementById('img-count');
const coordinatesInput = document.getElementById('coordinates-input');
const updateBtn = document.getElementById('update-btn');
const outputCodeElement = document.getElementById('output-code');
const copyBtn = document.getElementById('copy-btn');
const uploadLabel = document.querySelector('.upload-label');

// 初始化页面
function init() {
    // 文件上传事件监听
    fileUpload.addEventListener('change', handleFileUpload);
    
    // 拖放功能
    const uploadBox = document.querySelector('.upload-box');
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = '#ff7043';
        uploadLabel.style.backgroundColor = '#ff7043';
    });
    
    uploadBox.addEventListener('dragleave', () => {
        uploadBox.style.borderColor = '#ffab91';
        uploadLabel.style.backgroundColor = '#ff8a65';
    });
    
    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = '#ffab91';
        uploadLabel.style.backgroundColor = '#ff8a65';
        
        if (e.dataTransfer.files.length) {
            fileUpload.files = e.dataTransfer.files;
            handleFileUpload({ target: fileUpload });
        }
    });
    
    // 更新按钮事件
    updateBtn.addEventListener('click', updateCoordinates);
    
    // 复制按钮事件
    copyBtn.addEventListener('click', copyCode);
    
    // 初始化输出区域
    outputCodeElement.textContent = '上传文件并更新坐标后，这里将显示新的代码...';
}

// 处理文件上传
function handleFileUpload(e) {
    const file = e.target.files[0];
    
    if (!file) {
        return;
    }
    
    // 检查文件类型
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'til' && fileExtension !== 'txt') {
        alert('请上传 .til 或 .txt 格式的文件！');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
        originalFileContent = event.target.result;
        analyzeFile(originalFileContent);
        
        // 显示上传成功提示
        uploadLabel.innerHTML = `<span style="color: #4caf50;">✅ 已上传: ${file.name}</span>`;
        setTimeout(() => {
            uploadLabel.innerHTML = '<span>点击或拖拽文件到这里</span>';
        }, 3000);
    };
    
    reader.readAsText(file);
}

// 分析文件内容
function analyzeFile(content) {
    // 查找所有IMG标签数量
    const imgMatch = content.match(/\[IMG\d+\]/g);
    const imgCount = imgMatch ? imgMatch.length : 0;
    
    // 更新显示
    imgCountElement.textContent = imgCount;
    
    // 更新提示信息，告知用户可以输入任意数量的坐标
    coordinatesInput.placeholder = `请输入坐标，每行一个 (格式：x,y,w,h)\n系统将根据输入数量自动生成或更新[IMG]部分\n例如：\n198,0,229,162\n426,0,228,162\n...`;
}

// 更新坐标信息
function updateCoordinates() {
    if (!originalFileContent) {
        alert('请先上传文件！');
        return;
    }
    
    // 获取用户输入的坐标
    const coordinatesText = coordinatesInput.value.trim();
    if (!coordinatesText) {
        alert('请输入坐标信息！');
        return;
    }
    
    // 解析坐标
    const coordinates = coordinatesText.split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');
    
    // 检查坐标格式
    const validCoordinates = coordinates.filter(line => {
        const parts = line.split(',');
        return parts.length === 4 && parts.every(part => !isNaN(parseInt(part)));
    });
    
    if (validCoordinates.length !== coordinates.length) {
        alert('坐标格式不正确！请确保每行一个坐标，格式为 x,y,w,h (数字)');
        return;
    }
    
    // 更新文件内容
    let updatedContent = '';
    
    // 提取[GLOBAL]部分
    const globalMatch = originalFileContent.match(/\[GLOBAL\][\s\S]*?(?=\[IMG|$)/);
    if (globalMatch) {
        updatedContent = globalMatch[0].trim() + '\n\n';
    }
    
    // 根据用户输入的坐标数量生成新的[IMG]部分
    validCoordinates.forEach((coordinate, index) => {
        const imgIndex = index + 1;
        updatedContent += `[IMG${imgIndex}]\nSOURCE_RECT=${coordinate}\n\n`;
    });
    
    // 移除最后的换行符
    updatedContent = updatedContent.trim();
    
    // 显示更新后的代码
    outputCodeElement.textContent = updatedContent;
    
    // 滚动到输出区域
    document.querySelector('.output-section').scrollIntoView({ behavior: 'smooth' });
    
    // 添加成功动画效果
    outputCodeElement.style.backgroundColor = 'rgba(220, 237, 200, 0.8)';
    setTimeout(() => {
        outputCodeElement.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    }, 1000);
}

// 复制代码功能
function copyCode() {
    const codeToCopy = outputCodeElement.textContent;
    
    if (codeToCopy === '上传文件并更新坐标后，这里将显示新的代码...') {
        alert('没有可复制的代码！请先上传文件并更新坐标。');
        return;
    }
    
    navigator.clipboard.writeText(codeToCopy).then(() => {
        // 显示复制成功提示
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ 已复制！';
        copyBtn.style.backgroundColor = '#4caf50';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '#9575cd';
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制代码。');
    });
}

// 添加一些可爱的交互效果
function addCuteEffects() {
    // 为按钮添加悬停效果
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-3px) scale(1.03)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(-1px) scale(1)';
        });
    });
    
    // 随机生成更多星星
    const cuteElements = document.querySelector('.cute-elements');
    for (let i = 0; i < 10; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.width = `${Math.random() * 10 + 5}px`;
        star.style.height = star.style.width;
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.opacity = Math.random() * 0.5 + 0.3;
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite ${Math.random() * 2}s`;
        cuteElements.appendChild(star);
    }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
    init();
    addCuteEffects();
});