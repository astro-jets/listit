import { Pool } from "pg";

export async function initDb(pool: Pool) {
  try {
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- 1. ROLES
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
      );
      INSERT INTO roles (name) VALUES ('admin'), ('seller'), ('buyer') ON CONFLICT DO NOTHING;

      -- 2. CATEGORIES 
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL
      );

      -- 3. USERS
      CREATE TABLE IF NOT EXISTS users (
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

      -- 4. SHOPS (Keeping JSONB for Map Coordinates)
      CREATE TABLE IF NOT EXISTS shops (
        id SERIAL PRIMARY KEY,
        owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        logo_url TEXT,
        banner_url TEXT,
        location JSONB, -- Map coordinates {lat: x, lng: y}
        is_approved BOOLEAN DEFAULT false,
        status TEXT DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- 5. LISTINGS
      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
        seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        title TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        location TEXT, -- String location for display
        is_approved BOOLEAN DEFAULT false,
        status TEXT DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- 6. REVIEWS (Dual-Target Support)
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE, 
        shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,       
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT review_target_check CHECK (
          (listing_id IS NOT NULL AND shop_id IS NULL) OR 
          (listing_id IS NULL AND shop_id IS NOT NULL)
        )
      );

      -- 7. IMAGES & FAVORITES
      CREATE TABLE IF NOT EXISTS listing_images (
        id SERIAL PRIMARY KEY,
        listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, listing_id)
      );

      -- 8. SEED CATEGORIES
      INSERT INTO categories (name, slug) VALUES 
      ('Weapons', 'weapons'),
      ('Armor', 'armor'),
      ('Potions', 'potions'),
      ('Tools', 'tools'),
      ('Artifacts', 'artifacts')
      ON CONFLICT DO NOTHING;

      -- 9. TRIGGERS
      CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS users_updated ON users;
      CREATE TRIGGER users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
      DROP TRIGGER IF EXISTS shops_updated ON shops;
      CREATE TRIGGER shops_updated BEFORE UPDATE ON shops FOR EACH ROW EXECUTE FUNCTION update_timestamp();
      DROP TRIGGER IF EXISTS listings_updated ON listings;
      CREATE TRIGGER listings_updated BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    `);

    console.log("✅ Quest Finder DB Initialized (Shop JSONB maintained)");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}
