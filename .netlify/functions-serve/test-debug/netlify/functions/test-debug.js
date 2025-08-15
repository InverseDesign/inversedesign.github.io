// netlify/functions/test-debug.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      message: "\u6D4B\u8BD5\u51FD\u6570\u6B63\u5E38\u5DE5\u4F5C",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL ? "\u5DF2\u914D\u7F6E" : "\u672A\u914D\u7F6E",
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "\u5DF2\u914D\u7F6E" : "\u672A\u914D\u7F6E"
      }
    })
  };
};
//# sourceMappingURL=test-debug.js.map
