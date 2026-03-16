import { Pool } from "pg";

export async function initDb(pool: Pool) {
  try {
    await pool.query(`
    -- =========================
    -- EXTENSIONS
    -- =========================
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- =========================
    -- USER ROLES
    -- =========================
    CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
    );

    INSERT INTO roles (name)
    VALUES ('admin'), ('seller'), ('buyer')
    ON CONFLICT (name) DO NOTHING;

    -- =========================
    -- USERS
    -- =========================
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

    -- =========================
    -- SHOPS
    -- =========================
    CREATE TABLE IF NOT EXISTS shops (
    id SERIAL PRIMARY KEY,
    owner_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    location JSONB,  -- Changed from TEXT to JSONB
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (owner_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    );
    -- =========================
    -- CATEGORIES
    -- =========================
    CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
    );

    -- =========================
    -- LISTINGS
    -- =========================
    CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    location JSONB,  -- Changed from TEXT to JSONB
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (shop_id)
    REFERENCES shops(id)
    ON DELETE CASCADE
    );

    -- =========================
    -- LISTING IMAGES
    -- =========================
    CREATE TABLE IF NOT EXISTS listing_images (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (listing_id)
    REFERENCES listings(id)
    ON DELETE CASCADE
    );

    -- =========================
    -- LISTING CATEGORIES
    -- =========================
    CREATE TABLE IF NOT EXISTS listing_categories (
    listing_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (listing_id, category_id),

    FOREIGN KEY (listing_id)
    REFERENCES listings(id)
    ON DELETE CASCADE,

    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE CASCADE
    );

    -- =========================
    -- REVIEWS
    -- =========================
    CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER,
    reviewer_id UUID,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (listing_id)
    REFERENCES listings(id)
    ON DELETE CASCADE,

    FOREIGN KEY (reviewer_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    );

    -- =========================
    -- FAVORITES (wishlist)
    -- =========================
    CREATE TABLE IF NOT EXISTS favorites (
    user_id UUID,
    listing_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, listing_id),

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    FOREIGN KEY (listing_id)
    REFERENCES listings(id)
    ON DELETE CASCADE
    );

    -- =========================
    -- MESSAGES (buyer ↔ seller)
    -- =========================
    CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    listing_id INTEGER,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (sender_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    FOREIGN KEY (receiver_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    FOREIGN KEY (listing_id)
    REFERENCES listings(id)
    ON DELETE SET NULL
    );

    -- =========================
    -- INDEXES
    -- =========================
    CREATE INDEX IF NOT EXISTS idx_users_role
    ON users(role_id);

    CREATE INDEX IF NOT EXISTS idx_shops_owner
    ON shops(owner_id);

    CREATE INDEX IF NOT EXISTS idx_listings_shop
    ON listings(shop_id);

    CREATE INDEX IF NOT EXISTS idx_images_listing
    ON listing_images(listing_id);

    CREATE INDEX IF NOT EXISTS idx_reviews_listing
    ON reviews(listing_id);

    CREATE INDEX IF NOT EXISTS idx_messages_sender
    ON messages(sender_id);

    CREATE INDEX IF NOT EXISTS idx_messages_receiver
    ON messages(receiver_id);

    -- =========================
    -- UPDATED_AT TRIGGER
    -- =========================
    CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER users_updated
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

    CREATE TRIGGER shops_updated
    BEFORE UPDATE ON shops
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

    CREATE TRIGGER listings_updated
    BEFORE UPDATE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

`);

    console.log("Database schema initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}
