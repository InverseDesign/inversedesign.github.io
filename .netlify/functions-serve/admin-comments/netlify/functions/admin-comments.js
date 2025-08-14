// netlify/functions/admin-comments.js
var COMMENTS_DB = [
  {
    id: "comment-1",
    postId: "/blog/first-post/",
    postTitle: "\u6211\u7684\u7B2C\u4E00\u7BC7\u535A\u5BA2\u6587\u7AE0",
    author: "\u5F20\u4E09",
    email: "zhangsan@example.com",
    content: "\u8FD9\u662F\u4E00\u6761\u793A\u4F8B\u8BC4\u8BBA\uFF0C\u6587\u7AE0\u5199\u5F97\u5F88\u597D\uFF01",
    timestamp: new Date(Date.now() - 864e5).toISOString(),
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    ip: "192.168.1.1",
    likes: 3,
    status: "approved",
    createdAt: new Date(Date.now() - 864e5).toISOString()
  },
  {
    id: "comment-2",
    postId: "/blog/shortcodes-demo/",
    postTitle: "Hugo Shortcodes \u73A9\u6CD5\u6F14\u793A",
    author: "\u674E\u56DB",
    email: "lisi@example.com",
    content: "\u611F\u8C22\u5206\u4EAB\uFF0C\u5B66\u5230\u4E86\u5F88\u591A\u6709\u7528\u7684\u77E5\u8BC6\u3002",
    timestamp: new Date(Date.now() - 36e5).toISOString(),
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    ip: "192.168.1.2",
    likes: 1,
    status: "pending",
    createdAt: new Date(Date.now() - 36e5).toISOString()
  }
];
exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }
  try {
    const { action, data } = JSON.parse(event.body);
    switch (action) {
      case "getAllComments":
        return getAllComments();
      case "getCommentsByPost":
        return getCommentsByPost(data.postId);
      case "updateCommentStatus":
        return updateCommentStatus(data.commentId, data.status);
      case "deleteComment":
        return deleteComment(data.commentId);
      case "getStats":
        return getStats();
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            message: "\u672A\u77E5\u7684\u64CD\u4F5C\u7C7B\u578B"
          })
        };
    }
  } catch (error) {
    console.error("\u8BC4\u8BBA\u7BA1\u7406\u9519\u8BEF:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5"
      })
    };
  }
};
function getAllComments() {
  const comments = [...COMMENTS_DB].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    },
    body: JSON.stringify({
      success: true,
      comments,
      total: comments.length
    })
  };
}
function getCommentsByPost(postId) {
  const comments = COMMENTS_DB.filter(
    (comment) => comment.postId === postId
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    },
    body: JSON.stringify({
      success: true,
      comments,
      total: comments.length
    })
  };
}
function updateCommentStatus(commentId, status) {
  const comment = COMMENTS_DB.find((c) => c.id === commentId);
  if (!comment) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        success: false,
        message: "\u8BC4\u8BBA\u4E0D\u5B58\u5728"
      })
    };
  }
  comment.status = status;
  comment.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  console.log(`\u8BC4\u8BBA\u72B6\u6001\u66F4\u65B0: ${commentId} -> ${status}`);
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      message: "\u8BC4\u8BBA\u72B6\u6001\u66F4\u65B0\u6210\u529F",
      comment
    })
  };
}
function deleteComment(commentId) {
  const index = COMMENTS_DB.findIndex((c) => c.id === commentId);
  if (index === -1) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        success: false,
        message: "\u8BC4\u8BBA\u4E0D\u5B58\u5728"
      })
    };
  }
  const deletedComment = COMMENTS_DB.splice(index, 1)[0];
  console.log(`\u8BC4\u8BBA\u5DF2\u5220\u9664: ${commentId}`);
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      message: "\u8BC4\u8BBA\u5220\u9664\u6210\u529F",
      deletedComment
    })
  };
}
function getStats() {
  const totalComments = COMMENTS_DB.length;
  const approvedComments = COMMENTS_DB.filter((c) => c.status === "approved").length;
  const pendingComments = COMMENTS_DB.filter((c) => c.status === "pending").length;
  const spamComments = COMMENTS_DB.filter((c) => c.status === "spam").length;
  const postStats = {};
  COMMENTS_DB.forEach((comment) => {
    if (!postStats[comment.postId]) {
      postStats[comment.postId] = {
        postTitle: comment.postTitle,
        total: 0,
        approved: 0,
        pending: 0
      };
    }
    postStats[comment.postId].total++;
    if (comment.status === "approved") {
      postStats[comment.postId].approved++;
    } else if (comment.status === "pending") {
      postStats[comment.postId].pending++;
    }
  });
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    },
    body: JSON.stringify({
      success: true,
      stats: {
        total: totalComments,
        approved: approvedComments,
        pending: pendingComments,
        spam: spamComments,
        postStats
      }
    })
  };
}
//# sourceMappingURL=admin-comments.js.map
