---
title: "评论系统调试页面"
date: 2023-06-23
description: "调试评论系统问题"
tags:
  - 调试
  - 评论系统
categories:
  - 测试
---

{{< callout type="warning" emoji="🐛" >}}
**调试页面**：这个页面用于调试评论系统的问题。
{{< /callout >}}

## 问题诊断

### 1. 检查 Netlify Functions 是否可用

<button onclick="testNetlifyFunctions()" class="test-btn">🔍 测试 Netlify Functions</button>
<div id="netlify-test-result" class="test-result"></div>

### 2. 检查评论 API

<button onclick="testCommentAPI()" class="test-btn">💬 测试评论 API</button>
<div id="comment-api-result" class="test-result"></div>

### 3. 手动测试评论提交

<form id="manual-test-form" class="test-form">
  <h4>手动测试评论提交</h4>
  <input type="text" name="author" placeholder="姓名" required>
  <input type="email" name="email" placeholder="邮箱" required>
  <textarea name="content" placeholder="评论内容" required></textarea>
  <button type="submit">提交测试评论</button>
</form>
<div id="manual-test-result" class="test-result"></div>

## 调试信息

<div id="debug-info" class="debug-info">
  <h4>页面信息</h4>
  <p>页面路径: <span id="page-path"></span></p>
  <p>页面标题: <span id="page-title"></span></p>
  <p>用户代理: <span id="user-agent"></span></p>
</div>

<style>
.test-btn {
  background: #007cba;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin: 1rem 0;
}

.test-result {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 6px;
  font-family: monospace;
  font-size: 12px;
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
}

.test-form {
  margin: 2rem 0;
  padding: 1rem;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  background: #f8f9fa;
}

.test-form h4 {
  margin: 0 0 1rem 0;
}

.test-form input,
.test-form textarea {
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.test-form button {
  background: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.debug-info {
  margin: 2rem 0;
  padding: 1rem;
  background: #e3f2fd;
  border-radius: 6px;
  font-size: 14px;
}

.debug-info h4 {
  margin: 0 0 1rem 0;
}
</style>

<script>
// 显示页面信息
document.getElementById('page-path').textContent = window.location.pathname;
document.getElementById('page-title').textContent = document.title;
document.getElementById('user-agent').textContent = navigator.userAgent;

// 测试 Netlify Functions
async function testNetlifyFunctions() {
  const resultDiv = document.getElementById('netlify-test-result');
  resultDiv.textContent = '正在测试 Netlify Functions...';
  
  try {
    const response = await fetch('/.netlify/functions/test-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'test' })
    });
    
    const result = await response.json();
    resultDiv.textContent = `Netlify Functions 测试结果:\n${JSON.stringify(result, null, 2)}`;
  } catch (error) {
    resultDiv.textContent = `Netlify Functions 测试失败:\n${error.message}`;
  }
}

// 测试评论 API
async function testCommentAPI() {
  const resultDiv = document.getElementById('comment-api-result');
  resultDiv.textContent = '正在测试评论 API...';
  
  try {
    const response = await fetch('/.netlify/functions/get-comments?postId=/debug-comments/');
    const result = await response.json();
    resultDiv.textContent = `评论 API 测试结果:\n${JSON.stringify(result, null, 2)}`;
  } catch (error) {
    resultDiv.textContent = `评论 API 测试失败:\n${error.message}`;
  }
}

// 手动测试评论提交
document.getElementById('manual-test-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const resultDiv = document.getElementById('manual-test-result');
  const formData = new FormData(e.target);
  
  const commentData = {
    post_id: '/debug-comments/',
    post_title: '评论系统调试页面',
    author: formData.get('author'),
    email: formData.get('email'),
    content: formData.get('content'),
    user_agent: navigator.userAgent,
    ip: 'unknown'
  };
  
  resultDiv.textContent = '正在提交评论...';
  
  try {
    const response = await fetch('/.netlify/functions/add-comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    });
    
    const result = await response.json();
    resultDiv.textContent = `评论提交结果:\n${JSON.stringify(result, null, 2)}`;
    
    if (result.success) {
      e.target.reset();
    }
  } catch (error) {
    resultDiv.textContent = `评论提交失败:\n${error.message}`;
  }
});

console.log('调试页面已加载');
</script>
