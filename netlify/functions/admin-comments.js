// 评论管理后台 API
// 提供评论的增删改查功能

// 模拟数据库存储
let COMMENTS_DB = [
  {
    id: 'comment-1',
    postId: '/blog/first-post/',
    postTitle: '我的第一篇博客文章',
    author: '张三',
    email: 'zhangsan@example.com',
    content: '这是一条示例评论，文章写得很好！',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    ip: '192.168.1.1',
    likes: 3,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'comment-2',
    postId: '/blog/shortcodes-demo/',
    postTitle: 'Hugo Shortcodes 玩法演示',
    author: '李四',
    email: 'lisi@example.com',
    content: '感谢分享，学到了很多有用的知识。',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    ip: '192.168.1.2',
    likes: 1,
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

exports.handler = async (event, context) => {
  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { action, data } = JSON.parse(event.body);
    
    switch (action) {
      case 'getAllComments':
        return getAllComments();
      case 'getCommentsByPost':
        return getCommentsByPost(data.postId);
      case 'updateCommentStatus':
        return updateCommentStatus(data.commentId, data.status);
      case 'deleteComment':
        return deleteComment(data.commentId);
      case 'getStats':
        return getStats();
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ 
            success: false, 
            message: '未知的操作类型' 
          })
        };
    }

  } catch (error) {
    console.error('评论管理错误:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        message: '服务器内部错误，请稍后重试' 
      })
    };
  }
};

// 获取所有评论
function getAllComments() {
  const comments = [...COMMENTS_DB].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    },
    body: JSON.stringify({
      success: true,
      comments: comments,
      total: comments.length
    })
  };
}

// 获取指定文章的评论
function getCommentsByPost(postId) {
  const comments = COMMENTS_DB.filter(comment => 
    comment.postId === postId
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    },
    body: JSON.stringify({
      success: true,
      comments: comments,
      total: comments.length
    })
  };
}

// 更新评论状态
function updateCommentStatus(commentId, status) {
  const comment = COMMENTS_DB.find(c => c.id === commentId);
  
  if (!comment) {
    return {
      statusCode: 404,
      body: JSON.stringify({ 
        success: false, 
        message: '评论不存在' 
      })
    };
  }

  comment.status = status;
  comment.updatedAt = new Date().toISOString();

  console.log(`评论状态更新: ${commentId} -> ${status}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      message: '评论状态更新成功',
      comment: comment
    })
  };
}

// 删除评论
function deleteComment(commentId) {
  const index = COMMENTS_DB.findIndex(c => c.id === commentId);
  
  if (index === -1) {
    return {
      statusCode: 404,
      body: JSON.stringify({ 
        success: false, 
        message: '评论不存在' 
      })
    };
  }

  const deletedComment = COMMENTS_DB.splice(index, 1)[0];
  
  console.log(`评论已删除: ${commentId}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      message: '评论删除成功',
      deletedComment: deletedComment
    })
  };
}

// 获取统计信息
function getStats() {
  const totalComments = COMMENTS_DB.length;
  const approvedComments = COMMENTS_DB.filter(c => c.status === 'approved').length;
  const pendingComments = COMMENTS_DB.filter(c => c.status === 'pending').length;
  const spamComments = COMMENTS_DB.filter(c => c.status === 'spam').length;

  // 按文章分组统计
  const postStats = {};
  COMMENTS_DB.forEach(comment => {
    if (!postStats[comment.postId]) {
      postStats[comment.postId] = {
        postTitle: comment.postTitle,
        total: 0,
        approved: 0,
        pending: 0
      };
    }
    postStats[comment.postId].total++;
    if (comment.status === 'approved') {
      postStats[comment.postId].approved++;
    } else if (comment.status === 'pending') {
      postStats[comment.postId].pending++;
    }
  });

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    },
    body: JSON.stringify({
      success: true,
      stats: {
        total: totalComments,
        approved: approvedComments,
        pending: pendingComments,
        spam: spamComments,
        postStats: postStats
      }
    })
  };
}
