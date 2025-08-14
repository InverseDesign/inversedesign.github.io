// 获取评论 - Netlify Function
const { createClient } = require('@supabase/supabase-js');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  // 只允许 GET 请求
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
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
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { postId } = event.queryStringParameters || {};
    
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

    // 从 Supabase 获取评论
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('status', 'approved') // 只获取已批准的评论
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase 查询错误:', error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: false, 
          message: '获取评论失败' 
        })
      };
    }

    // 记录访问日志
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
