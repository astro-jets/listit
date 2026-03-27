import { Pool } from "pg";

export async function initDb(pool: Pool) {
  try {
    await pool.query(`
    -- =========================
    -- RESET: DROP ALL TABLES
    -- =========================
    DROP TABLE IF EXISTS audit_logs, reports, messages, reviews, listing_images, listings, shops, users, roles CASCADE;

    -- =========================
    -- EXTENSIONS
    -- =========================
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- =========================
    -- USER ROLES
    -- =========================
    CREATE TABLE roles (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    );

    INSERT INTO roles (name)
    VALUES ('admin'), ('seller'), ('buyer')
    ON CONFLICT (name) DO NOTHING;

    -- =========================
    -- USERS
    -- =========================
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role_id INTEGER REFERENCES roles(id),
      avatar_url TEXT,
      bio TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- =========================
    -- SHOPS
    -- =========================
    CREATE TABLE shops (
      id SERIAL PRIMARY KEY,
      owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      logo_url TEXT,
      location JSONB, -- Coordinates for Leaflet
      is_approved BOOLEAN DEFAULT false, -- Admin Moderation
      status TEXT DEFAULT 'available',    -- available, suspended
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- =========================
    -- LISTINGS
    -- =========================
    CREATE TABLE listings (
      id SERIAL PRIMARY KEY,
      shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
      seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      category TEXT,
      location TEXT, -- Simple string (e.g., "Aisle 4")
      is_approved BOOLEAN DEFAULT false, -- Admin Moderation
      status TEXT DEFAULT 'available',    -- available, sold
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- =========================
    -- SUPPORTING TABLES
    -- =========================
    CREATE TABLE listing_images (
      id SERIAL PRIMARY KEY,
      listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE reviews (
      id SERIAL PRIMARY KEY,
      listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE reports (
      id SERIAL PRIMARY KEY,
      reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
      target_type TEXT NOT NULL, -- 'listing', 'shop', 'review'
      target_id INTEGER NOT NULL,
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'open', -- open, resolved, dismissed
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE audit_logs (
      id SERIAL PRIMARY KEY,
      admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
      action TEXT NOT NULL,
      target_info TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- =========================
    -- TRIGGERS
    -- =========================
    CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    CREATE TRIGGER shops_updated BEFORE UPDATE ON shops FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    CREATE TRIGGER listings_updated BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    `);

    console.log("✅ Database reset and schema initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}
