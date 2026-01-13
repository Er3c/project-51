DROP TABLE IF EXISTS votes;
CREATE TABLE votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  country_code TEXT NOT NULL,
  vote_type TEXT NOT NULL, -- 'yes' or 'no'
  ip_hash TEXT UNIQUE,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX idx_votes_country ON votes(country_code);
