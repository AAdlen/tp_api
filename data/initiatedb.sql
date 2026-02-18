-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           8.4.3 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour frogue
CREATE DATABASE IF NOT EXISTS `frogue` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `frogue`;

-- Listage de la structure de table frogue. games
CREATE TABLE IF NOT EXISTS `games` (
  `id` int NOT NULL AUTO_INCREMENT,
  `player_id` int unsigned NOT NULL,
  `seed` bigint unsigned NOT NULL,
  `current_floor` int unsigned DEFAULT (0),
  `current_monster` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT (0),
  `monster_hp` int unsigned DEFAULT '0',
  `monster_atk` int unsigned DEFAULT '0',
  `monster_def` int unsigned DEFAULT '0',
  `status` varchar(50) NOT NULL DEFAULT '"ongoing"',
  PRIMARY KEY (`id`),
  KEY `FK__players` (`player_id`),
  CONSTRAINT `FK__players` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de table frogue. monsters
CREATE TABLE IF NOT EXISTS `monsters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) DEFAULT NULL,
  `sprite` varchar(250) DEFAULT NULL,
  `sprite_hurt` varchar(250) DEFAULT NULL,
  `hp` int DEFAULT (0),
  `atk` int DEFAULT (0),
  `def` int DEFAULT (0),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de table frogue. players
CREATE TABLE IF NOT EXISTS `players` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `userclass` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `maxhp` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `str` int DEFAULT NULL,
  `int` int DEFAULT NULL,
  `def` int DEFAULT NULL,
  `speed` int DEFAULT NULL,
  `luck` int DEFAULT NULL,
  `deleted` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'no',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `monsters` (`id`, `name`, `sprite`, `sprite_hurt`, `hp`, `atk`, `def`) VALUES
	(1, 'Blob', 'https://i.imgur.com/ouEmdyd.png', 'https://i.imgur.com/1GmhmUy.png', 25, 6, 2),
	(2, 'Blab', 'https://i.imgur.com/4wYrTxb.png', 'https://i.imgur.com/UVDz4Kn.png', 40, 4, 4);

-- Les données exportées n'étaient pas sélectionnées.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
