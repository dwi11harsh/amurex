CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT auth.uid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  notion_connected BOOLEAN DEFAULT FALSE,
  notion_access_token TEXT,
  notion_workspace_id TEXT,
  notion_bot_id TEXT,
  google_docs_connected BOOLEAN DEFAULT FALSE,
  google_access_token TEXT,
  google_refresh_token TEXT
);

-- Documents table (needed for search functionality)
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT,
  source_type TEXT NOT NULL, -- 'notion', 'google_docs', 'gmail', etc.
  source_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Page sections table (for vector search)
CREATE TABLE IF NOT EXISTS page_sections (
  id SERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES documents(id),
  context TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  team_id UUID REFERENCES teams(id),
  user_id UUID REFERENCES users(id),
  role TEXT NOT NULL, -- 'admin', 'member'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (team_id, user_id)
);

-- Email preferences table
CREATE TABLE IF NOT EXISTS email_preferences (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  daily_digest BOOLEAN DEFAULT TRUE,
  weekly_summary BOOLEAN DEFAULT TRUE,
  meeting_reminders BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
