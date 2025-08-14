// 添加评论 - Netlify Function
const { createClient } = require('@supabase/supabase-js');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

    // 插入评论到 Supabase
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

    // 记录访问日志
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: '评论发表成功！',
        comment: data[0]
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
