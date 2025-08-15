// 获取评论 - Netlify Function
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

// 模拟评论数据（用于本地开发）- 使用全局变量以便在函数间共享
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

exports.handler = async (event, context) => {
  // 允许 GET 和 POST 请求
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
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
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    let postId;
    
    // 根据请求方法获取参数
    if (event.httpMethod === 'GET') {
      postId = event.queryStringParameters?.postId;
    } else if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      postId = body.postId;
    }
    
    if (!postId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: false, 
          message: '缺少文章ID参数' 
        })
      };
    }

    let comments = [];
    
    // 如果 Supabase 可用，从数据库获取评论
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', postId)
          .eq('status', 'approved') // 只获取已批准的评论
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase 查询错误:', error);
          // 如果数据库查询失败，使用模拟数据
          comments = global.mockComments.filter(comment => 
            comment.post_id === postId && comment.status === 'approved'
          );
        } else {
          comments = data || [];
        }
      } catch (error) {
        console.error('Supabase 查询异常:', error);
        // 如果数据库查询异常，使用模拟数据
        comments = global.mockComments.filter(comment => 
          comment.post_id === postId && comment.status === 'approved'
        );
      }
    } else {
      // 如果 Supabase 不可用，使用模拟数据
      comments = global.mockComments.filter(comment => 
        comment.post_id === postId && comment.status === 'approved'
      );
    }

    // 记录访问日志（如果 Supabase 可用）
    if (supabase) {
      try {
        const clientIP = event.headers['client-ip'] || 
                        event.headers['x-forwarded-for'] || 
                        event.headers['x-real-ip'] || 
                        'unknown';

        await supabase
          .from('access_logs')
          .insert([{
            action: 'get_comments',
            post_id: postId,
            ip_address: clientIP,
            user_agent: event.headers['user-agent'] || 'unknown',
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
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300' // 缓存5分钟
      },
      body: JSON.stringify({
        success: true,
        comments: comments || [],
        count: comments ? comments.length : 0
      })
    };

  } catch (error) {
    console.error('获取评论错误:', error);
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
