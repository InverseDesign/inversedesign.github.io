-- Supabase 数据库初始化脚本
-- 用于 Hugo 评论系统

-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  post_id TEXT NOT NULL,
  post_title TEXT NOT NULL,
  author TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'spam', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建访问日志表
CREATE TABLE IF NOT EXISTS access_logs (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  post_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
CREATE INDEX IF NOT EXISTS idx_access_logs_action ON access_logs(action);
CREATE INDEX IF NOT EXISTS idx_access_logs_created_at ON access_logs(created_at);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全 (RLS)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- 创建策略
-- 允许所有人查看已批准的评论
CREATE POLICY "Allow public read approved comments" ON comments
  FOR SELECT USING (status = 'approved');

-- 允许所有人插入评论
CREATE POLICY "Allow public insert comments" ON comments
  FOR INSERT WITH CHECK (true);

-- 允许管理员更新评论
CREATE POLICY "Allow admin update comments" ON comments
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 允许管理员删除评论
CREATE POLICY "Allow admin delete comments" ON comments
  FOR DELETE USING (auth.role() = 'authenticated');

-- 允许所有人插入访问日志
CREATE POLICY "Allow public insert access logs" ON access_logs
  FOR INSERT WITH CHECK (true);

-- 允许管理员查看访问日志
CREATE POLICY "Allow admin read access logs" ON access_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- 创建函数来获取评论统计
CREATE OR REPLACE FUNCTION get_comments_stats()
RETURNS TABLE (
  total_comments BIGINT,
  approved_comments BIGINT,
  pending_comments BIGINT,
  spam_comments BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_comments,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_comments,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_comments,
    COUNT(*) FILTER (WHERE status = 'spam') as spam_comments
  FROM comments;
END;
$$ LANGUAGE plpgsql;

-- 创建函数来清理旧日志
CREATE OR REPLACE FUNCTION cleanup_old_logs(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM access_logs 
  WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 插入一些示例数据（可选）
INSERT INTO comments (post_id, post_title, author, email, content, status) VALUES
('/blog/supabase-comments-demo/', 'Supabase 评论系统演示', '张三', 'zhangsan@example.com', '这个评论系统真的很棒！界面简洁，功能完整。', 'approved'),
('/blog/supabase-comments-demo/', 'Supabase 评论系统演示', '李四', 'lisi@example.com', '感谢分享，学到了很多关于 Hugo 和 Supabase 的知识。', 'approved'),
('/blog/supabase-comments-demo/', 'Supabase 评论系统演示', '王五', 'wangwu@example.com', '请问如何配置 Supabase 项目？有详细的步骤说明吗？', 'approved')
ON CONFLICT DO NOTHING;
