// netlify/functions/log-access.js
exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }
  try {
    const { contentId, success, timestamp, userAgent, ip } = JSON.parse(event.body);
    if (!contentId || success === void 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" })
      };
    }
    const clientIP = event.headers["client-ip"] || event.headers["x-forwarded-for"] || event.headers["x-real-ip"] || ip || "unknown";
    const logEntry = {
      contentId,
      success,
      timestamp: timestamp || (/* @__PURE__ */ new Date()).toISOString(),
      ip: clientIP,
      userAgent: userAgent || event.headers["user-agent"] || "unknown",
      referer: event.headers["referer"] || "unknown",
      method: event.httpMethod,
      path: event.path
    };
    console.log("Access Log:", JSON.stringify(logEntry));
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: true,
        message: "Access logged successfully"
      })
    };
  } catch (error) {
    console.error("Log access error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};
//# sourceMappingURL=log-access.js.map
