-- Initialize marketplace database with Prisma schema tables
-- This script will be run automatically by the system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Note: Tables will be created by Prisma migrate
-- This script seeds initial data

-- Insert sample categories
INSERT INTO categories (id, name, slug, description, created_at, updated_at) VALUES
  (gen_random_uuid()::text, 'Electronics', 'electronics', 'Latest gadgets and electronic devices', NOW(), NOW()),
  (gen_random_uuid()::text, 'Fashion', 'fashion', 'Trendy clothing and accessories', NOW(), NOW()),
  (gen_random_uuid()::text, 'Home & Garden', 'home-garden', 'Everything for your home and garden', NOW(), NOW()),
  (gen_random_uuid()::text, 'Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Note: Products will be managed through Sanity CMS
