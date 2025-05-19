-- First, create the google_clients table
CREATE TABLE IF NOT EXISTS google_clients (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    client_secret TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Now add the sample data
INSERT INTO google_clients (id, client_id, client_secret)
VALUES 
('test-cohort-1', 'your-test-client-id-1', 'your-test-client-secret-1'),
('test-cohort-2', 'your-test-client-id-2', 'your-test-client-secret-2');

-- Add sample users
INSERT INTO users (
    id,
    email,
    google_refresh_token,
    google_cohort,
    google_docs_connected
)
VALUES 
    -- User 1 with valid Google credentials
    (
        '00000000-0000-0000-0000-000000000001',
        'test1@example.com',
        'valid-refresh-token-1',
        'test-cohort-1',
        true
    ),
    -- User 2 with valid Google credentials but different cohort
    (
        '00000000-0000-0000-0000-000000000002',
        'test2@example.com',
        'valid-refresh-token-2',
        'test-cohort-2',
        true
    ),
    -- User 3 with invalid/missing Google credentials
    (
        '00000000-0000-0000-0000-000000000003',
        'test3@example.com',
        NULL,
        NULL,
        false
    );