#!/usr/bin/env node

/**
 * Giscus 配置获取脚本
 * 用于获取 GitHub 仓库 ID 和 Discussions 分类 ID
 * 
 * 使用方法：
 * 1. 设置 GitHub Token: export GITHUB_TOKEN=your_token
 * 2. 运行脚本: node scripts/get-giscus-config.js
 */

const https = require('https');

// 配置
const REPO_OWNER = 'inversedesign';
const REPO_NAME = 'inversedesign.github.io';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('❌ 错误: 请设置 GITHUB_TOKEN 环境变量');
  console.log('💡 提示: export GITHUB_TOKEN=your_github_token');
  process.exit(1);
}

// 发送 HTTP 请求的通用函数
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve(result);
        } catch (error) {
          reject(new Error(`解析响应失败: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// 获取仓库信息
async function getRepositoryInfo() {
  console.log('🔍 正在获取仓库信息...');
  
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${REPO_OWNER}/${REPO_NAME}`,
    method: 'GET',
    headers: {
      'User-Agent': 'Giscus-Config-Script',
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  };

  try {
    const result = await makeRequest(options);
    
    if (result.id) {
      console.log(`✅ 仓库 ID: ${result.id}`);
      console.log(`📁 仓库名称: ${result.full_name}`);
      console.log(`🔗 仓库 URL: ${result.html_url}`);
      console.log(`🌐 是否公开: ${result.private ? '否' : '是'}`);
      
      if (result.private) {
        console.warn('⚠️  警告: 仓库是私有的，Giscus 需要公开仓库才能工作');
      }
      
      return result.id;
    } else {
      throw new Error('无法获取仓库 ID');
    }
  } catch (error) {
    console.error('❌ 获取仓库信息失败:', error.message);
    throw error;
  }
}

// 获取 Discussions 分类信息
async function getDiscussionCategories() {
  console.log('\n🔍 正在获取 Discussions 分类信息...');
  
  const query = `
    query {
      repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
        discussionCategories(first: 10) {
          nodes {
            id
            name
            description
          }
        }
      }
    }
  `;

  const options = {
    hostname: 'api.github.com',
    path: '/graphql',
    method: 'POST',
    headers: {
      'User-Agent': 'Giscus-Config-Script',
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    const result = await makeRequest(options, { query });
    
    if (result.data && result.data.repository) {
      const categories = result.data.repository.discussionCategories.nodes;
      
      if (categories.length === 0) {
        console.warn('⚠️  警告: 没有找到 Discussions 分类');
        console.log('💡 提示: 请先在 GitHub 仓库中启用 Discussions 功能');
        return null;
      }
      
      console.log('📂 找到以下 Discussions 分类:');
      categories.forEach((category, index) => {
        console.log(`  ${index + 1}. ${category.name} (ID: ${category.id})`);
        if (category.description) {
          console.log(`     描述: ${category.description}`);
        }
      });
      
      return categories;
    } else {
      throw new Error('无法获取 Discussions 分类');
    }
  } catch (error) {
    console.error('❌ 获取 Discussions 分类失败:', error.message);
    throw error;
  }
}

// 检查 Discussions 功能是否启用
async function checkDiscussionsEnabled() {
  console.log('\n🔍 检查 Discussions 功能状态...');
  
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${REPO_OWNER}/${REPO_NAME}`,
    method: 'GET',
    headers: {
      'User-Agent': 'Giscus-Config-Script',
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  };

  try {
    const result = await makeRequest(options);
    
    if (result.has_discussions) {
      console.log('✅ Discussions 功能已启用');
      return true;
    } else {
      console.warn('⚠️  Discussions 功能未启用');
      console.log('💡 提示: 请在 GitHub 仓库设置中启用 Discussions 功能');
      return false;
    }
  } catch (error) {
    console.error('❌ 检查 Discussions 状态失败:', error.message);
    return false;
  }
}

// 生成配置建议
function generateConfig(repoId, categories) {
  console.log('\n📋 Giscus 配置建议:');
  console.log('='.repeat(50));
  
  console.log('\n1. 在 hugo.yaml 中添加以下配置:');
  console.log(`
params:
  comments:
    enable: true
    type: giscus
  
  giscus:
    repo: "${REPO_OWNER}/${REPO_NAME}"
    repoId: "${repoId}"
    category: "${categories[0]?.name || 'Announcements'}"
    categoryId: "${categories[0]?.id || 'DIC_kwDOPjsjDM4Cuj3Q'}"
    mapping: "pathname"
    strict: "0"
    reactionsEnabled: "1"
    emitMetadata: "0"
    inputPosition: "top"
    theme: "preferred_color_scheme"
    lang: "zh-CN"
    loading: "lazy"
`);

  console.log('\n2. 在文章中使用评论:');
  console.log(`
{{< giscus >}}
`);

  console.log('\n3. 安装 Giscus 应用:');
  console.log('   访问: https://github.com/apps/giscus');
  console.log('   选择仓库: ' + REPO_OWNER + '/' + REPO_NAME);
  
  console.log('\n4. 测试配置:');
  console.log('   访问: https://giscus.app/');
  console.log('   输入上述配置参数进行测试');
}

// 主函数
async function main() {
  try {
    console.log('🚀 Giscus 配置获取脚本');
    console.log('='.repeat(50));
    
    // 检查 Discussions 功能
    const discussionsEnabled = await checkDiscussionsEnabled();
    
    // 获取仓库信息
    const repoId = await getRepositoryInfo();
    
    // 获取 Discussions 分类
    const categories = await getDiscussionCategories();
    
    // 生成配置建议
    if (discussionsEnabled && categories) {
      generateConfig(repoId, categories);
    } else {
      console.log('\n❌ 无法生成完整配置，请先解决上述问题');
    }
    
    console.log('\n✅ 脚本执行完成！');
    
  } catch (error) {
    console.error('\n❌ 脚本执行失败:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = {
  getRepositoryInfo,
  getDiscussionCategories,
  checkDiscussionsEnabled
};
