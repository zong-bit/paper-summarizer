-- ============================================
-- Paper Summarizer — Payment tables for Supabase
-- Run this in Supabase SQL Editor:
-- https://xgaxejeaxfhlupguqteu.supabase.co/dashboard/sql/new
-- ============================================

-- 1. Gumroad sales tracking table
CREATE TABLE IF NOT EXISTS gumroad_sales (
  id BIGSERIAL PRIMARY KEY,
  sale_id TEXT NOT NULL UNIQUE,
  email TEXT,
  product_name TEXT,
  plan TEXT,
  token TEXT,
  price NUMERIC,
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  refunded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Paddle sales tracking table
CREATE TABLE IF NOT EXISTS paddle_sales (
  id BIGSERIAL PRIMARY KEY,
  event_id TEXT,
  transaction_id TEXT,
  email TEXT,
  plan TEXT,
  token TEXT,
  price NUMERIC,
  currency TEXT,
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  refunded BOOLEAN DEFAULT FALSE,
  subscription_id TEXT,
  subscription_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Afdian (爱发电) orders tracking table
CREATE TABLE IF NOT EXISTS afdian_orders (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  token TEXT,
  name TEXT,
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Lemon Squeezy sales tracking table
CREATE TABLE IF NOT EXISTS lemon_squeezy_sales (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT,
  order_number BIGINT,
  email TEXT,
  variant_name TEXT,
  variant_id BIGINT,
  plan TEXT,
  token TEXT,
  total NUMERIC,
  currency TEXT,
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  refunded BOOLEAN DEFAULT FALSE,
  subscription_id TEXT,
  subscription_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_gumroad_sales_sale_id ON gumroad_sales(sale_id);
CREATE INDEX IF NOT EXISTS idx_paddle_sales_transaction_id ON paddle_sales(transaction_id);
CREATE INDEX IF NOT EXISTS idx_paddle_sales_subscription_id ON paddle_sales(subscription_id);
CREATE INDEX IF NOT EXISTS idx_afdian_orders_order_id ON afdian_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_lemon_squeezy_sales_order_id ON lemon_squeezy_sales(order_id);
CREATE INDEX IF NOT EXISTS idx_lemon_squeezy_sales_sub_id ON lemon_squeezy_sales(subscription_id);
