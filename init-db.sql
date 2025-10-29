-- Initialisation de la base de données Jovoco
-- Ce fichier est exécuté automatiquement au démarrage de PostgreSQL

-- Créer la base de données si elle n'existe pas
CREATE DATABASE jovoco_db OWNER jovoco_user;

-- Se connecter à la base de données
\c jovoco_db

-- Donner tous les droits à l'utilisateur
GRANT ALL PRIVILEGES ON DATABASE jovoco_db TO jovoco_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO jovoco_user;
