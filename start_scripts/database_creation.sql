-- REPLACE 'your_password' WITH A STRONG PASSWORD --

CREATE ROLE olymps WITH LOGIN PASSWORD 'your_password';

-- KEEP THE NAME OF THE DATABASE AS 'events' --

CREATE DATABASE olympiad_events WITH OWNER olymps;

\c olympiad_events


CREATE TABLE IF NOT EXISTS olympiads (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    fees TEXT,
    requirements TEXT,
    organizers TEXT,
    rewards TEXT,
    url TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'parsed', -- 'parsed' or 'unparsed' based on the return status of the parser function
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS olympiad_events (
    id SERIAL PRIMARY KEY,
    olympiad_id INTEGER NOT NULL REFERENCES olympiads(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    date_start TIMESTAMP,
    date_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_olympiads (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    olympiad_id INTEGER NOT NULL REFERENCES olympiads(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active', -- 'active' or 'registered'
    created_at TIMESTAMP DEFAULT NOW()
);

GRANT CONNECT ON DATABASE olympiad_events TO olymps;
GRANT USAGE ON SCHEMA public TO olymps;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO olymps;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO olymps;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO olymps;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO olymps;

GRANT ALL PRIVILEGES ON TABLES TO olymps;
GRANT ALL PRIVILEGES ON SEQUENCES TO olymps;


-- OPTIONAL: Add a sample olympiad to the database --
INSERT INTO olympiads (name, fees, requirements, organizers, rewards, url)
VALUES (
    'Olympiad Name',
    'Fees',
    'Requirements',
    'Organizers',
    'Rewards',
    'https://example.com/olympiad'
);