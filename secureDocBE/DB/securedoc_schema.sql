-- File: db.sql

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS securedoc;
USE securedoc;

-- 2. Users table
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Files table (adjusted created_by to allow NULL for ON DELETE SET NULL)
CREATE TABLE files (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  file_name VARCHAR(512) NOT NULL,
  local_url VARCHAR(1024) NOT NULL,
  size INT NOT NULL,
  owner INT NOT NULL,
  hardware_pin_hash VARCHAR(255),
  created_by INT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. File access permissions table
CREATE TABLE file_accesses (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  file_id INT NOT NULL,
  user_id INT NOT NULL,
  permission ENUM('read','write') NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Arduino configurations table
CREATE TABLE arduino_configs (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  console_hash VARCHAR(255) NOT NULL,
  enabled TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================
-- Dummy data inserts
-- ======================

-- Users
INSERT INTO users (id, email, password, role, created_at, updated_at) VALUES
  (1, 'admin@example.com', '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'admin', '2025-04-20 08:00:00', '2025-04-20 08:00:00'),
  (2, 'user@example.com',  '$2b$10$YYYYYYYYYYYYYYYYYYYYYYYYYYYYYY', 'user',  '2025-04-20 08:05:00', '2025-04-20 08:05:00');

-- Files
INSERT INTO files (id, file_name, local_url, size, owner, hardware_pin_hash, created_by, created_at) VALUES
  (1, 'report.pdf', '/uploads/report.pdf',  102400, 2, NULL, 2, '2025-04-20 09:00:00'),
  (2, 'image.png',  '/uploads/image.png',   204800, 2, NULL, 2, '2025-04-20 09:05:00');

-- File Accesses
INSERT INTO file_accesses (id, file_id, user_id, permission, created_at) VALUES
  (1, 1, 1, 'read',  '2025-04-20 09:10:00'),
  (2, 2, 1, 'write', '2025-04-20 09:15:00');

-- Arduino Configurations
INSERT INTO arduino_configs (id, console_hash, enabled, created_at, updated_at) VALUES
  (1, 'hardcoded_console_hash_example', 1, '2025-04-20 10:00:00', '2025-04-20 10:00:00');
