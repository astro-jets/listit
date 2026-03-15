CREATE TABLE users (
   id SERIAL PRIMARY KEY,
   email TEXT UNIQUE NOT NULL,
   password_hash TEXT NOT NULL,
   role TEXT NOT NULL CHECK (role IN ('ARTIST', 'ADMIN')),
   created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE releases (
   id SERIAL PRIMARY KEY,
   artist_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   title TEXT NOT NULL,
   genre TEXT NOT NULL,
   cover_url TEXT,
   status TEXT NOT NULL DEFAULT 'DRAFT'
     CHECK (status IN (
       'DRAFT',
       'PROCESSING',
       'PENDING_REVIEW',
       'PUBLISHED',
       'REJECTED'
     )),
   created_at TIMESTAMP DEFAULT NOW()
 );
CREATE INDEX idx_releases_artist ON releases(artist_id);

CREATE INDEX idx_releases_status ON releases(status);

CREATE TABLE tracks (
   id SERIAL PRIMARY KEY,
   release_id INT NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
   title TEXT NOT NULL,
   isrc TEXT,
   audio_url TEXT NOT NULL,
   duration INT,
   created_at TIMESTAMP DEFAULT NOW()
);


CREATE INDEX idx_tracks_release ON tracks(release_id);
