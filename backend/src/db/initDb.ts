import { Pool } from "pg";

export async function initDb(pool: Pool) {
  try {
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Useful for fuzzy searching names

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

      -- 3. USERS (Added phone and verification status)
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone_number TEXT UNIQUE NOT NULL, -- Mandatory for verification
        password TEXT NOT NULL,
        role_id INTEGER REFERENCES roles(id),
        avatar_url TEXT,
        bio TEXT,
        is_verified BOOLEAN DEFAULT false, -- For the rigorous verification process
        verification_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- 4. SHOPS (Approval is critical here)
      CREATE TABLE IF NOT EXISTS shops (
        id SERIAL PRIMARY KEY,
        owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        logo_url TEXT,
        banner_url TEXT,
        location JSONB, -- Coordinates
        address_text TEXT, -- Readable address for search
        is_approved BOOLEAN DEFAULT false, -- When true, all listings become visible
        status TEXT DEFAULT 'active', -- 'active', 'suspended', 'closed'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- 5. LISTINGS (Removed is_approved)
      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
        seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        title TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock_quantity INTEGER DEFAULT 1,
        status TEXT DEFAULT 'available', -- 'available', 'sold_out', 'archived'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- 6. REVIEWS
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

      -- 7. IMAGES, FAVORITES & REPLIES
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

      CREATE TABLE IF NOT EXISTS review_replies (
        id SERIAL PRIMARY KEY,
        review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
        shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
        reply_text TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(review_id)
      );

      -- 8. SEARCH OPTIMIZATION (GIN Indexes for the hybrid search)
      CREATE INDEX IF NOT EXISTS idx_listings_title_trgm ON listings USING gin (title gin_trgm_ops);
      CREATE INDEX IF NOT EXISTS idx_shops_name_trgm ON shops USING gin (name gin_trgm_ops);

      -- 9. SEED CATEGORIES
      INSERT INTO categories (name, slug) VALUES 
      ('Clothing', 'clothing'),
      ('Electronics', 'electronics'),
      ('Accessories', 'accessories'),
      ('Home & Garden', 'home-garden'),
      ('Health & Beauty', 'health-beauty'),
      ('Toys & Hobbies', 'toys-hobbies'),
      ('Sports', 'sports'),
      ('Automotive', 'automotive')
      ON CONFLICT DO NOTHING;

      -- 10. SEED DEFAULT ADMIN USER
      INSERT INTO users (username, email, phone_number, password, role_id, is_verified) 
      VALUES (
        'admin', 
        'admin@listit.com', 
        '+0000000000',
        '$2b$10$feY8I4RBFN2blDBwrlDar.jN9nidENCez6NEo1m0jBJqhxpWImA5O', 
        (SELECT id FROM roles WHERE name = 'admin'),
        true
      ) ON CONFLICT (email) DO NOTHING;

      -- 11. TRIGGERS
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

    console.log(
      "✅ Database initialized with Phone Verification & Unified Approval Logic",
    );
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}
