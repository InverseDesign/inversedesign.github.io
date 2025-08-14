// netlify/functions/jwt-auth.js
var crypto = require("crypto");
var JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-2024";
var REFRESH_SECRET = process.env.REFRESH_SECRET || "your-super-secret-refresh-key-2024";
var PASSWORD_DB = {
  "content-1": {
    hash: crypto.createHash("sha256").update("secret123").digest("hex"),
    salt: "random-salt-1"
  },
  "content-2": {
    hash: crypto.createHash("sha256").update("tech456").digest("hex"),
    salt: "random-salt-2"
  },
  "content-3": {
    hash: crypto.createHash("sha256").update("business789").digest("hex"),
    salt: "random-salt-3"
  }
};
function generateJWT(payload, secret, expiresIn = "1h") {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  const now = Math.floor(Date.now() / 1e3);
  const exp = now + (expiresIn === "1h" ? 3600 : expiresIn === "7d" ? 7 * 24 * 3600 : 3600);
  const jwtPayload = {
    ...payload,
    iat: now,
    exp
  };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(jwtPayload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(`${encodedHeader}.${encodedPayload}`).digest("base64url");
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}
function verifyJWT(token, secret) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const [header, payload, signature] = parts;
    const expectedSignature = crypto.createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url");
    if (signature !== expectedSignature) {
      return null;
    }
    const decodedPayload = JSON.parse(Buffer.from(payload, "base64url").toString());
    const now = Math.floor(Date.now() / 1e3);
    if (decodedPayload.exp && decodedPayload.exp < now) {
      return null;
    }
    return decodedPayload;
  } catch (error) {
    return null;
  }
}
exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }
  try {
    const { contentId, password, refreshToken } = JSON.parse(event.body);
    if (refreshToken) {
      const payload = verifyJWT(refreshToken, REFRESH_SECRET);
      if (payload && payload.contentId) {
        const newAccessToken = generateJWT(
          { contentId: payload.contentId, type: "access" },
          JWT_SECRET,
          "1h"
        );
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate"
          },
          body: JSON.stringify({
            success: true,
            accessToken: newAccessToken
          })
        };
      } else {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Invalid refresh token" })
        };
      }
    }
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
    const inputHash = crypto.createHash("sha256").update(password + content.salt).digest("hex");
    const isValid = inputHash === content.hash;
    if (isValid) {
      const accessToken = generateJWT(
        { contentId, type: "access" },
        JWT_SECRET,
        "1h"
      );
      const refreshToken2 = generateJWT(
        { contentId, type: "refresh" },
        REFRESH_SECRET,
        "7d"
      );
      console.log("Successful authentication:", {
        contentId,
        ip: clientIP,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        },
        body: JSON.stringify({
          success: true,
          accessToken,
          refreshToken: refreshToken2,
          expiresIn: 3600
          // 1小时
        })
      };
    } else {
      console.log("Failed authentication attempt:", {
        contentId,
        ip: clientIP,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          error: "Invalid password"
        })
      };
    }
  } catch (error) {
    console.error("JWT authentication error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};
//# sourceMappingURL=jwt-auth.js.map
