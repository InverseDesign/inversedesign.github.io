// 添加评论 - Netlify Function
const { createClient } = require('@supabase/supabase-js');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// 检查环境变量
if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase 环境变量未配置，使用模拟数据');
}

// 创建 Supabase 客户端（如果配置了环境变量）
let supabase = null;
// 暂时禁用 Supabase 以使用模拟数据进行测试
if (false && supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('❌ Supabase 客户端创建失败:', error.message);
  }
}

// 模拟评论存储（用于本地开发）- 使用全局变量以便在函数间共享
global.mockComments = global.mockComments || [
  {
    id: '1',
    post_id: '/blog/first-post/',
    post_title: '我的第一篇博客文章',
    author: '张三',
    email: 'zhangsan@example.com',
    content: '这是一篇很棒的文章！',
    created_at: '2023-06-23T10:00:00Z',
    status: 'approved'
  },
  {
    id: '2',
    post_id: '/blog/comments-demo/',
    post_title: '评论系统演示',
    author: '李四',
    email: 'lisi@example.com',
    content: '评论系统工作得很好！',
    created_at: '2023-06-23T11:00:00Z',
    status: 'approved'
  }
];

// 生成唯一ID
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

exports.handler = async (event, context) => {
  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // 处理 CORS 预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const commentData = JSON.parse(event.body);
    
    // 验证必填字段
    const { post_id, post_title, author, email, content } = commentData;
    
    if (!post_id || !post_title || !author || !email || !content) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: false, 
          message: '缺少必填字段' 
        })
      };
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: false, 
          message: '邮箱格式不正确' 
        })
      };
    }

    // 验证内容长度
    if (content.length < 5) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: false, 
          message: '评论内容至少需要5个字符' 
        })
      };
    }

    if (content.length > 1000) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: false, 
          message: '评论内容不能超过1000个字符' 
        })
      };
    }

    // 获取客户端IP
    const clientIP = event.headers['client-ip'] || 
                    event.headers['x-forwarded-for'] || 
                    event.headers['x-real-ip'] || 
                    'unknown';

    // 准备插入数据
    const insertData = {
      post_id: post_id,
      post_title: post_title,
      author: author.trim(),
      email: email.trim().toLowerCase(),
      content: content.trim(),
      user_agent: commentData.user_agent || 'unknown',
      ip_address: clientIP,
      status: 'approved', // 默认状态为已批准
      created_at: new Date().toISOString()
    };

    let savedComment;

    // 如果 Supabase 可用，保存到数据库
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('comments')
          .insert([insertData])
          .select();

        if (error) {
          console.error('Supabase 插入错误:', error);
          return {
            statusCode: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
              success: false, 
              message: '评论保存失败，请稍后重试' 
            })
          };
        }
        savedComment = data[0];
      } catch (error) {
        console.error('Supabase 插入异常:', error);
        return {
          statusCode: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ 
            success: false, 
            message: '评论保存失败，请稍后重试' 
          })
        };
      }
    } else {
      // 使用模拟数据
      const newComment = {
        id: generateId(),
        ...insertData
      };
      global.mockComments.push(newComment);
      savedComment = newComment;
      console.log('模拟数据 - 新评论已添加:', newComment);
    }

    // 记录访问日志（如果 Supabase 可用）
    if (supabase) {
      try {
        await supabase
          .from('access_logs')
          .insert([{
            action: 'add_comment',
            post_id: post_id,
            ip_address: clientIP,
            user_agent: commentData.user_agent || 'unknown',
            created_at: new Date().toISOString()
          }]);
      } catch (logError) {
        console.error('记录访问日志失败:', logError);
        // 不影响主流程，只记录错误
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: '评论发表成功！',
        comment: savedComment
      })
    };

  } catch (error) {
    console.error('处理评论请求错误:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: false, 
        message: '服务器错误，请稍后重试' 
      })
    };
  }
};
