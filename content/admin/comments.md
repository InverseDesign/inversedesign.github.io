---
title: "评论管理后台"
date: 2023-06-23
description: "评论系统管理后台"
layout: admin
---

# 评论管理后台

这是一个评论系统的管理后台，用于查看和管理所有评论。

## 统计信息

<div class="stats-container">
  <div class="stat-card">
    <div class="stat-number" id="total-comments">-</div>
    <div class="stat-label">总评论数</div>
  </div>
  <div class="stat-card">
    <div class="stat-number" id="approved-comments">-</div>
    <div class="stat-label">已批准</div>
  </div>
  <div class="stat-card">
    <div class="stat-number" id="pending-comments">-</div>
    <div class="stat-label">待审核</div>
  </div>
  <div class="stat-card">
    <div class="stat-number" id="spam-comments">-</div>
    <div class="stat-label">垃圾评论</div>
  </div>
</div>

## 评论列表

<div class="comments-management">
  <div class="filters">
    <select id="status-filter" class="filter-select">
      <option value="all">所有状态</option>
      <option value="approved">已批准</option>
      <option value="pending">待审核</option>
      <option value="spam">垃圾评论</option>
    </select>
    
    <select id="post-filter" class="filter-select">
      <option value="all">所有文章</option>
    </select>
    
    <button onclick="refreshComments()" class="refresh-btn">🔄 刷新</button>
  </div>

  <div class="comments-table-container">
    <table class="comments-table">
      <thead>
        <tr>
          <th>作者</th>
          <th>内容</th>
          <th>文章</th>
          <th>时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody id="comments-table-body">
        <tr>
          <td colspan="6" class="loading">正在加载评论...</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<style>
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #6b7280;
  font-size: 0.9rem;
}

.comments-management {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.filters {
  padding: 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.9rem;
}

.refresh-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.refresh-btn:hover {
  background: #2563eb;
}

.comments-table-container {
  overflow-x: auto;
}

.comments-table {
  width: 100%;
  border-collapse: collapse;
}

.comments-table th,
.comments-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.comments-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.comments-table tr:hover {
  background: #f9fafb;
}

.comment-author {
  font-weight: 600;
  color: #1f2937;
}

.comment-content {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.comment-post {
  color: #3b82f6;
  text-decoration: none;
}

.comment-post:hover {
  text-decoration: underline;
}

.comment-date {
  color: #6b7280;
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-approved {
  background: #d1fae5;
  color: #065f46;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-spam {
  background: #fee2e2;
  color: #991b1b;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.approve-btn {
  background: #10b981;
  color: white;
}

.approve-btn:hover {
  background: #059669;
}

.reject-btn {
  background: #ef4444;
  color: white;
}

.reject-btn:hover {
  background: #dc2626;
}

.delete-btn {
  background: #6b7280;
  color: white;
}

.delete-btn:hover {
  background: #4b5563;
}

.loading {
  text-align: center;
  color: #6b7280;
  padding: 2rem;
}

.no-comments {
  text-align: center;
  color: #6b7280;
  padding: 2rem;
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .comments-table th,
  .comments-table td {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
  
  .comment-content {
    max-width: 150px;
  }
}
</style>

<script>
class CommentsAdmin {
  constructor() {
    this.comments = [];
    this.stats = {};
    this.init();
  }

  async init() {
    await this.loadStats();
    await this.loadComments();
    this.setupEventListeners();
  }

  async loadStats() {
    try {
      const response = await fetch('/.netlify/functions/admin-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getStats'
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.stats = data.stats;
        this.updateStatsDisplay();
        this.updatePostFilter();
      }
    } catch (error) {
      console.error('加载统计信息失败:', error);
    }
  }

  async loadComments() {
    try {
      const response = await fetch('/.netlify/functions/admin-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getAllComments'
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.comments = data.comments || [];
        this.renderComments();
      }
    } catch (error) {
      console.error('加载评论失败:', error);
    }
  }

  updateStatsDisplay() {
    document.getElementById('total-comments').textContent = this.stats.total || 0;
    document.getElementById('approved-comments').textContent = this.stats.approved || 0;
    document.getElementById('pending-comments').textContent = this.stats.pending || 0;
    document.getElementById('spam-comments').textContent = this.stats.spam || 0;
  }

  updatePostFilter() {
    const postFilter = document.getElementById('post-filter');
    const postStats = this.stats.postStats || {};
    
    // 清空现有选项（保留"所有文章"）
    postFilter.innerHTML = '<option value="all">所有文章</option>';
    
    // 添加文章选项
    Object.keys(postStats).forEach(postId => {
      const post = postStats[postId];
      const option = document.createElement('option');
      option.value = postId;
      option.textContent = `${post.postTitle} (${post.total})`;
      postFilter.appendChild(option);
    });
  }

  renderComments() {
    const tbody = document.getElementById('comments-table-body');
    const statusFilter = document.getElementById('status-filter').value;
    const postFilter = document.getElementById('post-filter').value;

    // 过滤评论
    let filteredComments = this.comments;
    
    if (statusFilter !== 'all') {
      filteredComments = filteredComments.filter(c => c.status === statusFilter);
    }
    
    if (postFilter !== 'all') {
      filteredComments = filteredComments.filter(c => c.postId === postFilter);
    }

    if (filteredComments.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="no-comments">暂无评论</td></tr>';
      return;
    }

    const commentsHtml = filteredComments.map(comment => this.renderCommentRow(comment)).join('');
    tbody.innerHTML = commentsHtml;
  }

  renderCommentRow(comment) {
    const date = new Date(comment.timestamp).toLocaleString('zh-CN');
    const statusClass = `status-${comment.status}`;
    const statusText = {
      'approved': '已批准',
      'pending': '待审核',
      'spam': '垃圾评论'
    }[comment.status] || comment.status;

    return `
      <tr data-comment-id="${comment.id}">
        <td>
          <div class="comment-author">${this.escapeHtml(comment.author)}</div>
          <div style="font-size: 0.8rem; color: #6b7280;">${this.escapeHtml(comment.email)}</div>
        </td>
        <td>
          <div class="comment-content" title="${this.escapeHtml(comment.content)}">
            ${this.escapeHtml(comment.content)}
          </div>
        </td>
        <td>
          <a href="${comment.postId}" class="comment-post" target="_blank">
            ${this.escapeHtml(comment.postTitle)}
          </a>
        </td>
        <td>
          <div class="comment-date">${date}</div>
        </td>
        <td>
          <span class="status-badge ${statusClass}">${statusText}</span>
        </td>
        <td>
          <div class="action-buttons">
            ${comment.status === 'pending' ? 
              `<button class="action-btn approve-btn" onclick="commentsAdmin.updateStatus('${comment.id}', 'approved')">批准</button>` : ''
            }
            ${comment.status === 'approved' ? 
              `<button class="action-btn reject-btn" onclick="commentsAdmin.updateStatus('${comment.id}', 'pending')">撤回</button>` : ''
            }
            <button class="action-btn delete-btn" onclick="commentsAdmin.deleteComment('${comment.id}')">删除</button>
          </div>
        </td>
      </tr>
    `;
  }

  async updateStatus(commentId, status) {
    try {
      const response = await fetch('/.netlify/functions/admin-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateCommentStatus',
          data: {
            commentId: commentId,
            status: status
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // 更新本地数据
          const comment = this.comments.find(c => c.id === commentId);
          if (comment) {
            comment.status = status;
          }
          
          // 重新加载统计和评论
          await this.loadStats();
          this.renderComments();
          
          alert('评论状态更新成功！');
        } else {
          alert('更新失败：' + data.message);
        }
      }
    } catch (error) {
      console.error('更新评论状态失败:', error);
      alert('更新失败，请稍后重试');
    }
  }

  async deleteComment(commentId) {
    if (!confirm('确定要删除这条评论吗？此操作不可撤销。')) {
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/admin-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteComment',
          data: {
            commentId: commentId
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // 从本地数据中移除
          this.comments = this.comments.filter(c => c.id !== commentId);
          
          // 重新加载统计和评论
          await this.loadStats();
          this.renderComments();
          
          alert('评论删除成功！');
        } else {
          alert('删除失败：' + data.message);
        }
      }
    } catch (error) {
      console.error('删除评论失败:', error);
      alert('删除失败，请稍后重试');
    }
  }

  setupEventListeners() {
    document.getElementById('status-filter').addEventListener('change', () => {
      this.renderComments();
    });

    document.getElementById('post-filter').addEventListener('change', () => {
      this.renderComments();
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// 全局函数
function refreshComments() {
  if (window.commentsAdmin) {
    window.commentsAdmin.loadStats().then(() => {
      window.commentsAdmin.loadComments();
    });
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  window.commentsAdmin = new CommentsAdmin();
});
</script>
