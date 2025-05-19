-- Insert 20 users with random auth patterns
INSERT INTO users (id, email, created_at, notion_connected, google_docs_connected)
SELECT 
  uuid_generate_v4(),
  'user' || num || '@example.com',
  NOW() - (random() * interval '365 days'),
  random() < 0.5,
  random() < 0.5
FROM generate_series(1, 20) num;

-- Insert 25 documents with varied sources
INSERT INTO documents (user_id, title, content, source_type, source_id)
SELECT 
  (SELECT id FROM users ORDER BY random() LIMIT 1),
  'Document ' || g || ' - ' || (CASE WHEN random() < 0.5 THEN 'Project Report' ELSE 'Meeting Notes' END),
  'This is the content for document ' || g || '. ' || repeat(md5(random()::text), 10),
  CASE WHEN random() < 0.5 THEN 'notion' ELSE 'google_docs' END,
  'source-' || g
FROM generate_series(1, 25) g;

-- Insert 30 page sections with placeholder embeddings
INSERT INTO page_sections (document_id, context, embedding)
SELECT 
  (SELECT id FROM documents ORDER BY random() LIMIT 1),
  'Section about ' || (CASE 
    WHEN random() < 0.3 THEN 'project milestones'
    WHEN random() < 0.6 THEN 'technical specifications'
    ELSE 'team collaboration'
  END),
  array_fill(0.0::real, ARRAY[1536])::vector(1536)
FROM generate_series(1, 30);

-- Insert 8 teams with random creators
INSERT INTO teams (name, created_by)
SELECT 
  'Team ' || (CASE 
    WHEN g % 2 = 0 THEN 'Alpha' 
    WHEN g % 3 = 0 THEN 'Beta' 
    ELSE 'Gamma' 
  END) || ' ' || g,
  (SELECT id FROM users ORDER BY random() LIMIT 1)
FROM generate_series(1, 8) g;

-- Insert team members (3-5 per team)
WITH team_ids AS (SELECT id FROM teams)
INSERT INTO team_members (team_id, user_id, role)
SELECT
  t.id,
  u.id,
  CASE WHEN random() < 0.2 THEN 'admin' ELSE 'member' END
FROM team_ids t
CROSS JOIN LATERAL (
  SELECT id FROM users ORDER BY random() LIMIT (3 + floor(random() * 3))
) u;

-- Insert email preferences for all users
INSERT INTO email_preferences (user_id)
SELECT id FROM users ON CONFLICT DO NOTHING;

-- Insert 30 notifications with random types
INSERT INTO notifications (user_id, type, message)
SELECT
  (SELECT id FROM users ORDER BY random() LIMIT 1),
  (CASE (floor(random() * 3))
    WHEN 0 THEN 'reminder'
    WHEN 1 THEN 'update'
    ELSE 'alert'
  END),
  'Notification: ' || (CASE 
    WHEN random() < 0.3 THEN 'Meeting tomorrow at 2 PM'
    WHEN random() < 0.6 THEN 'Document shared with you'
    ELSE 'Weekly summary available'
  END)
FROM generate_series(1, 30);
