-- SQL Database Schema for ATS CV Maker
-- Compatible with Neon PostgreSQL and Supabase PostgreSQL

CREATE TABLE IF NOT EXISTS resumes (
    id VARCHAR(255) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255),
    cv_data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookup by sync ID
CREATE INDEX IF NOT EXISTS idx_resumes_id ON resumes(id);

-- Optional Row Level Security (RLS) for Supabase:
-- Since client uses secret server-side routes to save/load, RLS is handled server-side.
-- But if using Supabase client directly, you might need to enable RLS:
-- ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
