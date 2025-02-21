/*
  # Add test data for wine portal

  1. Sample Data
    - Add 3 domains with different regions
    - Add multiple wines for each domain
    - Include variety of wine types and years
    - Set realistic pricing
*/

-- Insert sample domains
INSERT INTO domains (id, name, region, description) VALUES
  ('d1b45fc0-1234-4321-a123-426614174001', 'Château Margaux', 'Bordeaux', 'One of the most prestigious wine producers in Bordeaux, known for their exceptional red wines.'),
  ('d1b45fc0-1234-4321-a123-426614174002', 'Domaine de la Romanée-Conti', 'Burgundy', 'Legendary Burgundy producer, creating some of the most sought-after wines in the world.'),
  ('d1b45fc0-1234-4321-a123-426614174003', 'Antinori', 'Tuscany', 'Historic Italian wine producer with over 600 years of winemaking excellence.');

-- Insert sample wines
INSERT INTO wines (domain_id, name, type, year, description, price_12, price_96) VALUES
  -- Château Margaux wines
  ('d1b45fc0-1234-4321-a123-426614174001', 'Château Margaux Grand Vin', 'Red Blend', 2018, 'Classic Bordeaux blend with notes of black fruit, tobacco, and cedar', 850.00, 800.00),
  ('d1b45fc0-1234-4321-a123-426614174001', 'Pavillon Rouge', 'Red Blend', 2019, 'Second wine of Château Margaux, elegant and refined', 350.00, 320.00),
  ('d1b45fc0-1234-4321-a123-426614174001', 'Pavillon Blanc', 'White', 2020, 'Pure Sauvignon Blanc with incredible depth and complexity', 250.00, 230.00),

  -- Domaine de la Romanée-Conti wines
  ('d1b45fc0-1234-4321-a123-426614174002', 'La Tâche', 'Pinot Noir', 2019, 'Intense and complex with red fruits and spice notes', 4500.00, 4300.00),
  ('d1b45fc0-1234-4321-a123-426614174002', 'Richebourg', 'Pinot Noir', 2018, 'Powerful and elegant with exceptional aging potential', 3800.00, 3600.00),
  ('d1b45fc0-1234-4321-a123-426614174002', 'Montrachet', 'Chardonnay', 2020, 'The pinnacle of white Burgundy', 8000.00, 7500.00),

  -- Antinori wines
  ('d1b45fc0-1234-4321-a123-426614174003', 'Tignanello', 'Super Tuscan', 2019, 'Pioneering Super Tuscan blend of Sangiovese, Cabernet Sauvignon, and Cabernet Franc', 150.00, 135.00),
  ('d1b45fc0-1234-4321-a123-426614174003', 'Solaia', 'Super Tuscan', 2018, 'Prestigious blend dominated by Cabernet Sauvignon', 450.00, 420.00),
  ('d1b45fc0-1234-4321-a123-426614174003', 'Cervaro della Sala', 'White Blend', 2021, 'Outstanding Chardonnay-based white from Umbria', 85.00, 75.00);