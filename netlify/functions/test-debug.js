// 测试调试函数
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: '测试函数正常工作',
      timestamp: new Date().toISOString(),
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL ? '已配置' : '未配置',
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '已配置' : '未配置'
      }
    })
  };
};
