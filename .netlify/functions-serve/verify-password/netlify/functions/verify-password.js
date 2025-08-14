// netlify/functions/verify-password.js
var crypto = require("crypto");
var PASSWORD_DB = {
  "content-1": {
    hash: crypto.createHash("sha256").update("secret123").digest("hex"),
    salt: "random-salt-1",
    attempts: 0,
    lastAttempt: null
  },
  "content-2": {
    hash: crypto.createHash("sha256").update("tech456").digest("hex"),
    salt: "random-salt-2",
    attempts: 0,
    lastAttempt: null
  },
  "content-3": {
    hash: crypto.createHash("sha256").update("business789").digest("hex"),
    salt: "random-salt-3",
    attempts: 0,
    lastAttempt: null
  }
};
var ACCESS_LOGS = [];
exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }
  try {
    const { contentId, password } = JSON.parse(event.body);
    if (!contentId || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing contentId or password" })
      };
    }
    if (!PASSWORD_DB[contentId]) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Content not found" })
      };
    }
    const content = PASSWORD_DB[contentId];
    const clientIP = event.headers["client-ip"] || event.headers["x-forwarded-for"] || "unknown";
    const userAgent = event.headers["user-agent"] || "unknown";
    const now = Date.now();
    const lockoutDuration = 15 * 60 * 1e3;
    if (content.lastAttempt && now - content.lastAttempt < lockoutDuration && content.attempts >= 5) {
      return {
        statusCode: 429,
        body: JSON.stringify({
          error: "Too many failed attempts. Please try again later.",
          remainingTime: Math.ceil((lockoutDuration - (now - content.lastAttempt)) / 1e3)
        })
      };
    }
    const inputHash = crypto.createHash("sha256").update(password + content.salt).digest("hex");
    const isValid = inputHash === content.hash;
    if (isValid) {
      content.attempts = 0;
      content.lastAttempt = null;
    } else {
      content.attempts += 1;
      content.lastAttempt = now;
    }
    ACCESS_LOGS.push({
      contentId,
      success: isValid,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ip: clientIP,
      userAgent,
      attempts: content.attempts
    });
    if (ACCESS_LOGS.length > 1e3) {
      ACCESS_LOGS.splice(0, 100);
    }
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      },
      body: JSON.stringify({
        valid: isValid,
        attempts: content.attempts,
        locked: content.attempts >= 5
      })
    };
  } catch (error) {
    console.error("Password verification error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};
//# sourceMappingURL=verify-password.js.map
