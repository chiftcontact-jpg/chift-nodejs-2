-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql
-- Généré le : mar. 27 jan. 2026 à 17:22
-- Version du serveur : 8.0.44
-- Version de PHP : 8.3.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `chift-community`
--

-- --------------------------------------------------------

--
-- Structure de la table `association`
--

CREATE TABLE `association` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `enroller_id` bigint DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `region_id` bigint DEFAULT NULL,
  `status_association` enum('ACTIF','INACTIF') DEFAULT NULL,
  `type_association` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `membership`
--

CREATE TABLE `membership` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `contribution_amount` float DEFAULT NULL,
  `contribution_score` int DEFAULT NULL,
  `enroller_id` bigint DEFAULT NULL,
  `joined_at` datetime(6) DEFAULT NULL,
  `member_id` bigint DEFAULT NULL,
  `nombre_part` int DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') DEFAULT NULL,
  `user_role` enum('ADHERENT','ADMIN','AGENT','MAKER') DEFAULT NULL,
  `saving_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `nom_service`
--

CREATE TABLE `nom_service` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `status_service` enum('ACTIF','INACTIF') DEFAULT NULL,
  `type_service` enum('COMPTE','SERVICE') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `saving`
--

CREATE TABLE `saving` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `active_men_count` int DEFAULT NULL,
  `active_women_count` int DEFAULT NULL,
  `caisse_numero` varchar(255) DEFAULT NULL,
  `collection_day` enum('FRIDAY','MONDAY','SATURDAY','SUNDAY','THURSDAY','TUESDAY','WEDNESDAY') DEFAULT NULL,
  `collection_day_details` varchar(255) DEFAULT NULL,
  `collection_frequency` enum('ANNUAL','BIWEEKLY','DAILY','MONTHLY','SEMIANNUAL','WEEKLY') DEFAULT NULL,
  `commune_id` bigint DEFAULT NULL,
  `deadline_date` date DEFAULT NULL,
  `digital_creation_date` date DEFAULT NULL,
  `duree_du_pret` date DEFAULT NULL,
  `enroller_id` bigint DEFAULT NULL,
  `event_deadline` varchar(255) DEFAULT NULL,
  `leket_collection_date` datetime(6) DEFAULT NULL,
  `model_used` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `physical_creation_date` date DEFAULT NULL,
  `solidarite` float DEFAULT NULL,
  `status_caisse` enum('ACTIF','INACTIF') DEFAULT NULL,
  `taux_interet` double DEFAULT NULL,
  `total_solidarite` float DEFAULT NULL,
  `association_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `association`
--
ALTER TABLE `association`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `membership`
--
ALTER TABLE `membership`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKayiqgt4w8mk8aio22tq62da35` (`saving_id`);

--
-- Index pour la table `nom_service`
--
ALTER TABLE `nom_service`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `saving`
--
ALTER TABLE `saving`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK7l2aj9mykt8llxhnn29qtvqo9` (`association_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `association`
--
ALTER TABLE `association`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `membership`
--
ALTER TABLE `membership`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `nom_service`
--
ALTER TABLE `nom_service`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `saving`
--
ALTER TABLE `saving`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `membership`
--
ALTER TABLE `membership`
  ADD CONSTRAINT `FKayiqgt4w8mk8aio22tq62da35` FOREIGN KEY (`saving_id`) REFERENCES `saving` (`id`);

--
-- Contraintes pour la table `saving`
--
ALTER TABLE `saving`
  ADD CONSTRAINT `FK7l2aj9mykt8llxhnn29qtvqo9` FOREIGN KEY (`association_id`) REFERENCES `association` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
