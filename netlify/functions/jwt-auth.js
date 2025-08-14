const crypto = require('crypto');

// JWT 密钥 (实际应用中应该使用环境变量)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-2024';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-super-secret-refresh-key-2024';

// 密码数据库 (实际应用中应该使用数据库)
const PASSWORD_DB = {
  'content-1': {
    hash: crypto.createHash('sha256').update('secret123').digest('hex'),
    salt: 'random-salt-1'
  },
  'content-2': {
    hash: crypto.createHash('sha256').update('tech456').digest('hex'),
    salt: 'random-salt-2'
  },
  'content-3': {
    hash: crypto.createHash('sha256').update('business789').digest('hex'),
    salt: 'random-salt-3'
  }
};

// 生成 JWT 令牌
function generateJWT(payload, secret, expiresIn = '1h') {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const exp = now + (expiresIn === '1h' ? 3600 : expiresIn === '7d' ? 7 * 24 * 3600 : 3600);

  const jwtPayload = {
    ...payload,
    iat: now,
    exp: exp
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(jwtPayload)).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// 验证 JWT 令牌
function verifyJWT(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [header, payload, signature] = parts;
    
    // 验证签名
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return null;
    }

    // 解析载荷
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());
    
    // 检查过期时间
    const now = Math.floor(Date.now() / 1000);
    if (decodedPayload.exp && decodedPayload.exp < now) {
      return null;
    }

    return decodedPayload;
  } catch (error) {
    return null;
  }
}

// 主处理函数
exports.handler = async (event, context) => {
  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { contentId, password, refreshToken } = JSON.parse(event.body);
    
    // 如果是刷新令牌请求
    if (refreshToken) {
      const payload = verifyJWT(refreshToken, REFRESH_SECRET);
      if (payload && payload.contentId) {
        // 生成新的访问令牌
        const newAccessToken = generateJWT(
          { contentId: payload.contentId, type: 'access' },
          JWT_SECRET,
          '1h'
        );

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          },
          body: JSON.stringify({
            success: true,
            accessToken: newAccessToken
          })
        };
      } else {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Invalid refresh token' })
        };
      }
    }

    // 密码验证
    if (!contentId || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing contentId or password' })
      };
    }

    // 检查内容是否存在
    if (!PASSWORD_DB[contentId]) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Content not found' })
      };
    }

    const content = PASSWORD_DB[contentId];
    const clientIP = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';

    // 验证密码
    const inputHash = crypto.createHash('sha256').update(password + content.salt).digest('hex');
    const isValid = inputHash === content.hash;

    if (isValid) {
      // 生成访问令牌和刷新令牌
      const accessToken = generateJWT(
        { contentId, type: 'access' },
        JWT_SECRET,
        '1h'
      );

      const refreshToken = generateJWT(
        { contentId, type: 'refresh' },
        REFRESH_SECRET,
        '7d'
      );

      // 记录成功访问
      console.log('Successful authentication:', {
        contentId,
        ip: clientIP,
        timestamp: new Date().toISOString()
      });

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        body: JSON.stringify({
          success: true,
          accessToken,
          refreshToken,
          expiresIn: 3600 // 1小时
        })
      };

    } else {
      // 记录失败访问
      console.log('Failed authentication attempt:', {
        contentId,
        ip: clientIP,
        timestamp: new Date().toISOString()
      });

      return {
        statusCode: 401,
        body: JSON.stringify({ 
          success: false,
          error: 'Invalid password' 
        })
      };
    }

  } catch (error) {
    console.error('JWT authentication error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
