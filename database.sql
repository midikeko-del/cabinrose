-- Database initialization script for Cabin Rose Station

-- Cipta jadual users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Cipta jadual settings
CREATE TABLE IF NOT EXISTS `settings` (
  `setting_key` VARCHAR(100) NOT NULL PRIMARY KEY,
  `setting_value` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Masukkan admin lalai: username='admin', password='cabinrose123'
-- Hash dijana menggunakan password_hash('cabinrose123', PASSWORD_DEFAULT)
INSERT INTO `users` (`username`, `password`) 
VALUES ('admin', '$2y$10$qlkyqMpHwhYz.PZRXblND.yj0/GWEJd/4g8C9cq7BNSh6G4bm4Pzu')
ON DUPLICATE KEY UPDATE `password` = '$2y$10$qlkyqMpHwhYz.PZRXblND.yj0/GWEJd/4g8C9cq7BNSh6G4bm4Pzu';

-- Masukkan nilai tetapan lalai
INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('whatsapp', '60139642739'),
('phone_display', '013-964 2739'),
('hours_daily_ms', '11:00 pagi - 11:00 malam'),
('hours_daily_en', '11:00 AM - 11:00 PM'),
('hours_fri_ms', '3:00 petang - 11:00 malam'),
('hours_fri_en', '3:00 PM - 11:00 PM'),
('hours_weekday_ms', '11:00 pagi - 11:00 malam'),
('hours_weekday_en', '11:00 AM - 11:00 PM'),
('hours_friday_ms', '3:00 petang - 11:00 malam'),
('hours_friday_en', '3:00 PM - 11:00 PM'),
('menu_i1_name_ms', 'Corndog Signature'),
('menu_i1_name_en', 'Signature Corndog'),
('menu_i1_desc_ms', 'Rangup di luar, cheese melt di dalam. Sebab utama orang datang semula.'),
('menu_i1_desc_en', 'Crispy outside, molten cheese inside. The reason people keep coming back.'),
('menu_i2_name_ms', 'Nasi Buttermilk'),
('menu_i2_name_en', 'Buttermilk Rice'),
('menu_i2_desc_ms', 'Ayam crispy bersalut sos buttermilk yang lemak dan manis.'),
('menu_i2_desc_en', 'Crispy chicken coated in a rich, creamy buttermilk sauce.'),
('menu_i3_name_ms', 'Chicken Chop & Grill'),
('menu_i3_name_en', 'Chicken Chop & Grill'),
('menu_i3_desc_ms', 'Western klasik, dimasak segar dengan sos homemade.'),
('menu_i3_desc_en', 'Western classics, cooked fresh with homemade sauce.'),
('menu_i4_name_ms', 'Kopi & Dessert'),
('menu_i4_name_en', 'Coffee & Dessert'),
('menu_i4_desc_ms', 'Kopi pekat dan pencuci mulut untuk sesi lepak petang.'),
('menu_i4_desc_en', 'Good coffee and desserts for slow evenings.')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);
