---
title: "服务器端安全验证演示"
date: 2023-06-23
description: "展示真正的服务器端密码验证系统"
tags:
  - 密码保护
  - 服务器端
  - 安全
categories:
  - 技术演示
---

{{< callout type="info" emoji="🔐" >}}
**服务器端安全演示**: 这篇文章展示了真正的服务器端密码验证系统，完全不在客户端存储密码。
{{< /callout >}}

## 服务器端验证的优势

### 为什么选择服务器端验证？

1. **密码不暴露**：密码完全不在客户端存储或传输
2. **防破解**：无法通过查看源码获取密码
3. **访问控制**：可以实现复杂的权限管理
4. **审计日志**：记录所有访问尝试和结果
5. **安全策略**：可以实现锁定、限流等安全策略

### 与客户端验证的对比

| 特性 | 客户端验证 | 服务器端验证 |
|------|------------|--------------|
| 密码存储 | ❌ 在 HTML 中暴露 | ✅ 只在服务器存储 |
| 防破解 | ❌ 容易被破解 | ✅ 无法破解 |
| 访问日志 | ❌ 无法记录 | ✅ 完整记录 |
| 安全策略 | ❌ 无法实现 | ✅ 灵活配置 |
| 实现复杂度 | ⭐ 简单 | ⭐⭐⭐ 复杂 |

## 方案一：基础服务器端验证

### 特点

- **API 验证**：通过 API 发送密码到服务器验证
- **访问日志**：记录所有访问尝试
- **防暴力破解**：失败次数限制和锁定机制

{{< server-password id="server-demo-1" >}}
## 基础服务器端验证内容

这是使用基础服务器端验证保护的敏感内容。

### 技术实现

```javascript
// 客户端代码
async function verifyWithServer(password) {
  const response = await fetch('/.netlify/functions/verify-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contentId: 'server-demo-1',
      password: password
    })
  });
  
  return response.json();
}
```

```javascript
// 服务器端代码 (Netlify Functions)
exports.handler = async (event, context) => {
  const { contentId, password } = JSON.parse(event.body);
  
  // 验证密码
  const isValid = await verifyPasswordInDatabase(contentId, password);
  
  // 记录访问日志
  await logAccessAttempt(contentId, isValid, event.headers);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ valid: isValid })
  };
};
```

### 安全特性

1. **密码加密存储**：使用加盐哈希存储密码
2. **访问限制**：失败5次后锁定15分钟
3. **IP 记录**：记录访问者的 IP 地址
4. **用户代理记录**：记录浏览器信息
5. **时间戳记录**：记录访问时间

### 使用场景

- 企业文档保护
- 内部知识库
- 敏感技术文档
{{< /server-password >}}

## 方案二：JWT 令牌认证

### 特点

- **令牌机制**：使用 JWT 令牌进行认证
- **自动过期**：令牌有有效期，自动过期
- **刷新机制**：支持令牌刷新
- **无状态**：服务器无需存储会话

{{< jwt-password id="jwt-demo-1" >}}
## JWT 令牌认证内容

这是使用 JWT 令牌认证保护的敏感内容。

### 技术实现

```javascript
// 客户端认证
async function authenticateWithJWT(password) {
  const response = await fetch('/.netlify/functions/jwt-auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contentId: 'jwt-demo-1',
      password: password
    })
  });
  
  const result = await response.json();
  if (result.success) {
    // 存储令牌
    localStorage.setItem('jwt_access_token', result.accessToken);
    localStorage.setItem('jwt_refresh_token', result.refreshToken);
  }
}
```

```javascript
// 服务器端 JWT 生成
function generateJWT(payload, secret, expiresIn = '1h') {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 3600; // 1小时过期
  
  const jwtPayload = { ...payload, iat: now, exp: exp };
  
  // 生成签名
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');
    
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}
```

### 安全特性

1. **访问令牌**：1小时有效期的访问令牌
2. **刷新令牌**：7天有效期的刷新令牌
3. **自动过期**：令牌过期后自动登出
4. **签名验证**：使用 HMAC-SHA256 签名
5. **载荷验证**：验证令牌载荷的完整性

### 使用场景

- 高安全要求的内容
- 需要长期访问的内容
- 多用户系统
{{< /jwt-password >}}

## 部署方案

### 1. Netlify Functions (推荐)

```yaml
# netlify.toml
[build]
  functions = "netlify/functions"
  publish = "public"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### 2. Vercel Functions

```javascript
// api/verify-password.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // 验证逻辑
  const { contentId, password } = req.body;
  // ... 验证代码
}
```

### 3. AWS Lambda

```javascript
// lambda/verify-password.js
exports.handler = async (event) => {
  const { contentId, password } = JSON.parse(event.body);
  
  // 验证逻辑
  // ... 验证代码
  
  return {
    statusCode: 200,
    body: JSON.stringify({ valid: true })
  };
};
```

## 安全最佳实践

### 1. 环境变量配置

```bash
# .env
JWT_SECRET=your-super-secret-jwt-key-2024
REFRESH_SECRET=your-super-secret-refresh-key-2024
DATABASE_URL=your-database-connection-string
```

### 2. 数据库存储

```sql
-- 密码表
CREATE TABLE passwords (
  id SERIAL PRIMARY KEY,
  content_id VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 访问日志表
CREATE TABLE access_logs (
  id SERIAL PRIMARY KEY,
  content_id VARCHAR(255) NOT NULL,
  success BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. 安全策略

```javascript
// 安全策略配置
const SECURITY_CONFIG = {
  maxAttempts: 5,           // 最大尝试次数
  lockoutDuration: 900000,  // 锁定时间 (15分钟)
  passwordMinLength: 8,     // 最小密码长度
  requireSpecialChars: true, // 要求特殊字符
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15分钟窗口
    max: 100 // 限制100次请求
  }
};
```

## 监控和审计

### 1. 访问日志

```javascript
// 日志记录
function logAccess(contentId, success, request) {
  const logEntry = {
    contentId,
    success,
    timestamp: new Date().toISOString(),
    ip: request.headers['x-forwarded-for'],
    userAgent: request.headers['user-agent'],
    method: request.method,
    path: request.path
  };
  
  // 发送到日志服务
  sendToLogService(logEntry);
}
```

### 2. 异常检测

```javascript
// 异常检测
function detectAnomalies(accessLogs) {
  const recentLogs = accessLogs.filter(log => 
    Date.now() - new Date(log.timestamp).getTime() < 3600000 // 1小时内
  );
  
  // 检测异常模式
  const failedAttempts = recentLogs.filter(log => !log.success);
  const uniqueIPs = new Set(recentLogs.map(log => log.ip));
  
  if (failedAttempts.length > 10 || uniqueIPs.size > 5) {
    // 触发安全警报
    triggerSecurityAlert();
  }
}
```

## 总结

{{< callout type="success" emoji="✅" >}}
**结论**: 服务器端验证提供了真正的安全性，完全解决了客户端密码暴露的问题。
{{< /callout >}}

### 关键优势

1. **真正的安全性**：密码完全不在客户端存储
2. **完整的审计**：记录所有访问尝试和结果
3. **灵活的策略**：可以实现复杂的访问控制策略
4. **可扩展性**：支持多用户和复杂的权限管理
5. **生产就绪**：适合企业级应用部署

### 部署建议

1. **选择平台**：推荐使用 Netlify Functions 或 Vercel Functions
2. **数据库**：使用 PostgreSQL 或 MongoDB 存储密码和日志
3. **监控**：集成日志服务如 Loggly 或 DataDog
4. **安全**：使用环境变量存储敏感信息
5. **备份**：定期备份密码和日志数据

---

*测试说明：*
- *基础服务器端验证密码：`secret123`*
- *JWT 认证密码：`secret123`*
- *所有密码都在服务器端验证，不在客户端存储*
