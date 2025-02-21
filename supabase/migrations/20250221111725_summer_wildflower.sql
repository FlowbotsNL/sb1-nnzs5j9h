/*
  # B2B Wine Portal Schema

  1. New Tables
    - `domains`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `region` (text)
      - `description` (text)
      - `created_at` (timestamp)

    - `wines`
      - `id` (uuid, primary key)
      - `domain_id` (uuid, foreign key)
      - `name` (text)
      - `type` (text)
      - `year` (integer)
      - `description` (text)
      - `price_12` (decimal)
      - `price_96` (decimal)
      - `created_at` (timestamp)

    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `status` (text)
      - `created_at` (timestamp)

    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `wine_id` (uuid, foreign key)
      - `quantity` (integer)
      - `price_per_bottle` (decimal)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create domains table
CREATE TABLE domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  region text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create wines table
CREATE TABLE wines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id uuid REFERENCES domains(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  year integer NOT NULL,
  description text,
  price_12 decimal(10,2) NOT NULL,
  price_96 decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create order items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  wine_id uuid REFERENCES wines(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  price_per_bottle decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE wines ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read domains"
  ON domains FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read wines"
  ON wines FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow users to manage their own orders"
  ON orders FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to manage their own order items"
  ON order_items FOR ALL
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );