-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql
-- Généré le : mar. 27 jan. 2026 à 17:23
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
-- Base de données : `chift-transaction`
--

-- --------------------------------------------------------

--
-- Structure de la table `paiement_pret`
--

CREATE TABLE `paiement_pret` (
  `id` bigint NOT NULL,
  `date_paiement` date DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `method_payment` enum('CASH','MOBILE_MONEY') DEFAULT NULL,
  `montant` double DEFAULT NULL,
  `origin_transaction` enum('COMMUNITY','USER') DEFAULT NULL,
  `type_transaction` enum('DEPOSIT','WITHDRAWAL') DEFAULT NULL,
  `pret_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `pret`
--

CREATE TABLE `pret` (
  `id` bigint NOT NULL,
  `caisse_id` bigint DEFAULT NULL,
  `canal_reception` varchar(255) DEFAULT NULL,
  `date_demande` date DEFAULT NULL,
  `date_limite` date DEFAULT NULL,
  `membre_id` bigint DEFAULT NULL,
  `montant_demande` double DEFAULT NULL,
  `montant_restant` double DEFAULT NULL,
  `montant_total` double DEFAULT NULL,
  `numero_canal_reception` varchar(255) DEFAULT NULL,
  `statu_demande_pret` enum('ACCEPTER','EN_ATTENTE','REFUSER','TERMINER') DEFAULT NULL,
  `statut` enum('EN_COURS','EN_RETARD','REFUSER','REMBOURSE') DEFAULT NULL,
  `taux_interet` double DEFAULT NULL,
  `type_pret` enum('CAISSE','CHIFT') DEFAULT NULL,
  `user_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `transaction`
--

CREATE TABLE `transaction` (
  `id` bigint NOT NULL,
  `caisse_id` bigint DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `membership_id` bigint DEFAULT NULL,
  `method` enum('CASH','MOBILE_MONEY') DEFAULT NULL,
  `montant` float DEFAULT NULL,
  `origin` enum('COMMUNITY','USER') DEFAULT NULL,
  `type` enum('DEPOSIT','WITHDRAWAL') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `paiement_pret`
--
ALTER TABLE `paiement_pret`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK2eka6svqmrg3qo90yt6ldid9h` (`pret_id`);

--
-- Index pour la table `pret`
--
ALTER TABLE `pret`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `paiement_pret`
--
ALTER TABLE `paiement_pret`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `pret`
--
ALTER TABLE `pret`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `paiement_pret`
--
ALTER TABLE `paiement_pret`
  ADD CONSTRAINT `FK2eka6svqmrg3qo90yt6ldid9h` FOREIGN KEY (`pret_id`) REFERENCES `pret` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
