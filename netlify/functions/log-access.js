// 访问日志记录函数
exports.handler = async (event, context) => {
  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { contentId, success, timestamp, userAgent, ip } = JSON.parse(event.body);
    
    // 基本验证
    if (!contentId || success === undefined) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // 获取真实客户端IP
    const clientIP = event.headers['client-ip'] || 
                    event.headers['x-forwarded-for'] || 
                    event.headers['x-real-ip'] || 
                    ip || 
                    'unknown';

    // 记录访问日志
    const logEntry = {
      contentId,
      success,
      timestamp: timestamp || new Date().toISOString(),
      ip: clientIP,
      userAgent: userAgent || event.headers['user-agent'] || 'unknown',
      referer: event.headers['referer'] || 'unknown',
      method: event.httpMethod,
      path: event.path
    };

    // 在实际应用中，这里应该将日志写入数据库
    // 例如：MongoDB, PostgreSQL, 或者云服务如 AWS CloudWatch
    console.log('Access Log:', JSON.stringify(logEntry));

    // 可以发送到外部日志服务
    // await sendToLogService(logEntry);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Access logged successfully' 
      })
    };

  } catch (error) {
    console.error('Log access error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

// 发送到外部日志服务的示例函数
async function sendToLogService(logEntry) {
  // 示例：发送到 Loggly
  // const response = await fetch('https://logs-01.loggly.com/inputs/YOUR_TOKEN/tag/http/', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(logEntry)
  // });

  // 示例：发送到 DataDog
  // const response = await fetch('https://http-intake.logs.datadoghq.com/api/v2/logs', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'DD-API-KEY': 'YOUR_API_KEY'
  //   },
  //   body: JSON.stringify([logEntry])
  // });

  // 示例：发送到 AWS CloudWatch
  // const AWS = require('aws-sdk');
  // const cloudwatch = new AWS.CloudWatchLogs();
  // await cloudwatch.putLogEvents({
  //   logGroupName: '/your-app/access-logs',
  //   logStreamName: 'password-verification',
  //   logEvents: [{
  //     timestamp: Date.now(),
  //     message: JSON.stringify(logEntry)
  //   }]
  // }).promise();
}
