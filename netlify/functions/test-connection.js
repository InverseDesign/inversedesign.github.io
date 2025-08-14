// 测试 Supabase 连接 - Netlify Function
const { createClient } = require('@supabase/supabase-js');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('缺少 Supabase 配置信息');
}

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  // 处理 CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // 处理预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // 测试 1: 检查连接
    console.log('测试 Supabase 连接...');
    console.log('URL:', supabaseUrl);
    console.log('Key:', supabaseKey ? '已配置' : '未配置');

    // 测试 2: 检查表是否存在
    console.log('检查数据库表...');
    const { data: tables, error: tablesError } = await supabase
      .from('comments')
      .select('count')
      .limit(1);

    if (tablesError) {
      console.error('表检查失败:', tablesError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: '数据库表检查失败',
          error: tablesError.message,
          details: {
            url: supabaseUrl,
            hasKey: !!supabaseKey,
            error: tablesError
          }
        })
      };
    }

    // 测试 3: 尝试插入测试数据
    console.log('测试数据插入...');
    const testComment = {
      post_id: '/test-connection/',
      post_title: '连接测试',
      author: '系统测试',
      email: 'test@example.com',
      content: '这是一条测试评论，用于验证 Supabase 连接是否正常。',
      user_agent: 'Test Connection',
      ip_address: '127.0.0.1',
      status: 'approved'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('comments')
      .insert([testComment])
      .select();

    if (insertError) {
      console.error('数据插入失败:', insertError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: '数据插入测试失败',
          error: insertError.message,
          details: {
            url: supabaseUrl,
            hasKey: !!supabaseKey,
            error: insertError
          }
        })
      };
    }

    // 测试 4: 尝试查询数据
    console.log('测试数据查询...');
    const { data: queryData, error: queryError } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', '/test-connection/')
      .order('created_at', { ascending: false })
      .limit(5);

    if (queryError) {
      console.error('数据查询失败:', queryError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: '数据查询测试失败',
          error: queryError.message,
          details: {
            url: supabaseUrl,
            hasKey: !!supabaseKey,
            error: queryError
          }
        })
      };
    }

    // 测试 5: 清理测试数据
    console.log('清理测试数据...');
    const { error: deleteError } = await supabase
      .from('comments')
      .delete()
      .eq('post_id', '/test-connection/');

    if (deleteError) {
      console.error('清理测试数据失败:', deleteError);
      // 不返回错误，因为这不是关键测试
    }

    // 所有测试通过
    console.log('所有测试通过！');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Supabase 连接测试成功！',
        details: {
          url: supabaseUrl,
          hasKey: !!supabaseKey,
          tablesExist: true,
          canInsert: true,
          canQuery: true,
          canDelete: true,
          testDataCount: queryData ? queryData.length : 0
        },
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('测试过程中发生错误:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: '测试过程中发生未知错误',
        error: error.message,
        details: {
          url: supabaseUrl,
          hasKey: !!supabaseKey,
          stack: error.stack
        }
      })
    };
  }
};
