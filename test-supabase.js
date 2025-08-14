#!/usr/bin/env node

// 加载环境变量
require('dotenv').config();

// 简单的 Supabase 连接测试脚本
const { createClient } = require('@supabase/supabase-js');

// 从环境变量或配置文件读取配置
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('🧪 Supabase 连接测试');
console.log('==================');

// 检查配置
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少 Supabase 配置信息');
  console.log('请确保设置了以下环境变量：');
  console.log('- SUPABASE_URL');
  console.log('- SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('✅ 配置信息检查通过');
console.log(`URL: ${supabaseUrl}`);
console.log(`Key: ${supabaseKey ? '已配置' : '未配置'}`);

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log('\n🔍 开始测试...\n');

  // 测试 1: 检查连接
  console.log('1. 测试 Supabase 连接...');
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ 连接失败:', error.message);
      return false;
    }
    console.log('✅ 连接成功');
  } catch (error) {
    console.error('❌ 连接异常:', error.message);
    return false;
  }

  // 测试 2: 检查表是否存在
  console.log('\n2. 检查数据库表...');
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ 表检查失败:', error.message);
      return false;
    }
    console.log('✅ comments 表存在');
  } catch (error) {
    console.error('❌ 表检查异常:', error.message);
    return false;
  }

  // 测试 3: 测试插入数据
  console.log('\n3. 测试数据插入...');
  try {
    const testComment = {
      post_id: '/test-script/',
      post_title: '脚本测试',
      author: '测试脚本',
      email: 'test@example.com',
      content: '这是一条测试评论，由测试脚本创建。',
      user_agent: 'Test Script',
      ip_address: '127.0.0.1',
      status: 'approved'
    };

    const { data, error } = await supabase
      .from('comments')
      .insert([testComment])
      .select();

    if (error) {
      console.error('❌ 数据插入失败:', error.message);
      return false;
    }
    console.log('✅ 数据插入成功');
  } catch (error) {
    console.error('❌ 数据插入异常:', error.message);
    return false;
  }

  // 测试 4: 测试查询数据
  console.log('\n4. 测试数据查询...');
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', '/test-script/')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('❌ 数据查询失败:', error.message);
      return false;
    }
    console.log(`✅ 数据查询成功，找到 ${data.length} 条记录`);
  } catch (error) {
    console.error('❌ 数据查询异常:', error.message);
    return false;
  }

  // 测试 5: 清理测试数据
  console.log('\n5. 清理测试数据...');
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('post_id', '/test-script/');

    if (error) {
      console.error('⚠️ 清理测试数据失败:', error.message);
      // 不返回 false，因为这不是关键测试
    } else {
      console.log('✅ 测试数据清理成功');
    }
  } catch (error) {
    console.error('⚠️ 清理测试数据异常:', error.message);
  }

  return true;
}

// 运行测试
runTests().then((success) => {
  console.log('\n==================');
  if (success) {
    console.log('🎉 所有测试通过！Supabase 配置正确。');
    console.log('\n📝 下一步：');
    console.log('1. 启动 Hugo 服务器: hugo server');
    console.log('2. 访问测试页面: http://localhost:1313/blog/test-supabase-connection/');
    console.log('3. 测试评论功能');
  } else {
    console.log('❌ 测试失败，请检查配置。');
    console.log('\n🔧 故障排除：');
    console.log('1. 检查 SUPABASE_URL 和 SUPABASE_ANON_KEY 环境变量');
    console.log('2. 确认 Supabase 项目已创建');
    console.log('3. 确认数据库表已初始化');
    console.log('4. 检查网络连接');
    process.exit(1);
  }
}).catch((error) => {
  console.error('\n❌ 测试过程中发生错误:', error.message);
  process.exit(1);
});
