#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 环境变量配置助手');
console.log('==================');

// 检查 .env 文件是否存在
const envPath = path.join(process.cwd(), '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env 文件已存在');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // 检查是否已配置 Supabase
  if (envContent.includes('SUPABASE_URL') && envContent.includes('SUPABASE_ANON_KEY')) {
    console.log('✅ Supabase 配置已存在');
    console.log('\n📝 当前配置:');
    const lines = envContent.split('\n');
    lines.forEach(line => {
      if (line.includes('SUPABASE_')) {
        const [key, value] = line.split('=');
        console.log(`${key}=${value ? '***已配置***' : '未配置'}`);
      }
    });
  } else {
    console.log('⚠️ 缺少 Supabase 配置');
    updateEnvFile();
  }
} else {
  console.log('❌ .env 文件不存在，正在创建...');
  createEnvFile();
}

function createEnvFile() {
  const envContent = `# Supabase 配置
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key

# 其他配置
NODE_ENV=development
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env 文件已创建');
  console.log('\n📝 请编辑 .env 文件，填入您的 Supabase 配置信息：');
  console.log('1. 打开 .env 文件');
  console.log('2. 替换 SUPABASE_URL 为您的项目 URL');
  console.log('3. 替换 SUPABASE_ANON_KEY 为您的匿名密钥');
  console.log('4. 保存文件');
  console.log('\n💡 提示：您可以在 Supabase 控制台的 Settings > API 中找到这些信息');
}

function updateEnvFile() {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (!envContent.includes('SUPABASE_URL')) {
    const newContent = envContent + '\n# Supabase 配置\nSUPABASE_URL=https://your-project-id.supabase.co\nSUPABASE_ANON_KEY=your-anon-public-key\n';
    fs.writeFileSync(envPath, newContent);
    console.log('✅ 已添加 Supabase 配置到 .env 文件');
  }
  
  console.log('\n📝 请编辑 .env 文件，填入您的 Supabase 配置信息');
}

console.log('\n🔍 下一步：');
console.log('1. 编辑 .env 文件，填入您的 Supabase 配置');
console.log('2. 运行: pnpm install (安装 dotenv 依赖)');
console.log('3. 运行: pnpm run test (测试连接)');
